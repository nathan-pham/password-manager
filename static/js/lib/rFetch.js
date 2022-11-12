import addToast from "./addToast.js";

const rFetch = async (api, method = "GET", payload = "", silent = false) => {
    const res = await fetch(`/api/${api}`, {
        method,
        ...(method == "GET"
            ? {}
            : {
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
              }),
    }).then((res) => res.json());

    if (!silent) {
        addToast(res.message);
    }

    return res;
};

export default rFetch;
