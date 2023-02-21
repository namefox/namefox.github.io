const posts = document.getElementById("posts");

const skeleton = `<div class="repo noscale markdown"><div class="post-image"><div class="skeleton-image"></div></div><h1><div class="skeleton-line big"></div></h1><p><div class="skeleton-line"></div></p><br><p class="darker"><div class="skeleton-line"></div></p></div>`;
for (let i = 0; i < 3; i++) {
    posts.innerHTML += skeleton;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import * as authMod from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import * as storageMod from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCAxIwTW-9uuxZ3utmsLkXmKD3N8mt-tww",
    authDomain: "namefox-base.firebaseapp.com",
    projectId: "namefox-base",
    storageBucket: "namefox-base.appspot.com",
    messagingSenderId: "298745688724",
    appId: "1:298745688724:web:7338c375a739b59618fa81"
};

const app = initializeApp(firebaseConfig);
const auth = authMod.getAuth();
const storage = storageMod.getStorage();

let canComment = false;
authMod.onAuthStateChanged(auth, (user) => {
    canComment = user != null;

    const disable = document.querySelectorAll(".not-logged-in");
    disable.forEach((e) => {
        if (canComment) e.classList.add("invisible");
        else e.classList.remove("invisible");
    });

    const enable = document.querySelectorAll(".logged-in");
    enable.forEach((e) => {
        e.classList.add("invisible");
        if (canComment) e.classList.remove("invisible");
    });

    const admin = document.querySelectorAll(".admin");
    admin.forEach((e) => {
        e.classList.add("invisible");
        if (canComment && user.uid == "xFHBixF9jCPXEdzNz9ZDwHXYJeI2") e.classList.remove("invisible");
    });
});

const post = new URLSearchParams(window.location.search).get("post");

const getURL = (url) => {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'text';

        xhr.onload = () => {
            resolve(xhr.response);
        };

        xhr.open('GET', url);
        xhr.send();
    });
};

const parseData = (url) => {
    return new Promise((resolve) => {
        getURL(url).then((data) => {
            resolve(JSON.parse(data));
        });
    });
};

if (!post) {

if (sessionStorage.getItem("Posts") != null) {
    console.log("Posts gathered from session");

    posts.innerHTML = sessionStorage.Posts;
    if (posts.childElementCount == 0) {
        posts.innerHTML = "<p><br>nothing here yet :(</p>";
    }
} else {
    sessionStorage.setItem("Posts", "");

    const postsRef = storageMod.ref(storage, "posts");
    storageMod.listAll(postsRef).then((result) => {
        posts.innerHTML = "";

        result.prefixes.forEach((ref) => {
            const dataRef = storageMod.ref(ref, "/data");
            const img = storageMod.ref(ref, "/image");

            storageMod.getDownloadURL(dataRef).then((url) => {
                parseData(url).then((data) => {
                    storageMod.getDownloadURL(img).then((image) => {
                        const template = `
                        <div class="repo noscale markdown">
                            <img src=${image} height="auto" width="600px">
                            <h1><a href="?post=${data.name.replaceAll(" ", "_")}">${data.name}</a></h1>
                            <p>${data.description}</p>
                            <br><p class="darker">${data.type} | ${data.category}</p>
                        </div>`;
                        posts.innerHTML += template;
                        sessionStorage.setItem("Posts", posts.innerHTML);
                    });
                });
            });
        });
    });

    setTimeout(() => {
        if (posts.childElementCount == 0)
            posts.innerHTML += "<p><br>nothing here yet :(</p>";
    }, 5000);

    console.log("Posts gathered from API");
}

} else {

document.title = "namefox - loading";
title.innerHTML = "loading";

const dataRef = storageMod.ref(storage, "posts/" + post + "/data");
const contentRef = storageMod.ref(storage, "posts/" + post + "/content");
const imageRef = storageMod.ref(storage, "posts/" + post + "/image");

storageMod.getDownloadURL(imageRef).then((img) => {
    storageMod.getDownloadURL(dataRef).then((url) => {
        parseData(url).then((data) => {
            storageMod.getDownloadURL(contentRef).then((url2) => {
                getURL(url2).then((content) => {
                    document.title = "namefox - " + data.name;
            
                    document.body.innerHTML = `<img src="${img}" width="auto" height="50%"></div><h1>${data.name}</h1><p><i>${data.description}</i></p><p class="darker">${data.type} | ${data.category}</p><br>${content}<br><p><a href="..">go back</a> | <a href=".">more</a></p>`;
                })
            });
        });
    });
});

}