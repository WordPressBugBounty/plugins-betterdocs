import { toast } from "react-toastify";

export const toastDefaultArgs = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    icon: false,
};

const toastAlert = (type, message, args) => {
    type = type || null;
    message = message || null;
    const promise = new Promise((resolve, reject) => {
        args = args || {};
        const defaultArgs = { ...toastDefaultArgs, ...args, onClose: resolve };
        if (type == "success") {
            toast.success(message, defaultArgs);
        }
        if (type == "error") {
            toast.error(message, defaultArgs);
        }
        if (type == "info") {
            toast.info(message, defaultArgs);
        }
        if (type == "warning") {
            toast.warning(message, defaultArgs);
        }
        if (!type) {
            reject();
        }
    });
    return promise;
};

export default toastAlert;
