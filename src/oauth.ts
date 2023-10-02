import { hs } from "./util";

const form: HTMLFormElement = document.querySelector("form")!;

const onChange = (e: Event) => {
	const el = e.target! as HTMLInputElement;
	const rgx = RegExp(`&${el.id}=[^&]+`);
	const val = encodeURIComponent(el.value);
	const action = `${form.action.replace(rgx, "")}&${el.id}=${val}`;

	form.action = action;
};

form.setAttribute("action", `${form.action}#oauth=${hs.access_token}`);
form
	.querySelectorAll("input")
	.forEach((v) => v.addEventListener("change", onChange));
