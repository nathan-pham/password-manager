import addModal from "./lib/addModal.js";
import addToast from "./lib/addToast.js";

const input = document.querySelector("input");
const passwords = [...document.querySelectorAll(".password")];
const addPassword = document.querySelector("button");

addPassword.addEventListener("click", () => {
    addModal(
        "Add Password",
        async (payload) => {
            const res = await fetch("/api/addPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }).then((res) => res.json());

            addToast(res.message);
        },
        [
            {
                name: "url",
                placeholder: "URL of website",
            },
            {
                name: "username",
                placeholder: "Username",
            },
            {
                name: "password",
                placeholder: "Password",
            },
        ]
    );
});

// copy password functionality
passwords.forEach((password) => {
    const copyButton = password.querySelector(".password__copy");
    const editButton = password.querySelector(".password__edit");
    const passwordId = password.dataset.id;

    // edit functionality
    editButton.addEventListener("click", () => {});

    // copy password functionality
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
input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    for (const password of passwords) {
        if (
            password.textContent.toLowerCase().includes(query) ||
            query === ""
        ) {
            password.style.display = "flex";
        } else {
            password.style.display = "none";
        }
    }
});
