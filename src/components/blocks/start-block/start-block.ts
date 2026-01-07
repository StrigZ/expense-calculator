import { add, differenceInCalendarDays, endOfMonth, format } from "date-fns";
import { type OnCalculateBudget, TIMEFRAMES } from "../../../types";
import { timeframeToNumberMap } from "../../../utils/constants";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../../component";
import { DatePicker } from "../../date-picker/date-picker";
import { DatePickerCalendar } from "../../date-picker/date-picker-calendar";
import { DatePickerList } from "../../date-picker/date-picker-list";
import { DatePickerListItem } from "../../date-picker/date-picker-list-item";
import { Input } from "../../input";

export class StartBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private datePicker: DatePicker;
	private datePickerList: DatePickerList;
	private datePickerCalendar: DatePickerCalendar;

	private selectedDate: Date | null = null;
	private inputBudget: number | null = null;
	constructor({
		onCalculateBudget,
	}: {
		onCalculateBudget: OnCalculateBudget;
	}) {
		if (!StartBlock.template) {
			StartBlock.template = getTemplateById("start-block");
		}

		super(cloneTemplate(StartBlock.template));

		const datePickerPlaceholder = getElementByQuery(
			"#date-dropdown-placeholder",
			this.element,
		);
		const budgetInputPlaceholder = getElementByQuery(
			"#budget-input-placeholder",
			this.element,
		);

		const calculateBudgetButton = getElementByQuery(
			"#calculate-budget-button",
			this.element,
		);

		const budgetInput = new Input({
			isRequired: true,
			labelText: "Укажите баланс",
			placeholderText: "0 ₽",
			type: "number",
			inputMode: "numeric",
			onChange: (value) => {
				this.inputBudget = +value;
			},
		});

		calculateBudgetButton.addEventListener("click", () => {
			if (!this.selectedDate || !this.inputBudget) return;

			onCalculateBudget({
				budget: this.inputBudget,
				periodDate: this.selectedDate,
			});
		});

		this.datePicker = new DatePicker({
			onPopupOpen: () =>
				this.datePicker.updatePopupContent(this.datePickerList.render()),
		});
		this.datePickerList = new DatePickerList();
		this.datePickerCalendar = new DatePickerCalendar({
			onMonthChange: () =>
				this.datePicker.updatePopupContent(this.datePickerCalendar.render()),
			onDateSelect: (date) => {
				const diffInCalendarDays = differenceInCalendarDays(date, new Date());
				this.datePicker.updateTriggerButtonText(
					`${diffInCalendarDays} дней (до ${format(date, "d MMMM")})`,
				);
				this.selectedDate = date;
				this.datePicker.hidePopup();
			},
		});

		datePickerPlaceholder.replaceWith(this.datePicker.render());
		budgetInputPlaceholder.replaceWith(budgetInput.render());
	}

	public render() {
		this.datePickerList.resetList();
		const fragment = new DocumentFragment();
		TIMEFRAMES.forEach((timeframe) => {
			if (timeframe === "Своя дата") {
				const datePickerListItem = new DatePickerListItem({
					period: timeframe,
					untilDate: null,
					onClick: () => {
						this.datePicker.updatePopupContent(
							this.datePickerCalendar.render(),
						);
					},
				});
				fragment.append(datePickerListItem.render());
			} else {
				const untilDate =
					timeframe === "До конца месяца"
						? endOfMonth(new Date())
						: add(new Date(), { days: timeframeToNumberMap[timeframe] });

				const diffInCalendarDays =
					timeframe === "До конца месяца"
						? differenceInCalendarDays(untilDate, new Date())
						: timeframeToNumberMap[timeframe];

				const datePickerListItem = new DatePickerListItem({
					period: timeframe,
					untilDate,
					onClick: () => {
						this.datePicker.updateTriggerButtonText(
							`${diffInCalendarDays} дней (до ${format(untilDate, "d MMMM")})`,
						);

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
