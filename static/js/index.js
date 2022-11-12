import addModal from "./lib/addModal.js";
import addToast from "./lib/addToast.js";
import rFetch from "./lib/rFetch.js";

const input = document.querySelector("input");
const passwords = [...document.querySelectorAll(".password")];
const addPassword = document.querySelector("button");

const getPassword = (id) =>
    fetch(`/api/getPassword/${id}`).then((res) => res.json());

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
    const deleteButton = password.querySelector(".password__delete");
    const passwordId = password.dataset.id;

    // edit functionality
    editButton.addEventListener("click", async () => {
        addModal(
            "Update Password",
            async (payload) => {
                const res = await fetch(`/api/updatePassword/${passwordId}`, {
                    method: "PUT",
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
                    value: password.dataset.url,
                },
                {
                    name: "username",
                    placeholder: "Username",
                    value: password.dataset.username,
                },
                {
                    name: "password",
                    placeholder: "Password",
                    value: (await rFetch(`getPassword/${passwordId}`)).password,
                },
            ]
        );
    });

    // copy password functionality
    copyButton.addEventListener("click", async () => {
        const res = await rFetch(`getPassword/${passwordId}`);

        if (res.success) {
            navigator.clipboard.writeText(res.password);
            addToast("Copied password to clipboard!");
        } else {
            addToast("Failed to fetch password.");
        }
    });

    // delete password
    deleteButton.addEventListener("click", async () => {
        const res = await fetch(`/api/deletePassword/${passwordId}`, {
            method: "DELETE",
        }).then((res) => res.json());

        addToast(res.message);
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
