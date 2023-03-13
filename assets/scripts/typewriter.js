const deleteChars = (typewriter, charDelay) => {
    return new Promise(resolve => {
        let i = setInterval(() => {
            typewriter.innerText = typewriter.innerText.substring(0, typewriter.innerText.length - 1);
            if (typewriter.innerText === "") {
                clearInterval(i);
                resolve();
            }
        }, charDelay);
    });
}

const addChars = (typewriter, word, charDelay) => {
    return new Promise(resolve => {
        let c = 0;
        let i = setInterval(() => {
            if (c >= word.length) {
                clearInterval(i);
                resolve();
            }

            typewriter.innerText += word.charAt(c);
            c++;
        }, charDelay);
    });
}

const init = (typewriter) => {
    const words = JSON.parse(typewriter.getAttribute("words").replaceAll("_", " "));

    let charDelay = parseInt(typewriter.getAttribute("char-delay"));
    let wordDelay = parseInt(typewriter.getAttribute("word-delay"));
    
    let word = 1;
    typewriter.innerHTML = words[0];

    setInterval(() => {
        deleteChars(typewriter, charDelay).then(() => {
            addChars(typewriter, words[word], charDelay).then(() => {
                word++;
                if (word >= words.length) word = 0;
            });
        });
    }, wordDelay);
};

const typewriters = document.querySelectorAll("typewriter");
typewriters.forEach(typewriter => {
    init(typewriter);
});