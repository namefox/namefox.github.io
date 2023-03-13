const panels = document.querySelectorAll("panel");

panels.forEach(item => {
    const button = document.getElementById(item.getAttribute("for"));

    if (button) {
        button.addEventListener("click", () => {
            item.classList.toggle("visible");

            const text = button.getAttribute("text");
            button.setAttribute("text", button.innerText);

            button.innerText = text;
        });
    } else item.classList.add("visible");
});