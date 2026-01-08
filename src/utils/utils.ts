import { add, differenceInCalendarDays, endOfMonth, format } from "date-fns";
import { TIMEFRAMES, type Timeframe } from "../types";
import { timeframeToNumberMap } from "./constants";

export function cloneTemplate<T = HTMLElement>(template: HTMLTemplateElement) {
	const clonedTemplate = template.content.cloneNode(
		true,
	) as HTMLTemplateElement;
	const element = clonedTemplate.firstElementChild as T | null;

	if (!element) {
		throw new Error(`Template is empty!`);
	}

	return element;
}

export function getTemplateById(templateId: string) {
	const template = document.querySelector(
		`#${templateId}`,
	) as HTMLTemplateElement | null;
	if (!template) {
		throw new Error(`Template with id ${templateId} was not found!`);
	}

	return template;
}

export function getElementByQuery<T = HTMLElement>(
	query: string,
	parentElement?: HTMLElement | DocumentFragment,
) {
	const parent = parentElement ?? document;
	const element = parent.querySelector(query) as T | null;
	if (!element) {
		throw new Error(
			`Couldn't find an element by query ${query} inside ${parentElement?.nodeName ?? "document"}`,
		);
	}

	return element;
}

export function getDatePickerTriggerButtonText(periodDate: Date) {
	const diffInCalendarDays = differenceInCalendarDays(periodDate, new Date());
	return `${diffInCalendarDays} дней (до ${format(periodDate, "d MMMM")})`;
}

export function getDatePickerListData(): {
	timeframe: Timeframe;
	untilDate: Date | null;
}[] {
	const timeframeList: ReturnType<typeof getDatePickerListData> = [];

	TIMEFRAMES.forEach((timeframe) => {
		if (timeframe === "Своя дата") {
			timeframeList.push({ timeframe, untilDate: null });
		} else if (timeframe === "До конца месяца") {
			timeframeList.push({ timeframe, untilDate: endOfMonth(new Date()) });
		} else {
			timeframeList.push({
				timeframe,
				untilDate: add(new Date(), { days: timeframeToNumberMap[timeframe] }),
			});
		}
	});

	return timeframeList;
}
