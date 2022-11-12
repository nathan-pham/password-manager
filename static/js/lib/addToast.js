import gsap from "https://esm.sh/gsap@3.11.3";

/**
 * Add a toast to the screen
 * @param {String} icon - emoji
 * @param {String} text - toast text
 */
const addToast = (icon, text) => {
    const toastWrapper = getToastWrapper();
    const toast = createToast(icon, text);
    toastWrapper.appendChild(toast);

    const tl = gsap.timeline();

    tl.fromTo(
        toast,
        {
            opacity: 0,
            x: "100%",
        },
        {
            opacity: 1,
            x: 0,
            ease: "Expo.easeInOut",
        }
    ).fromTo(
        toast,
        {
            opacity: 1,
        },
        {
            opacity: 0,
            ease: "Expo.easeInOut",
            delay: 2,
            onComplete: () => {
                toast.remove();
            },
        }
    );
};

/**
 * Create div element (toast)
 * @param {String} icon - emoji
 * @param {String} text - toast text
 */
const createToast = (icon, text) => {
    const toast = document.createElement("div");
    toast.textContent = text ? `${icon} ${text}` : `${icon}`;
    Object.assign(toast.style, {
        borderRadius: "0.5rem",
        backgroundColor: "black",
        color: "white",
        padding: "0.75rem",
        width: "15rem",
        fontSize: "0.9rem",
        marginTop: "0.5rem",
    });

    return toast;
};

/**
 * Get reference to toast wrapper
 * @returns Toast wrapper element
 */
const getToastWrapper = () => {
    // use existing toast wrapper
    const exists = document.querySelector(".toasts");
    if (exists) {
        return exists;
    }

    // create toast wrapper
    const toastWrapper = document.createElement("div");
    toastWrapper.className = "toasts";
    Object.assign(toastWrapper.style, {
        position: "fixed",
        bottom: 0,
        right: 0,
        padding: "0.75rem",
    });

    document.body.appendChild(toastWrapper);
    return toastWrapper;
};

export default addToast;
