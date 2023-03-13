const themeUpdate = (theme) => {
    if (theme.matches) {
        document.body.classList.remove("light");

        const lightTheme = document.head.querySelector("#lightTheme");
        if (lightTheme) lightTheme.remove();
    } else {
        document.body.classList.add("light");
        document.head.innerHTML += "<link rel=\"stylesheet\" href=\"/assets/css/libs/themes.css\" id=\"lightTheme\">"
    }
};

const media = window.matchMedia("(prefers-color-scheme: dark)");
media.addEventListener("change", themeUpdate);

themeUpdate(media);

const switchTheme = (theme) => {
    if (theme === "dark") themeUpdate({matches:true});   
    else if (theme === "light") themeUpdate({matches:false});  
    else if (theme == undefined) themeUpdate({matches:!media.matches})
    else themeUpdate({matches:!theme});   
}