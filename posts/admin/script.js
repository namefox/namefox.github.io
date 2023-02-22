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

authMod.onAuthStateChanged(auth, (user) => {
    if (user == null) window.location.href = "/sign/?redirect=/admin";
    else if (user.uid !== "xFHBixF9jCPXEdzNz9ZDwHXYJeI2") window.location.href = "/sign/?redirect=/admin";
    else {
        skeletonPage.remove();

        while (mainPage.childNodes.length > 0) {
            document.body.appendChild(mainPage.childNodes[0]);
        }
        mainPage.remove();

        init();
    }
});

const init = () => {

const buttons = document.querySelectorAll("[data-open-page]");
buttons.forEach((item) => {
    item.addEventListener("click", () => {
        const page = document.querySelector("[data-btn=" + item.id + "]");
        const pages = document.querySelectorAll("[data-btn]");

        pages.forEach((p) => {
            p.classList.add("invisible");
        });
        page.classList.remove("invisible");
    });
});

newPost.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!title.value) {
        title.style = "border:1px solid red;";
        return;
    }

    if (!description.value) {
        description.style = "border:1px solid red;";
        return;
    }

    if (!image.value) {
        image.style = "border:1px solid red;";
        return;
    }

    const text = marked.parse(content.value);
    
    const ref = storageMod.ref(storage, "posts/" + title.value.toLowerCase().replaceAll(" ", "_") + "/data");
    const cRef = storageMod.ref(storage, "posts/" + title.value.toLowerCase().replaceAll(" ", "_") + "/content");
    const imgRef = storageMod.ref(storage, "posts/" + title.value.toLowerCase().replaceAll(" ", "_") + "/image");

    storageMod.uploadBytes(imgRef, image.files[0]).then(() => {
        storageMod.getDownloadURL(imgRef).then((url) => {
            storageMod.uploadString(ref, `{"name":"${title.value}","description":"${description.value}","type":"${type.value}","category":"${category.value}"}`).then(() => {
                storageMod.uploadString(cRef, text).then(() => {
                    window.location.href = "/?post=" + title.value.toLowerCase().replaceAll(" ", "_");
                })
            });
        });
    });
});

}