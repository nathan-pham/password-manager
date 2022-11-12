import gsap from "https://esm.sh/gsap@3.11.3";

const addModal = (title, onComplete = () => {}, inputs = []) => {
    // create parent modal
    const modal = document.createElement("div");
    modal.className = "modal";
    document.body.appendChild(modal);

    // create modal children
    const modalChildren = document.createElement("div");
    modalChildren.className = "modal__children";
    modalChildren.innerHTML = `
        <div class="modal__title">
            <h1>${title}</h1>
            <div class="icon">
                <ion-icon name="close-outline"></ion-icon>
            </div>

        </div>

        <div class="modal__inputs"></div>

        <button class="button button-right button-margin">Save</button>
    `;
    modal.appendChild(modalChildren);

    // add inputs
    const modalInputsWrapper = modalChildren.querySelector(".modal__inputs");
    const inputElements = [];
    inputs.forEach((props) => {
        const input = document.createElement("input");
        input.className = "input-single input-margin";
        input.setAttribute("autocomplete", "off");
        input.setAttribute("required", true);

        for (const [key, value] of Object.entries(props)) {
            input.setAttribute(key, value);
        }

        inputElements.push(input);
        modalInputsWrapper.appendChild(input);
    });

    // animate out modal
    const close = () => {
        gsap.fromTo(
            modal,
            {
                opacity: 1,
            },
            {
                opacity: 0,
                ease: "Expo.easeInOut",
                onComplete: () => {
                    modal.remove();
                    document.body.style.overflowY = "auto";
                },
            }
        );
    };

    // animate in modal
    gsap.timeline()
        .fromTo(
            modal,
            {
                opacity: 0,
            },
            {
                opacity: 1,
                ease: "Expo.easeInOut",
            }
        )
        .fromTo(
            modalChildren,
            {
                opacity: 0,
                y: 50,
            },
            {
                opacity: 1,
                y: 0,
                ease: "Expo.easeInOut",
            }
        );

    document.body.style.overflowY = "hidden";

    // add event listeners
    modal.querySelector(".icon").addEventListener("click", close);
    modal.querySelector("button").addEventListener("click", () => {
        onComplete(
            // convert inputs into JSON payload
            inputElements.reduce(
                (acc, element) => ({
                    ...acc,
                    [element.getAttribute("name")]: element.value,
                }),
                {}
            )
        );
        close();
    });
};

export default addModal;
