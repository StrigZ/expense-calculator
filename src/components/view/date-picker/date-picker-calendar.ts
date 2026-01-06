import { add, format, getDaysInMonth, startOfMonth, sub } from "date-fns";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";
import { DatePickerCalendarGridItem } from "./date-picker-calendar-grid-item";

const GRID_SIZE = 7 * 6;

export class DatePickerCalendar extends Component {
	private static template: HTMLTemplateElement | null;

	private date: Date = new Date();
	private calendarGrid: HTMLUListElement;
	private month: HTMLElement;
	private year: HTMLElement;
	constructor({
		onMonthChange,
		onDateSelect,
	}: {
		onMonthChange: () => void;
		onDateSelect: (date: Date) => void;
	}) {
		if (!DatePickerCalendar.template) {
			DatePickerCalendar.template = getTemplateById("date-picker-calendar");
		}

		super(cloneTemplate(DatePickerCalendar.template));

		this.calendarGrid = getElementByQuery("#calendar-grid", this.element);
		this.month = getElementByQuery("#month", this.element);
		this.year = getElementByQuery("#year", this.element);

		const nextButton = getElementByQuery("#next-button", this.element);
		const prevButton = getElementByQuery("#prev-button", this.element);

		nextButton.addEventListener("click", () => {
			this.nextMonth();
			onMonthChange();
		});
		prevButton.addEventListener("click", () => {
			// TODO: atm onMonthChange triggers even when prevMonth can't decrease month
			this.prevMonth();
			onMonthChange();
		});

		this.calendarGrid.addEventListener("click", (e) => {
			const target = e.target;
			if (!target) return;
			if (!(target instanceof HTMLButtonElement)) return;
			if (target.disabled) return;

			const daysFromMonthStart = +target.textContent;
			const selectedDate = add(startOfMonth(this.date), {
				days: daysFromMonthStart - 1,
			});

			onDateSelect(selectedDate);
		});
	}

	nextMonth() {
		this.setDate(add(this.date, { months: 1 }));
	}
	prevMonth() {
		const previousMonth = sub(this.date, { months: 1 });
		if (
			previousMonth.getMonth() < new Date().getMonth() ||
			previousMonth.getFullYear() < new Date().getFullYear()
		) {
			return;
		}

		this.setDate(sub(this.date, { months: 1 }));
	}

	setDate(date: Date) {
		this.date = date;
	}

	render() {
		this.month.textContent = format(this.date, "LLLL");
		this.year.textContent = format(this.date, "uu");

		const fragment = new DocumentFragment();
		const daysInCurrentMonth = getDaysInMonth(this.date);
		const firstDayOfCurrentMonth = startOfMonth(this.date);
		const weekdayNumber = firstDayOfCurrentMonth.getDay();

		// Filling days from prev month
		const daysInPreviousMonth = getDaysInMonth(sub(this.date, { months: 1 }));
		const daysFromPreviousMonth = weekdayNumber === 0 ? 6 : weekdayNumber - 1;
		for (let i = daysFromPreviousMonth; i > 0; i--) {
			fragment.append(
				new DatePickerCalendarGridItem({
					content: (daysInPreviousMonth - i + 1).toString(),
					isDisabled: true,
				}).render(),
			);
		}

		// Filling days from curr month
		for (let i = 1; i <= daysInCurrentMonth; i++) {
			fragment.append(
				new DatePickerCalendarGridItem({
					content: i.toString(),
					isDisabled:
						add(startOfMonth(this.date), { days: i }) <
						add(new Date(), { days: 1 }),
					// TODO: if selected in state date === this date => make it active state
				}).render(),
			);
		}

		// Filling days from next month
		for (let i = 1; fragment.children.length < GRID_SIZE; i++) {
			fragment.append(
				new DatePickerCalendarGridItem({
					content: i.toString(),
					isDisabled: true,
				}).render(),
			);
		}

		this.calendarGrid.replaceChildren(fragment);

		return this.element;
	}
}
