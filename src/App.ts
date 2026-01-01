import { HomePage } from "./pages/home-page";
import { getElementByQuery } from "./utils/utils";

// TODO: replace with real type
export type Expense = { date: Date; amount: number };

// TODO: handle this with state manager
const mockData = {
	availableBalance: 12,
	averageSpentPerDay: 1234,
	history: [
		{ date: new Date(), amount: 21321 },
		{ date: new Date(), amount: 21321 },
		{ date: new Date(), amount: 21321 },
	],
	balancePerDay: 12000 / 5,
	period: 5,
	totalBalance: 12000,
};

export function initApp(): void {
	const homePage = new HomePage({
		handleNewExpense: (expense) => {
			// TODO: replace with state manager
			mockData.history.push({ amount: expense, date: new Date() });
			homePage.render(mockData);
		},
	});

	homePage.render(mockData);

	const root = getElementByQuery("#app");

	root.innerHTML = "";
	root.append(homePage.getElement());
}
