window.addEventListener("load", () => {
    const nav = document.querySelector(".custom-nav");
    const main = document.querySelector("main");
    const flash = document.querySelector(".flash-position");

    if (!nav || !main) return;

    const navHeight = nav.offsetHeight;

    // Push main below navbar
    main.style.paddingTop = (navHeight + 20) + "px";

    // Push flash below navbar
    if (flash) {
        flash.style.marginTop = (navHeight + 20) + "px";
    }
});