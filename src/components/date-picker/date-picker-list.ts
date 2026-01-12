import type { Timeframe } from "../../types";
import { convertTimeframeToDate, isTimeframe } from "../../utils/utils";
import { Component } from "../component";
import { Container } from "../container";
import type { DatePickerListItem } from "./date-picker-list-item";

export class DatePickerList extends Component {
	items: DatePickerListItem[];
	constructor({
		items,
		onTimeframePick,
		onCalendarOpen,
	}: {
		items: DatePickerListItem[];
		onTimeframePick: (pickedDate: Date) => void;
		onCalendarOpen: () => void;
	}) {
		const container = new Container({
			tag: "ul",
			className: "date-picker-list",
		});

		super(container.render());

		this.element.addEventListener("click", (e) => {
			e.stopPropagation();
			const target = e.target;
			if (!(target instanceof HTMLElement)) return;

			const isButton = target instanceof HTMLButtonElement;
			const isSpan = target instanceof HTMLSpanElement;
			const isUntilDateSpan = isSpan && target.id === "until-date";

			const timeframe = isButton
				? target.querySelector("#period")?.textContent
				: isUntilDateSpan
					? target.previousElementSibling?.textContent
					: target.textContent;

			if (!timeframe || !isTimeframe(timeframe)) return;

			if (timeframe === "Своя дата") {
				onCalendarOpen();
				return;
			}

			onTimeframePick(convertTimeframeToDate(timeframe));
		});

		const itemsFragment = new DocumentFragment();
		items.forEach((item) => {
			itemsFragment.append(item.render());
		});

		this.element.replaceChildren(itemsFragment);
		this.items = items;
	}

	update(timeframeToDateMap: Record<Timeframe, Date | null>) {
		this.items.forEach((item) => {
			const timeframe = item.getTimeframe();
			if (!isTimeframe(timeframe))
				throw new Error("DatePickerList.update(): string is not a timeframe!");

			item.setUntilDate(timeframeToDateMap[timeframe]);
		});
	}

	render() {
		return this.element;
	}
}
