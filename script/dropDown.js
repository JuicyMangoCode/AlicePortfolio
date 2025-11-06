const dropdownTitles = document.querySelectorAll(".dropdown-title");

dropdownTitles.forEach(title => {
    const content = title.nextElementSibling; // the grid

    content.classList.remove("show");

    title.addEventListener("click", () => {
        const isOpen = content.classList.contains("show");

        content.classList.toggle("show");

        title.classList.toggle("active", !isOpen);
    });
});