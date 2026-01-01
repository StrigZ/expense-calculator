import { HomePage } from "./pages/home-page";
import { getElementByQuery } from "./utils/utils";

export function initApp(): void {
	const homePage = new HomePage();
	homePage.render({
		availableToday: 1000,
		averageSpentPerDay: 1234,
		history: [
			{ date: new Date(), amount: 21321 },
			{ date: new Date(), amount: 21321 },
			{ date: new Date(), amount: 21321 },
		],
		balancePerDay: 12000 / 5,
		period: 5,
		totalBalance: 12000,
	});

	const root = getElementByQuery("#app");

	root.innerHTML = "";
	root.append(homePage.getElement());
}
