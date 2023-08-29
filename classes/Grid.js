class Grid {
	constructor() {
		this.columns = [];
		this.tickets = [];
	}

	addColumn(props) {
		const key = props.title.replaceAll(' ', '').toLowerCase();
		if (this.columns.find((column) => column.key === key) !== undefined) {
			return null;
		}
		props.key = key;
		const c = new Column(props);
		this.columns.push(c);
		localStorage.setItem('columns', JSON.stringify(this.columns));
		return c;
	}

	addTicket(props) {
		if (this.tickets.find((ticket) => ticket.id) !== undefined) {
			return null;
		}
		const t = new Ticket(props);
		this.tickets.push(t);
		localStorage.setItem('tickets', JSON.stringify(this.tickets));
		return t;
	}

	getAllColumns() {
		return this.columns;
	}

	getAllTickets() {
		return this.tickets;
	}
}
