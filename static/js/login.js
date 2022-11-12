import addToast from "./lib/addToast.js";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const res = await fetch("/api/login", {
        method: "POST",
        body: formData,
    }).then((res) => res.json());

    if (res.success) {
        location.href = "/~";
    } else {
        form.querySelector("input").value = "";
        addToast("Incorrect password!");
    }
});
