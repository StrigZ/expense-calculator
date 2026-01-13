import type { Timeframe } from "../types";

export const timeframeToNumberMap: Record<
	Exclude<Timeframe, "До конца месяца" | "Своя дата">,
	number
> = {
	День: 1,
	Неделя: 7,
	"2 недели": 14,
	Месяц: 30,
};
