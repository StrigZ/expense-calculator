import { add, differenceInCalendarDays, endOfMonth, format } from "date-fns";
import { TIMEFRAMES } from "../../../types";
import { timeframeToNumberMap } from "../../../utils/constants";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";
import { DatePicker } from "../date-picker/date-picker";
import { DatePickerCalendar } from "../date-picker/date-picker-calendar";
import { DatePickerList } from "../date-picker/date-picker-list";
import { DatePickerListItem } from "../date-picker/date-picker-list-item";

export class StartBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private datePicker: DatePicker;
	private datePickerList: DatePickerList;
	private datePickerCalendar: DatePickerCalendar;

	private selectedDate: Date | null = null;
	private inputBudget: number | null = 123123;
	constructor({
		onCalculateBudget,
	}: {
		onCalculateBudget: ({
			budget,
			periodDate,
		}: {
			budget: number;
			periodDate: Date;
		}) => void;
	}) {
		if (!StartBlock.template) {
			const template = getTemplateById("start-block");
			StartBlock.template = template;
		}

		const startBlock = cloneTemplate(StartBlock.template);
		super(startBlock);

		const datePickerPlaceholder = getElementByQuery(
			"#date-dropdown-placeholder",
			startBlock,
		);
		const calculateBudgetButton = getElementByQuery(
			"#calculate-budget-button",
			this.element,
		);
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
				// TODO: update state
			},
		});

		datePickerPlaceholder.replaceWith(this.datePicker.render());
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

						// TODO: set period in state
						// state.setPeriod(diffInCalendarDays)
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
