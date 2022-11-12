const input = document.querySelector("input");
const passwords = [...document.querySelectorAll(".password")];

// copy password functionality

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

{
    /* <div class="input">
                    <input placeholder="Search" type="text" />
                    <ion-icon name="search-outline"></ion-icon>
                </div>

                <div class="passwords"></div> */
}
