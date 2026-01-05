import { add, differenceInCalendarDays, endOfMonth, format } from "date-fns";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";
import { DateDropdownItem } from "./date-dropdown-item";

const PERIODS = [
	"День",
	"Неделя",
	"2 недели",
	"Месяц",
	"До конца месяца",
	"Своя дата",
] as const;

type Period = (typeof PERIODS)[number];

const periodToNumberMap: Record<
	Exclude<Period, "До конца месяца" | "Своя дата">,
	number
> = {
	День: 1,
	Неделя: 7,
	"2 недели": 14,
	Месяц: 30,
};

export class DateDropdown extends Component {
	private static template: HTMLTemplateElement | null;

	private list: HTMLUListElement;
	private triggerButtonText: HTMLElement;
	private triggerButton: HTMLButtonElement;
	private hasPickedPeriod: boolean = false;

	private boundDocumentClickListener: (e: MouseEvent) => void;
	private boundDocumentKeydownListener: (e: KeyboardEvent) => void;
	private triggerClickListener: (e: MouseEvent) => void;

	constructor() {
		if (!DateDropdown.template) {
			const template = getTemplateById("date-dropdown");
			DateDropdown.template = template;
		}

		super(cloneTemplate(DateDropdown.template));

		this.triggerButton = getElementByQuery<HTMLButtonElement>(
			"#dropdown-trigger-button",
			this.element,
		);
		this.triggerButtonText = getElementByQuery(
			"#dropdown-trigger-text",
			this.element,
		);

		this.list = getElementByQuery("ul", this.element);

		this.boundDocumentClickListener = (e: MouseEvent) => {
			if (!this.element.contains(e.target as Node)) {
				this._hideDropdown();
			}
		};

		this.boundDocumentKeydownListener = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				this._hideDropdown();
			}
		};

		this.triggerClickListener = () => {
			this.list.classList.toggle("hidden");
		};

		this.triggerButton.addEventListener("click", () =>
			this.list.classList.toggle("hidden"),
		);

		this.triggerButton.addEventListener("click", this.triggerClickListener);
		document.addEventListener("click", this.boundDocumentClickListener);
		document.addEventListener("keydown", this.boundDocumentKeydownListener);
	}

	render() {
		this.list.innerHTML = "";

		const fragment = new DocumentFragment();
		PERIODS.forEach((period) => {
			if (period === "Своя дата") {
				const item = new DateDropdownItem({
					onClick: () => {
						// show calendar
					},
				});
				item.render({ period, untilDate: null });
				fragment.append(item.getElement());
			} else {
				const untilDate =
					period === "До конца месяца"
						? endOfMonth(new Date())
						: add(new Date(), { days: periodToNumberMap[period] });

				const diffInCalendarDays =
					period === "До конца месяца"
						? differenceInCalendarDays(untilDate, new Date())
						: periodToNumberMap[period];

				const item = new DateDropdownItem({
					onClick: () => {
						if (!this.hasPickedPeriod) {
							this.hasPickedPeriod = true;
							this.triggerButtonText.classList.add("text-text-primary!");
						}
						this.triggerButtonText.textContent = `${diffInCalendarDays} дней (до ${format(untilDate, "d MMMM")})`;

						// set period
						// state.setPeriod(diffInCalendarDays)
						this.list.classList.add("hidden");
					},
				});
				item.render({ period, untilDate });
				fragment.append(item.getElement());
			}
		});

		this.list.append(fragment);
	}

	dispose() {
		document.removeEventListener("click", this.boundDocumentClickListener);
		document.removeEventListener("keydown", this.boundDocumentKeydownListener);
		this.triggerButton.removeEventListener("click", this.triggerClickListener);
	}

	private _hideDropdown() {
		this.list.classList.add("hidden");
	}
}
