import { type Budget, BudgetSchema } from "../models/budget";
import { type Metrics, MetricsSchema } from "../models/metrics";
import { type Transaction, TransactionSchema } from "../models/transaction";

export function isBudgetValid(budget: object): budget is Budget {
	return BudgetSchema.safeParse(budget).success;
}

export function isTransactionValid(
	transaction: object,
): transaction is Transaction {
	return TransactionSchema.safeParse(transaction).success;
}

export function isMetricsValid(metrics: object): metrics is Metrics {
	return MetricsSchema.safeParse(metrics).success;
}
