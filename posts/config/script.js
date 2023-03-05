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
    if (user == null) window.location.href = "/sign/?redirect=/posts/config";

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

title.innerText = auth.currentUser.displayName;
picture.src = auth.currentUser.photoURL;

const profilePicture = updateUser.querySelector("[name=profilePicture]");
const username = updateUser.querySelector("[name=username]");

username.value = auth.currentUser.displayName;

updateUser.addEventListener("submit", e => {
    e.preventDefault();

    if (profilePicture.value) {
        const ref = storageMod.ref(storage, "users/" + auth.currentUser.uid + "/profile_picture");
        storageMod.uploadBytes(ref, profilePicture.files[0]).then(() => {
            storageMod.getDownloadURL(ref).then(url => {
                authMod.updateProfile(auth.currentUser, {
                    displayName: username.value,
                    photoURL: url
                }).then(() => window.location.reload());
            });
        });
    } else {
        authMod.updateProfile(auth.currentUser, {
            displayName: username.value,
            photoURL: auth.currentUser.photoURL
        }).then(() => window.location.reload());
    }
});

}