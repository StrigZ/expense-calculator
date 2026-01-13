import { z } from "zod";

export const BudgetSchema = z.object({
	initialBalance: z.number().positive("Баланс должен быть положительным"),
	startDate: z.date().default(new Date()),
	endDate: z
		.date()
		.min(new Date(), "Дата окончания должна быть больше даты начала"),
});

export type Budget = z.infer<typeof BudgetSchema>;
