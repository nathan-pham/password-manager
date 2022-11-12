import addToast from "./lib/addToast.js";

const input = document.querySelector("input");
const passwords = [...document.querySelectorAll(".password")];

// copy password functionality
passwords.forEach((password) => {
    const copyButton = password.querySelector(".password__copy");
    const passwordId = password.dataset.id;

    copyButton.addEventListener("click", async () => {
        const res = await fetch(`/api/getPassword/${passwordId}`).then((res) =>
            res.json()
        );

        if (res.success) {
            navigator.clipboard.writeText(res.password);
            addToast("Copied password to clipboard!");
        } else {
            addToast("Failed to fetch password.");
        }
    });
});

// search through passwords
input.addEventListener("keydown", (e) => {
    const query = e.target.value.toLowerCase().trim();

    for (const password of passwords) {
        if (password.textContent.toLowerCase().includes(query)) {
            password.style.display = "flex";
        } else {
            password.style.display = "none";
        }
    }
});
