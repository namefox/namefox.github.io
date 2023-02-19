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
            return "<img src=\"" + item.download_url + "\">";
        }
    });

    return "<img src=\"./repo.png\">";
};

fetch(`https://api.github.com/repos/namefox/${repoParam}/contents`).then((r) => r.json()).then((json) => {
    if (json.message === "Not Found") {
        document.title = "namefox - not found";
        image.innerHTML = "<img src=\"./repo.png\">";
        repoName.innerHTML = "not found";
        readme.innerHTML = "<h2>repository not found</h2>\n<p><a href=\"..\">go back</a></p>";
        repos.innerHTML = "";
        return;
    }

    document.title = "namefox - " + repoParam;

    repoName.innerHTML = repoParam;
    findReadme(json).then((t) => readme.innerHTML = marked.parse(t));

    image.innerHTML = findImage(json);
});