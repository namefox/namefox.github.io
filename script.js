const repos = document.getElementById("repos");
const skeleton = `<div class="repo skeleton"><h2><div class="skeleton-line"></div></h2><p class="skeleton-a skeleton-line"></p><p class="description skeleton-line"></p></div>`;

for (let i = 0; i < 3; i++) {
    repos.innerHTML += skeleton + "\n";
}

fetch("https://api.github.com/users/namefox/repos").then((r) => r.json()).then((json) => {
    console.log("Gathered repository data (" + json.length + " public repos)");
    repos.innerHTML = "";

    const addGit = (item) => {
        if (item.name === "namefox") return;

        const div = document.createElement("div");
        div.id = item.name;
        div.classList.add("repo");

        const h1 = document.createElement("h2");

        h1.innerText = item.name.replaceAll("-", " ") + (item.fork ? " (fork)" : "");
        div.append(h1);

        const links = document.createElement("p");

        const full = document.createElement("a");
        full.innerText = item.full_name;
        full.target = "_blank";
        full.href = item.html_url;

        if (item.topics[0] === "game") {
            const itch = document.createElement("a");
            itch.innerText = "itch.io";
            itch.href = "https://namefox.itch.io/" + item.name;
            itch.target = "_blank";
            links.append(itch);

            links.innerHTML = links.innerHTML + " | ";

            full.innerText = "github";
        }

        links.append(full);

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