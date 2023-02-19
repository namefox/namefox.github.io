const repos = document.getElementById("repos");

const skeleton = `<div class="repo skeleton"><h2><div class="skeleton-line"></div></h2><p class="skeleton-a skeleton-line"></p><p class="description skeleton-line"></p></div>`;
for (let i = 0; i < 3; i++) {
    repos.innerHTML += skeleton + "\n";
}

const urlParams = new URLSearchParams(window.location.search);
const repoParam = urlParams.get('repo');

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

    return "./repo.png";
};

const loadJSON = (json) => {
    if (json.message === "Not Found") {
        document.title = "namefox - not found";
        image.innerHTML = "<img src=\"./repo.png\">";
        repoName.innerHTML = "not found";
        readme.innerHTML = "<h2>repository not found</h2><br><p><a href=\"..\">go back</a></p>";
        repos.innerHTML = "";
        return;
    } else if (json.message) {
        document.title = "namefox - not err";
        image.innerHTML = "<img src=\"./repo.png\">";
        repoName.innerHTML = "error";
        readme.innerHTML = "<h2>an error occurred</h2><br><p>" + json.message + "</p><br><p><a href=\"..\">go back</a></p>";
        repos.innerHTML = "";
    }

    document.title = "namefox - " + repoParam;

    repoName.innerHTML = repoParam;
    findReadme(json).then((t) => readme.innerHTML = marked.parse(t));

    image.innerHTML = "<img src=\"" + findImage(json) + "\">";
    shortcutIcon.href = findImage(json);
};

let saved = sessionStorage.getItem(repoParam + "Contents");
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