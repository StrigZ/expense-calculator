import type { OnCalculateBudget } from "../types";
import {
	getDatePickerTriggerButtonText,
	getTimeframeToDateMap,
} from "../utils/utils";
import { validateBudgetForm } from "../utils/validation";
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

	private periodDate: Date | null = null;
	private budget: number | null = null;
	constructor({
		inputLabelText = "Укажите баланс",
		submitButtonText = "Рассчитать",
		onCalculateBudget,
	}: {
		onCalculateBudget: OnCalculateBudget;
		inputLabelText?: string;
		submitButtonText?: string;
	}) {
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
				this.budget = +value;
				this.validateForm();
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
				this.periodDate = date;
				this.validateForm();
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
				this.periodDate = date;
				this.validateForm();
				this.datePicker.hidePopup();
			},
		});

		this.submitButton = new Button({
			text: submitButtonText,
			className: "mt-auto w-full",
			type: "submit",
			disabled: true,
		});

		this.element.addEventListener("submit", (e) => {
			e.preventDefault();
			if (this.budget === null || !this.periodDate) return;

			onCalculateBudget({
				budget: this.budget,
				periodDate: this.periodDate,
			});
			this.setBudget(0);
		});

		this.element.append(
			this.budgetInput.render(),
			this.datePicker.render(),
			this.submitButton.render(),
		);
	}

	setPeriodDate(selectedDate: Date) {
		this.periodDate = selectedDate;
		this.datePicker.updateTriggerButtonText(
			getDatePickerTriggerButtonText(selectedDate),
		);
	}

	setBudget(budget: number) {
		this.budget = budget;
		this.budgetInput.setValue(budget.toString());
	}

	// TODO: replace with zod
	validateForm() {
		this.submitButton.setIsButtonEnabled(
			validateBudgetForm({
				budget: this.budget,
				periodDate: this.periodDate,
			}),
		);
	}

	update() {
		this.datePickerList.update(getTimeframeToDateMap());
		this.validateForm();
	}

	render() {
		return this.element;
	}
}
