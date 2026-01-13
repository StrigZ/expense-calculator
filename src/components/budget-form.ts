import type { BudgetFormConstructor } from "../types";
import {
	getDatePickerTriggerButtonText,
	getTimeframeToDateMap,
} from "../utils/utils";
import { Button } from "./button";
import { Component } from "./component";
import { Container } from "./container";
import { DatePicker } from "./date-picker/date-picker";
import { DatePickerCalendar } from "./date-picker/date-picker-calendar";
import { DatePickerList } from "./date-picker/date-picker-list";
import { DatePickerListItem } from "./date-picker/date-picker-list-item";
import { Input } from "./input";

export class BudgetForm extends Component<HTMLFormElement> {
	private datePicker: DatePicker;
	private datePickerList: DatePickerList;
	private datePickerCalendar: DatePickerCalendar;
	private submitButton: Button;
	private budgetInput: Input;

	private endDate: Date | null = null;
	private inputValue: number | null = 0;
	constructor({
		inputLabelText = "Укажите баланс",
		submitButtonText = "Рассчитать",
		onSubmit,
	}: BudgetFormConstructor) {
		const container = new Container<HTMLFormElement>({
			tag: "form",
			className: "flex flex-col gap-3 h-full",
		});

		super(container.render());

		this.budgetInput = new Input({
			isRequired: true,
			labelText: inputLabelText,
			placeholderText: "0 ₽",
			type: "number",
			inputMode: "numeric",
			onChange: (value) => {
				this.inputValue = +value;
			},
		});

		this.datePicker = new DatePicker({
			onPopupOpen: () =>
				this.datePicker.updatePopupContent(this.datePickerList.render()),
		});

		this.datePickerList = new DatePickerList({
			items: Object.entries(getTimeframeToDateMap()).map(
				([timeframe, untilDate]) =>
					new DatePickerListItem({
						timeframe,
						untilDate,
					}),
			),
			onTimeframePick: (date) => {
				this.datePicker.updateTriggerButtonText(
					getDatePickerTriggerButtonText(date),
				);
				this.endDate = date;
				this.datePicker.hidePopup();
			},
			onCalendarOpen: () => {
				this.datePicker.updatePopupContent(this.datePickerCalendar.render());
			},
		});

		this.datePickerCalendar = new DatePickerCalendar({
			onMonthChange: () =>
				this.datePicker.updatePopupContent(this.datePickerCalendar.render()),
			onDateSelect: (date) => {
				this.datePicker.updateTriggerButtonText(
					getDatePickerTriggerButtonText(date),
				);
				this.endDate = date;
				this.datePicker.hidePopup();
			},
		});

		this.submitButton = new Button({
			text: submitButtonText,
			className: "mt-auto w-full",
			type: "submit",
		});

		this.element.addEventListener("submit", (e) => {
			e.preventDefault();

			if (!this.endDate || this.inputValue === null) return;

			onSubmit({ endDate: this.endDate, inputValue: this.inputValue });
			this.inputValue = 0;
			this.budgetInput.setValue("0");
		});

		this.element.append(
			this.budgetInput.render(),
			this.datePicker.render(),
			this.submitButton.render(),
		);
	}

	setPeriodDate(selectedDate: Date) {
		this.endDate = selectedDate;
		this.datePicker.updateTriggerButtonText(
			getDatePickerTriggerButtonText(selectedDate),
		);
	}

	update() {
		this.datePickerList.update(getTimeframeToDateMap());
	}

	render() {
		return this.element;
	}
}
