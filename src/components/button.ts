import { Component } from "./component";

type ButtonConstructor = {
	text: string;
	variant?: "primary" | "outline";
	className?: string;
	type?: "submit" | "button";
	onClick?: (e: Event) => void;
	disabled?: boolean;
};

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

	render() {
		return this.element;
	}
}
