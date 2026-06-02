import { add, differenceInCalendarDays, endOfMonth, format } from "date-fns";
import { ROUTER_PATHS, type Route, TIMEFRAMES, type Timeframe } from "../types";
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

export function getDatePickerTriggerButtonText(endDate: Date) {
	const diffInCalendarDays = differenceInCalendarDays(endDate, new Date());
	return `${diffInCalendarDays} дней (до ${format(endDate, "d MMMM")})`;
}

export function getTimeframeToDateMap() {
	const timeframeToDateMap: Record<Timeframe, Date | null> = {
		День: null,
		Неделя: null,
		"2 недели": null,
		Месяц: null,
		"До конца месяца": null,
		"Своя дата": null,
	};

	TIMEFRAMES.forEach((timeframe) => {
		if (timeframe === "Своя дата") {
			timeframeToDateMap[timeframe] = null;
		} else if (timeframe === "До конца месяца") {
			timeframeToDateMap[timeframe] = endOfMonth(new Date());
		} else {
			timeframeToDateMap[timeframe] = add(new Date(), {
				days: timeframeToNumberMap[timeframe],
			});
		}
	});

	return timeframeToDateMap;
}

const paths = Object.values(ROUTER_PATHS);
export const isRoute = (str: string): str is Route => {
	return paths.includes(str as Route);
};

export function convertTimeframeToDate(
	timeframe: Exclude<Timeframe, "Своя дата">,
): Date {
	if (timeframe === "До конца месяца") {
		return endOfMonth(new Date());
	}

	return add(new Date(), { days: timeframeToNumberMap[timeframe] });
}

export function isTimeframe(str: string): str is Timeframe {
	return TIMEFRAMES.includes(str as Timeframe);
}
