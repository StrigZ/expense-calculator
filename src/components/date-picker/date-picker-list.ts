import { convertTimeframeToDate, isTimeframe } from "../../utils/utils";
import { Component } from "../component";
import { Container } from "../container";

export class DatePickerList extends Component {
	constructor({
		onTimeframePick,
		onCalendarOpen,
	}: {
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
			if (!(e.target instanceof HTMLElement)) return;

			const timeframe = e.target.textContent;
			if (!isTimeframe(timeframe)) return;

			if (timeframe === "Своя дата") {
				onCalendarOpen();
				return;
			}

			onTimeframePick(convertTimeframeToDate(timeframe));
		});
	}

	appendFragmentToList(fragment: DocumentFragment) {
		this.element.append(fragment);
	}

	render() {
		return this.element;
	}
}
