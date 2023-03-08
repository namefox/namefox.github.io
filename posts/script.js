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

const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const loadComments = (post) => {
    return new Promise(resolve => {
        const comments = [];
    
        const ref = storageMod.ref(storage, "posts/" + post);
        storageMod.listAll(ref).then((result) => {
            let itemCount = result.items.length + result.prefixes.length;
            let i = 0;

            result.items.forEach((item) => {
                storageMod.getDownloadURL(item).then((url) => {
                    getURL(url).then((data) => {
                        if (isJson(data)) {
                            const json = JSON.parse(data);
                            const isValidComment = json.comment;
                            console.log(json, isValidComment);

                            if (isValidComment)
                                comments.push(json);
                        }

                        i++;
                        if (i >= itemCount) resolve(comments);
                    });
                })
            });

            result.prefixes.forEach((item) => {
                storageMod.getDownloadURL(item).then((url) => {
                    getURL(url).then((data) => {
                        if (isJson(data)) {
                            const json = JSON.parse(data);
                            const isValidComment = json.comment;
                            console.log(json, isValidComment);

                            if (isValidComment)
                                comments.push(json);
                        }

                        i++;
                        if (i >= itemCount) resolve(comments);
                    });
                })
            });
        });
    });
}

const newComment = () => {
    const textContent = document.getElementById("commentText");
    
    if (!auth.currentUser) {
        window.location.href = "/sign";
    }

    const text = `{
    "comment":true,
    "profile_picture":"${auth.currentUser.photoURL}",
    "username":"${auth.currentUser.displayName}",
    "text":"${textContent.value}"
}`
    const ref = storageMod.ref(storage, "posts/" + post + "/" + auth.currentUser.uid);
    storageMod.uploadString(ref, text).then(() => {
        console.log("Uploaded comment: " + text);
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

    console.log("Posts gathered from API");
}

} else {

document.title = "namefox - loading";
title.innerHTML = "loading";

const saved = sessionStorage.getItem(post);

if (!saved) {
    const dataRef = storageMod.ref(storage, "posts/" + post + "/data");
    const contentRef = storageMod.ref(storage, "posts/" + post + "/content");
    const imageRef = storageMod.ref(storage, "posts/" + post + "/image");

    storageMod.getDownloadURL(imageRef).then((img) => {
        storageMod.getDownloadURL(dataRef).then((url) => {
            parseData(url).then((data) => {
                storageMod.getDownloadURL(contentRef).then((url2) => {
                    getURL(url2).then((content) => {
                        document.title = "namefox - " + data.name;
                
                        document.body.innerHTML = `<img src="${img}" width="auto" height="50%"></div><h1>${data.name}</h1><p><i>${data.description}</i></p><p class="darker">${data.type} | ${data.category}</p><br>${content}<br><p><a href="..">go back</a> | <a href=".">more</a></p><div class="comments"><h2>comments</h2><div id="comments"><div class="comment markdown repo" style="width:80%;transform:translateX(12.5%);"><form id="newComment"><div class="info"><img id="pfp" src="${auth.currentUser.photoURL}"><p><b>${auth.currentUser.displayName}</b></p></div><textarea id="commentText"></textarea><br><input type="submit" value="post comment"></form></div>`;
                        
                        sessionStorage.setItem(post, JSON.stringify(data));
                        sessionStorage.setItem(post + "Content", content);
                        sessionStorage.setItem(post + "Image", img);

                        loadComments(post).then((comments) => {
                            comments.forEach((comment) => {
                                const c = `
                                <div class="comment markdown repo" style="width:80%;transform:translateX(12.5%);">
                                    <div class="info">
                                        <img src="${comment.profile_picture}" id="pfp">
                                        <p><b>${comment.username}</b></p>
                                    </div>
                                
                                    <p>${comment.text}</p>
                                </div>`

                                document.body.innerHTML += c;
                            });
                            document.body.innerHTML += "</div></div>";

                            const form = document.getElementById("newComment");
                            form.addEventListener("submit", e => {
                                e.preventDefault();
                                newComment();
                            });

                            sessionStorage.setItem(post + "Comments", JSON.stringify(comments));
                        });

                        console.log("Post gathered from API");
                    })
                });
            });
        });
    });
} else {
    const content = sessionStorage.getItem(post + "Content");
    const img = sessionStorage.getItem(post + "Image");
    const data = JSON.parse(saved);
    const d = sessionStorage.getItem(post + "Comments");
    const cms = JSON.parse(d);

    const comments = "";
    cms.forEach((comment) => {
        const c = `
        <div class="comment markdown repo" style="width:80%;transform:translateX(12.5%);">
            <div class="info">
                <img src="${comment.profile_picture}" id="pfp">
                <p><b>${comment.username}</b></p>
            </div>
        
            <p>${comment.text}</p>
        </div>`

        comments += c;
    });

    document.title = "namefox - " + data.name;
    document.body.innerHTML = `<img src="${img}" width="auto" height="50%"></div><h1>${data.name}</h1><p><i>${data.description}</i></p><p class="darker">${data.type} | ${data.category}</p><br>${content}<br><p><a href="..">go back</a> | <a href=".">more</a></p><div class="comments"><h2>comments</h2><div id="comments"><div class="comment markdown repo" style="width:80%;transform:translateX(12.5%);"><form id="newComment"><div class="info"><img id="pfp" src="/assets/images/repo.png"><p><b>username</b></p></div><textarea id="commentText"></textarea><br><input type="submit" value="post comment"></form></div>${comments}</div></div>`;

    const form = document.getElementById("newComment");
    form.addEventListener("submit", e => {
        e.preventDefault();
        newComment();
    });

    console.log("Post gathered from session");
}

}