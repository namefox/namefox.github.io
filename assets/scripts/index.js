const repos = document.getElementById("repos");

const skeleton = `<div class="repo skeleton"><h2><div class="skeleton-line"></div></h2><p class="skeleton-a skeleton-line"></p><p class="description skeleton-line"></p></div>`;
for (let i = 0; i < 3; i++) {
    repos.innerHTML += skeleton + "\n";
}

const findStringIn = (array, string) => {
    let index = -1;
    let i = 0;
    array.forEach(str => {
        if (string.toLowerCase() === str.toLowerCase())
            index = i;
        i++;
    });

    return index;
}

let repoData;
let filterRepoData;
const parseRepoData = (json) => {
    if (!json) json = [];
    if (json.message) {
        console.error(json);
        repos.innerHTML = "<p><br>error loading projects. try again later.<br>go to my <a href=\"https://github.com/namefox\">github</a> and <a href=\"https://namefox.itch.io\">itch.io</a> pages to see my projects.<br><br>" + json.message.toLowerCase().split(" (")[0] + "</p>";
        return;
    }

    repos.innerHTML = "";

    json.forEach(item => {
        if (item.name === "namefox.github.io") return;

        const div = document.createElement("div");
        div.id = item.name;
        div.classList.add("repo");

        const h1 = document.createElement("h2");

        h1.innerText = item.name.replaceAll("-", " ") + (item.fork ? " (fork)" : "");
        div.append(h1);

        let game = findStringIn(item.topics, "game") >= 0;

        const links = document.createElement("p");
        links.innerHTML = `<a href="/assets/?repo=${item.name}">page</a> | <a href="https://github.com/namefox/${item.name}" target="_blank">github</a>${game ? ` | <a href="https://namefox.itch.io/${item.name}" target="_blank">itch.io</a>` : ""}`;

        div.append(links);

        const description = document.createElement("p");
        description.classList.add("description");
        description.innerText = item.description;
        div.append(description);

        repos.append(div);
    });

    if (repos.childElementCount == 0) {
        repos.innerHTML = "<p><br>nothing here yet :(</p>";
    }
};

let saved = sessionStorage.getItem("Repos");
if (saved) {
    console.log("Repository data gathered from session");

    const json = JSON.parse(saved);
    parseRepoData(json);

    repoData = json;
} else {
    fetch("https://api.github.com/users/namefox/repos").then((r) => r.json()).then((json) => {
        parseRepoData(json);
        sessionStorage.setItem("Repos", JSON.stringify(json));

        repoData = json;

        console.log("Repository data requested from API");
    });
}

const searchInput = document.getElementById("search");

const search = () => {
    let filter = [];
    let queries = searchInput.value.toLowerCase().split(" ");

    if (queries[0] === "") {
        parseRepoData(repoData);
        return;
    }

    let canUseDescription = true;
    let canUseTopics = true;
    let canUseName = true;

    repoData.forEach(repo => {
        let added = false;

        // Go through queries
        queries.forEach((query) => {
            if (query === "") return;

            if (query.startsWith("exclude:")) {
                let exclude = query.split("exclude:")[1];

                if (exclude === "description") canUseDescription = false;
                else if (exclude === "name") canUseName = false;
                else if (exclude === "topics") canUseTopics = false;

                return;
            } else if (query.startsWith("by:")) {
                let by = query.split("by:")[1];

                if (by === "description") {
                    canUseDescription = true;
                    canUseName = false;
                    canUseTopics = false;
                } else if (by === "name") {
                    canUseDescription = false;
                    canUseName = true;
                    canUseTopics = false;
                } else if (by === "topic") {
                    canUseDescription = false;
                    canUseName = false;
                    canUseTopics = true;
                }

                return;
            }

            // Jump to page if repo name is equal
            if (repo.name.toLowerCase() === query) {
                window.location.href = "/assets/?repo=" + repo.name;
            }

            // Search for name
            if (repo.name.toLowerCase().includes(query) && canUseName && !added) {
                added = true;
                filter.push(repo);
            }
            
            // Search for description
            if (repo.description.toLowerCase().includes(query) && canUseDescription && !added) {
                added = true;
                filter.push(repo);
            }

            // Search for topics
            repo.topics.forEach(topic => {
                if (topic.toLowerCase().replaceAll("-", " ").includes(query) && canUseTopics && !added) {
                    added = true;
                    filter.push(repo);
                }
            });
        });
    });

    if (!filter.length) {
        filter = repoData;

        searchInput.value = "";
        searchInput.setAttribute("placeholder", "no results found");
    }

    parseRepoData(filter);
};

searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter")
        search();
});

searchInput.addEventListener("focusout", () => search());

search();