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

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const switchLink = document.getElementById("switch");
const error = document.getElementById("error");
const form = document.getElementById("signIn");

authMod.onAuthStateChanged(auth, (user) => {
    if (user != null) {
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        if (redirect) window.location.href = "/" + redirect.replaceAll(".", "/");
        else window.location.href = "..";
    }
});

let signUp = false;
const replace = () => {
    signUp = !signUp;

    if (signUp) {
        username.classList.remove("invisible");
        confirmPassword.classList.remove("invisible");

        document.title = "namefox - sign up";
        switchLink.innerText = "already have an account?";
    } else {
        username.classList.add("invisible");
        confirmPassword.classList.add("invisible");

        document.title = "namefox - sign in";
        switchLink.innerText = "don't have an account?";
    }
};

switchLink.style.cursor = "pointer";
switchLink.addEventListener("click", (e) => {
    replace();
});

const createAccount = () => {
    authMod.createUserWithEmailAndPassword(auth, email.value, password.value).then((result) => {
        const storage = storageMod.getStorage();
        fetch("/assets/images/repo.png").then(r => r.blob()).then((blob) => {
            const ref = storageMod.ref(storage, "/users/" + result.user.uid + "/profile_picture");
            storageMod.uploadBytes(ref, blob).then(() => {
                storageMod.getDownloadURL(ref).then((url) => {
                    authMod.updateProfile(result.user, {
                        displayName: username.value,
                        photoURL: url
                    }).then(() => {
                        const redirect = new URLSearchParams(window.location.search).get("redirect");
                        if (redirect) window.location.href = "/" + redirect.replaceAll(".", "/");
                    });
                });
            })
        });
    });
};

const signIntoAccount = () => {
    authMod.signInWithEmailAndPassword(auth, email.value, password.value).then((result) => {
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        if (redirect) window.location.href = "/" + redirect.replaceAll(".", "/");
    });
};

const checkSignUpRequirements = () => {
    if (!terms.checked) {
        error.innerText = "you must agree to continue";
        return;
    }
    
    if (!username.value) {
        error.innerText = "username is empty";
        return;
    }

    if (!email.value) {
        error.innerText = "email is empty";
        return;
    }

    if (!password.value) {
        error.innerText = "password is empty";
        return;
    }

    if (password.value.length < 8) {
        error.innerText = "password must be at least 8 characters";
        return;
    }

    if (password.value !== confirmPassword.value) {
        error.innerText = "passwords don't match";
        return;
    }

    createAccount();
};

const checkSignInRequirements = () => {
    if (!terms.checked) {
        error.innerText = "you must agree to continue";
        return;
    }

    if (!email.value) {
        error.innerText = "email is empty";
        return;
    }

    if (!password.value) {
        error.innerText = "password is empty";
        return;
    }

    signIntoAccount();
};

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (signUp) checkSignUpRequirements();
    else checkSignInRequirements();
});