const repos = document.getElementById("repos");

const skeleton = `<div class="repo skeleton"><h2><div class="skeleton-line"></div></h2><p class="skeleton-a skeleton-line"></p><p class="description skeleton-line"></p></div>`;
for (let i = 0; i < 3; i++) {
    repos.innerHTML += skeleton + "\n";
}

const urlParams = new URLSearchParams(window.location.search);
const repoParam = urlParams.get('repo');

githubLink.href = "https://github.com/namefox/" + repoParam;

const findReadme = (json) => {
    return new Promise((resolve) => {
        let found = false;
        json.forEach(item => {
            if (item.name === "README.md") {
                fetch(item.download_url).then((r) => r.text()).then((t) => resolve(t));
                found = true;
            }
        });

        if (!found) resolve("# repository doesn't have a readme");
    });
};

const findImage = (json) => {
    json.forEach(item => {
        if (item.name === "favicon.ico") {
            return item.download_url;
        }
    });

    return "/repo.png";
};

const loadJSON = (json) => {
    if (json.message === "Not Found") {
        document.title = "namefox - not found";
        image.innerHTML = "<img src=\"/repo.png\">";
        repoName.innerHTML = "not found";
        readme.innerHTML = "<h2>repository not found</h2><br><p><a href=\"..\">go back</a></p>";
        repos.innerHTML = "";
        return;
    } else if (json.message) {
        document.title = "namefox - not err";
        image.innerHTML = "<img src=\"/repo.png\">";
        repoName.innerHTML = "error";
        readme.innerHTML = "<h2>an error occurred</h2><br><p>" + json.message + "</p><br><p><a href=\"..\">go back</a></p>";
        repos.innerHTML = "";
    }

    document.title = "namefox - " + repoParam.replaceAll("-", " ");

    repoName.innerHTML = repoParam.replaceAll("-", " ");
    findReadme(json).then((t) => readme.innerHTML = marked.parse(t));

    image.innerHTML = "<img src=\"" + findImage(json) + "\">";
    shortcutIcon.href = findImage(json);
};

const loadReleases = (json) => {
    if (json.message === "Not Found") {
        document.title = "namefox - not found";
        image.innerHTML = "<img src=\"/repo.png\">";
        repoName.innerHTML = "not found";
        readme.innerHTML = "<h2>repository not found</h2><br><p><a href=\"..\">go back</a></p>";
        repos.innerHTML = "";
        return;
    } else if (json.message) {
        document.title = "namefox - error";
        image.innerHTML = "<img src=\"/repo.png\">";
        repoName.innerHTML = "error";
        readme.innerHTML = "<h2>an error occurred</h2><br><p>" + json.message + "</p><br><p><a href=\"..\">go back</a></p>";
        repos.innerHTML = "";
    }
    
    repos.innerHTML = "";
    json.forEach((item) => {
        const div = document.createElement("div");
        div.id = item.name;
        div.classList.add("repo");

        const h1 = document.createElement("h2");

        h1.innerText = item.name.replaceAll("-", " ") + (item.fork ? " (fork)" : "");
        div.append(h1);

        const links = document.createElement("p");

        links.innerHTML = `<a href="${item.zipball_url}">zip</a> | <a href="${item.tarball_url}">tar</a>`;

        div.append(links);

        const description = document.createElement("p");
        description.classList.add("description", "markdown");
        description.innerHTML = marked.parse(item.body);
        div.append(description);

        repos.append(div);
    });

    if (repos.childElementCount == 0) {
        repos.innerHTML = "<p><br>nothing here yet :(</p>";
    }
};

let saved = sessionStorage.getItem(repoParam + "Contents");
let savedReleases = sessionStorage.getItem(repoParam + "Releases");

if (repoParam && repoParam.includes("/")) {
    loadJSON([{name:"README.md",download_url:"/different-user.md"}]);
    loadReleases([]);

    throw new Error("Security: Can not access repositories from different account");
}

if (saved) {
    console.log("Project data gathered from session");
    loadJSON(JSON.parse(saved));
} else {
    fetch(`https://api.github.com/repos/namefox/${repoParam}/contents`).then((r) => r.json()).then((json) => {
        loadJSON(json);
        sessionStorage.setItem(repoParam + "Contents", JSON.stringify(json));
        console.log("Project data requested from API");
    });
}

if (savedReleases) {
    loadReleases(JSON.parse(savedReleases));
    console.log("Project releases gathered from session");
} else {
    fetch(`https://api.github.com/repos/namefox/${repoParam}/releases`).then((r) => r.json()).then((json) => {
        loadReleases(json);
        sessionStorage.setItem(repoParam + "Releases", JSON.stringify(json));
        console.log("Project releases gathered from API");
    });
}