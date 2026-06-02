import { z } from "zod";

export const MetricsSchema = z.object({
	availableBalance: z.number("Available budget per day is undefined!"),
	budgetPerDay: z.number("Budget per day is undefined!"),
	avgSpentPerDay: z.number("Average spent per day is undefined!"),
	availableToday: z.number("Available today is undefined!"),
	daysLeft: z.number(),
});

export type Metrics = z.infer<typeof MetricsSchema>;
