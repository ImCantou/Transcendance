import { toast } from "react-toastify";
import { ToastOptions } from "react-toastify";

const notifyParams: ToastOptions<{}> = {
	position: "top-right",
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: false,
	progress: undefined,
	theme: "dark"
};

export function notifyError(message: string) {
	toast.error(message, notifyParams);
}

export function notifyInfo(message: string) {
	toast.info(message, notifyParams);
}

export function notifySuccess(message: string) {
	toast.success(message, notifyParams);
}

export function notifyWarning(message: string) {
	toast.warning(message, notifyParams);
}
