import type { OnCalculateBudget } from "../types";
import {
	getDatePickerListData,
	getDatePickerTriggerButtonText,
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

	private selectedDate: Date | null = null;
	private inputBudget: number | null = null;
	constructor({
		inputLabelText = "Укажите баланс",
		submitButtonText = "Рассчитать",
		onCalculateBudget,
		defaultPeriodDate,
	}: {
		onCalculateBudget: OnCalculateBudget;
		defaultPeriodDate?: Date;
		inputLabelText?: string;
		submitButtonText?: string;
	}) {
		const container = new Container<HTMLFormElement>({
			tag: "form",
			className: "flex flex-col gap-3",
		});

		super(container.render());

		const budgetInput = new Input({
			isRequired: true,
			labelText: inputLabelText,
			placeholderText: "0 ₽",
			type: "number",
			inputMode: "numeric",
			onChange: (value) => {
				if (!value) {
					return this.submitButton.disable();
				}
				//TODO: use validation to handle disabled state
				if (value && this.selectedDate) {
					this.submitButton.enable();
				}
				this.inputBudget = +value;
			},
		});

		this.datePicker = new DatePicker({
			onPopupOpen: () =>
				this.datePicker.updatePopupContent(this.datePickerList.render()),
		});

		if (defaultPeriodDate) {
			this.datePicker.updateTriggerButtonText(
				getDatePickerTriggerButtonText(defaultPeriodDate),
			);
		}

		this.datePickerList = new DatePickerList();
		this.datePickerCalendar = new DatePickerCalendar({
			onMonthChange: () =>
				this.datePicker.updatePopupContent(this.datePickerCalendar.render()),
			onDateSelect: (date) => {
				this.datePicker.updateTriggerButtonText(
					getDatePickerTriggerButtonText(date),
				);
				//TODO: use validation to handle disabled state

				if (this.inputBudget) {
					this.submitButton.enable();
				}
				this.selectedDate = date;
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
			if (!this.inputBudget || !this.selectedDate) return;

			onCalculateBudget({
				budget: this.inputBudget,
				periodDate: this.selectedDate,
			});
		});

		this.element.append(
			budgetInput.render(),
			this.datePicker.render(),
			this.submitButton.render(),
		);
	}

	setSelectedDate(selectedDate: Date) {
		this.selectedDate = selectedDate;
		this.datePicker.updateTriggerButtonText(
			getDatePickerTriggerButtonText(selectedDate),
		);
	}

	render() {
		this.datePickerList.resetList();
		const fragment = new DocumentFragment();

		getDatePickerListData().forEach(({ timeframe, untilDate }) => {
			if (timeframe === "Своя дата") {
				const datePickerListItem = new DatePickerListItem({
					period: timeframe,
					untilDate,
					onClick: () => {
						this.datePicker.updatePopupContent(
							this.datePickerCalendar.render(),
						);
					},
				});
				fragment.append(datePickerListItem.render());
			} else if (untilDate) {
				const datePickerListItem = new DatePickerListItem({
					period: timeframe,
					untilDate,
					onClick: () => {
						this.datePicker.updateTriggerButtonText(
							getDatePickerTriggerButtonText(untilDate),
						);
						//TODO: use validation to handle disabled state

						if (this.inputBudget) {
							this.submitButton.enable();
						}
						this.selectedDate = untilDate;
						this.datePicker.hidePopup();
					},
				});
				fragment.append(datePickerListItem.render());
			}
		});

		this.datePickerList.appendFragmentToList(fragment);
		this.datePicker.updatePopupContent(this.datePickerList.render());

		return this.element;
	}
}
