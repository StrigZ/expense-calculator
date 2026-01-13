import { z } from "zod";

export const TransactionSchema = z.object({
	id: z.string(),
	amount: z.number().positive("Баланс должен быть положительным"),
	type: z.enum(["expense", "income"]),
	date: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
