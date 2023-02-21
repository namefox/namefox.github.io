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
    if (user == null) window.location.href = "..";
    else if (user.uid !== "xFHBixF9jCPXEdzNz9ZDwHXYJeI2") window.location.href = "..";
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



}