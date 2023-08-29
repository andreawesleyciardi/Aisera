class Column {
	constructor(props) {
		Object.assign(this, props);
		this.createColumn();
	}

	createColumn() {
		const grid = document.querySelector('ais-grid');
		const column = document.createElement('div');
		column.setAttribute('id', `column-${this.key}-container`);
		column.innerHTML = `<ais-column title="${this.title}" key="${this.key}" />`;
		grid.append(column);
	}
}
