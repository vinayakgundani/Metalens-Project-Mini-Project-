document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("analyzeForm");
    const btn = document.getElementById("analyzeBtn");
    const loader = document.getElementById("loader");

    if (form) {
        form.addEventListener("submit", () => {
            btn.disabled = true;
            btn.innerText = "Analyzing...";
            loader.classList.remove("hidden");
        });
    }
});