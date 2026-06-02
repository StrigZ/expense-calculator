import { Component } from "../../component";
import { Container } from "../../container";
import type { HistoryListItem } from "./history-list-item";

export class HistoryList extends Component {
	constructor({
		items,
		onTransactionDelete,
	}: {
		items: HistoryListItem[];
		onTransactionDelete?: (transactionId: string) => void;
	}) {
		const container = new Container({ className: "history-list", tag: "ul" });

		super(container.render());

		this.update(items);

		if (onTransactionDelete) {
			this.element.addEventListener("click", (e) => {
				if (!(e.target instanceof Element)) return;
				if (
					e.target.id !== "delete-transaction-btn" &&
					!e.target.closest<HTMLElement>("#delete-transaction-btn")
				)
					return;

				const target = e.target.closest<HTMLElement>("li");
				if (!target) return;

				const id = target.dataset.id;
				if (!id) return;

				onTransactionDelete(id);
			});
		}
	}

	update(newItems: HistoryListItem[]) {
		const itemsFragment = new DocumentFragment();
		newItems.forEach((item) => {
			itemsFragment.append(item.render());
		});
		this.element.replaceChildren(itemsFragment);
	}

	render() {
		return this.element;
	}
}
