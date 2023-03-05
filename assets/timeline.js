const timelineDots = document.querySelectorAll(".timeline-dot");
const timelineItems = document.querySelectorAll(".timeline-item");

timelineDots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        timelineDots.forEach(d => {
            d.classList.remove("selected");
        });
        dot.classList.add("selected");

        timelineItems.forEach(d => {
            d.classList.add("invisible");
        });
        timelineItems.item(i).classList.remove("invisible");
    });
});