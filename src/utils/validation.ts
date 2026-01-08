// TODO: replace with zod

export function validateBudgetForm({
	budget,
	periodDate,
}: {
	budget?: number | null;
	periodDate?: Date | null;
}) {
	if (budget === null || budget === undefined) return false;

	if (!periodDate) return false;

	return true;
}
