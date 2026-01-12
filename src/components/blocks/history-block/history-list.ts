import { Component } from "../../component";
import { Container } from "../../container";
import type { HistoryListItem } from "./history-list-item";

export class HistoryList extends Component {
	constructor({ items }: { items: HistoryListItem[] }) {
		const container = new Container({ className: "history-list", tag: "ul" });

		super(container.render());

		this.update(items);
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
