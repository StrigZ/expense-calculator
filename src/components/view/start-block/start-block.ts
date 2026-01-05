import { add, differenceInCalendarDays, endOfMonth, format } from "date-fns";
import { TIMEFRAMES } from "../../../types";
import { timeframeToNumberMap } from "../../../utils/constants";
import {
	cloneTemplate,
	getElementByQuery,
	getTemplateById,
} from "../../../utils/utils";
import { Component } from "../component";
import { DateDropdown } from "../date-dropdown/date-dropdown";
import { DateDropdownItem } from "../date-dropdown/date-dropdown-item";

export class StartBlock extends Component {
	private static template: HTMLTemplateElement | null;

	private dateDropdown: DateDropdown;
	constructor() {
		if (!StartBlock.template) {
			const template = getTemplateById("start-block");
			StartBlock.template = template;
		}

		const startBlock = cloneTemplate(StartBlock.template);
		super(startBlock);

		const dateDropdownPlaceholder = getElementByQuery(
			"#date-dropdown-placeholder",
			startBlock,
		);

		this.dateDropdown = new DateDropdown();
		dateDropdownPlaceholder.replaceWith(this.dateDropdown.render());
	}

	public render() {
		this.dateDropdown.resetList();
		const fragment = new DocumentFragment();
		TIMEFRAMES.forEach((timeframe) => {
			if (timeframe === "Своя дата") {
				const dateDropdownItem = new DateDropdownItem({
					period: timeframe,
					untilDate: null,
					onClick: () => {
						// show calendar
					},
				});
				fragment.append(dateDropdownItem.render());
			} else {
				const untilDate =
					timeframe === "До конца месяца"
						? endOfMonth(new Date())
						: add(new Date(), { days: timeframeToNumberMap[timeframe] });

				const diffInCalendarDays =
					timeframe === "До конца месяца"
						? differenceInCalendarDays(untilDate, new Date())
						: timeframeToNumberMap[timeframe];

				const dateDropdownItem = new DateDropdownItem({
					period: timeframe,
					untilDate,
					onClick: () => {
						this.dateDropdown.updateTriggerButtonText(
							`${diffInCalendarDays} дней (до ${format(untilDate, "d MMMM")})`,
						);

						// set period
						// state.setPeriod(diffInCalendarDays)
						this.dateDropdown.hideList();
					},
				});
				fragment.append(dateDropdownItem.render());
			}
		});

		this.dateDropdown.appendFragmentToList(fragment);

		return this.element;
	}
}
