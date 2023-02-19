const repos = document.getElementById("repos");

const skeleton = `<div class="repo skeleton"><h2><div class="skeleton-line"></div></h2><p class="skeleton-a skeleton-line"></p><p class="description skeleton-line"></p></div>`;
for (let i = 0; i < 3; i++) {
    repos.innerHTML += skeleton + "\n";
}

fetch("https://api.github.com/users/namefox/repos").then((r) => r.json()).then((json) => {
    if (json.message) {
        console.log(json);
        repos.innerHTML = "<p><br>error loading projects. try again later.<br>go to my <a href=\"https://github.com/namefox\">github</a> and <a href=\"https://namefox.itch.io\">itch.io</a> pages to see my projects.<br><br>" + json.message.toLowerCase().split(" (")[0] + "</p>";
        return;
    }

    console.log("Gathered repository data (" + json.length + " public repos)");
    repos.innerHTML = "";

    const addGit = (item) => {
        if (item.name === "namefox.github.io") return;

        const div = document.createElement("div");
        div.id = item.name;
        div.classList.add("repo");

        const h1 = document.createElement("h2");

        h1.innerText = item.name.replaceAll("-", " ") + (item.fork ? " (fork)" : "");
        div.append(h1);

        const links = document.createElement("p");

        links.innerHTML = `<a href="./assets/?repo=${item.name}">page</a> | <a href="https://github.com/namefox/${item.name}">github</a>${item.topics[0] === "game" ? ` | <a href="https://namefox.itch.io/${item.name}">itch.io</a>` : ""}`;

        div.append(links);

        const description = document.createElement("p");
        description.classList.add("description");
        description.innerText = item.description;
        div.append(description);

        repos.append(div);
    }

    json.forEach(item => {
        addGit(item);
    });

    if (repos.childElementCount == 0) {
        repos.innerHTML = "<p><br>nothing here yet :(</p>";
    }
});