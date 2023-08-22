let columns = [
	// { title: 'To Do', key: 'todo' },
	// { title: 'In Progress', key: 'inprogress' },
	// { title: 'Under QA', key: 'underqa' },
	// { title: 'Done', key: 'done' },
].concat([undefined, null, '', '[]'].includes(localStorage.getItem('columns')) === false ? JSON.parse(localStorage.getItem('columns')) : []);

const testTickets = [
	{ id: 'AIS-TEST', type: 'story', title: 'Test Ticket 1', assignee: 'Andrea Ciardi', status: 'todo', points: 5 },
	{ id: 'AIS-TEST', type: 'task', title: 'Test Ticket 2', assignee: 'Gabriel Ciardi', status: 'inprogress' },
	{ id: 'AIS-TEST', type: 'subtask', title: 'Test Ticket 3', assignee: 'Agapi Panagiotidou', status: 'todo' },
	{ id: 'AIS-TEST', type: 'bug', title: 'Test Ticket 4', assignee: 'John Smith', status: 'underqa' },
];
let tickets = [undefined, null, '', '[]'].includes(localStorage.getItem('tickets')) === false ? JSON.parse(localStorage.getItem('tickets')) : testTickets;

// Add Column

const createColumn = function (element) {
	const grid = document.querySelector('ais-grid');
	const column = document.createElement('div');
	column.setAttribute('id', `column-${element.key}-container`);
	column.innerHTML = `<ais-column title="${element.title}" key="${element.key}" />`;
	grid.append(column);
};

const updateColumns = function (key) {
	if (key !== undefined) {
		const updatedColumns = columns.filter((element) => element.key !== key);
		columns = updatedColumns;
		localStorage.setItem('columns', JSON.stringify(updatedColumns));
	} else {
		columns.forEach((element) => {
			createColumn(element);
		});
	}
};

const addColumnTemplate = document.createElement('template');
addColumnTemplate.innerHTML = `
    <form>
        <fieldset>
            <h3>Add Column</h3>
            <div>
                <label for="title">Title</label>
                <input type="text" name="title" />
            </div>

            <div class="button-container">
                <button class="cancelModal" type="button">Cancel</button>
                <button id="confirmAddColumn" type="button">Save</button>
            </div>
        </fieldset>
    </form>
`;

const onAddColumn = function () {
	openModal(addColumnTemplate);
};
const addColumnButton = document.querySelector('#addColumn');
addColumnButton.addEventListener('click', onAddColumn);

const addColumn = function (e) {
	const form = e.target.closest('form');
	let fields = {};
	fields.title = form.querySelector('[name="title"]').value;
	if (validate(fields.title)) {
		fields.key = fields.title.replaceAll(' ', '').toLowerCase();
		columns.push(fields);
		localStorage.setItem('columns', JSON.stringify(columns));

		createColumn(fields);

		closeModal();
	} else {
		alert('Please, complete the Form.');
	}
};

// Add Ticket

const createTicket = function (element) {
	const column = document.querySelector(`ais-column[key="${element.status}"]`);
	const ticket = document.createElement('div');
	ticket.setAttribute('id', `ticket-${element.key}-container`);
	ticket.innerHTML = `<ais-${element.type} type="${element.type}" id="${element.id}" title="${element.title}" points="${element.points}" assignee="${element.assignee}" status="${element.status}" />`;
	column.append(ticket);
};

const updateTickets = function (id) {
	if (id !== undefined) {
		const updatedTickets = tickets.filter((element) => element.id !== id);
		tickets = updatedTickets;
		localStorage.setItem('tickets', JSON.stringify(updatedTickets));
	} else {
		tickets.forEach((element) => {
			createTicket(element);
		});
	}
};

const addTicketTemplate = document.createElement('template');
addTicketTemplate.innerHTML = `
    <form>
        <fieldset>
            <h3>Add Ticket</h3>
            <div>
                <label for="type">Type</label>
                <input type="text" name="type" />
            </div>
            <div>
                <label for="id">Id</label>
                <input type="text" name="id" />
            </div>
            <div>
                <label for="title">Title</label>
                <input type="text" name="title" />
            </div>
            <div>
                <label for="points">Points</label>
                <input type="number" name="points" />
            </div>
            <div>
                <label for="assignee">Assignee</label>
                <input type="text" name="assignee" />
            </div>

            <div class="button-container">
                <button class="cancelModal" type="button">Cancel</button>
                <button id="confirmAddTicket" type="button">Save</button>
            </div>
        </fieldset>
    </form>
`;

const onAddTicket = function () {
	openModal(addTicketTemplate);
};
const addTicketButton = document.querySelector('#addTicket');
addTicketButton.addEventListener('click', onAddTicket);

const addTicket = function (e) {
	const form = e.target.closest('form');
	let fields = {};

	fields.type = form.querySelector('[name="type"]').value;
	fields.id = form.querySelector('[name="id"]').value;
	fields.title = form.querySelector('[name="title"]').value;
	fields.points = form.querySelector('[name="points"]').value;
	fields.assignee = form.querySelector('[name="assignee"]').value;

	if (validate(fields.type) && validate(fields.id) && validate(fields.title) && validate(fields.assignee) && (fields.type !== 'story' || (fields.type === 'story' && validate(fields.points)))) {
		fields.status = 'todo';

		tickets.push(fields);
		localStorage.setItem('tickets', JSON.stringify(tickets));

		createTicket(fields);

		closeModal();
	} else {
		alert('Please, complete the Form.');
	}
};

// Modal

const openModal = function (template) {
	const modal = document.querySelector('ais-modal');
	modal.setAttribute('show', true);
	modal.append(template.content.cloneNode(true));
};

const closeModal = function () {
	const modal = document.querySelector('ais-modal');
	const form = modal.querySelector('form');
	form.remove();
	modal.setAttribute('show', false);
};

// Form

const validate = function (value) {
	return value != null && value !== '';
};

// addEventListener

document.addEventListener('click', function (e) {
	if (e.target.closest('#confirmAddTicket')) {
		addTicket(e);
	}
	if (e.target.closest('#confirmAddColumn')) {
		addColumn(e);
	}
	if (e.target.closest('.cancelModal')) {
		closeModal();
	}
});

// Init

updateColumns();
updateTickets();
