document.addEventListener("DOMContentLoaded", function () {
    const newsItems = document.querySelectorAll(".news-item");
    const aside = document.querySelector("aside");

    // Efek hover untuk berita
    newsItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            item.style.transform = "scale(1.05)";
            item.style.transition = "0.3s";
            item.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        });

        item.addEventListener("mouseleave", () => {
            item.style.transform = "scale(1)";
            item.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        });
    });

    aside.style.opacity = "0";
    aside.style.transition = "opacity 1s ease-in-out";
    setTimeout(() => {
        aside.style.opacity = "1";
    }, 500);
});
