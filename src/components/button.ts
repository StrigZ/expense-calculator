import type { ButtonConstructor } from "../types";
import { Component } from "./component";

export class Button extends Component<HTMLButtonElement> {
	constructor({
		text,
		type,
		variant,
		className,
		disabled,
		onClick,
	}: ButtonConstructor) {
		const button = document.createElement("button");
		button.classList.add("btn", "text-accent");

		super(button);

		this.element.textContent = text;
		this.element.type = type ?? "button";
		this.element.classList.add(`btn-${variant ?? "primary"}`);
		if (onClick) {
			this.element.addEventListener("click", onClick);
		}
		if (className) {
			this.element.classList.add(...className.split(" "));
		}
		this.element.disabled = disabled ?? false;
	}

	setIsButtonEnabled(isEnabled: boolean) {
		this.element.disabled = !isEnabled;
	}

	setIsButtonHidden(isHidden: boolean) {
		this.element.classList.toggle("hidden", isHidden);
	}

	render() {
		return this.element;
	}
}
