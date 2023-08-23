let columns = [
	{ title: 'To Do', key: 'todo' },
	// { title: 'In Progress', key: 'inprogress' },
	// { title: 'Under QA', key: 'underqa' },
	// { title: 'Done', key: 'done' },
].concat([undefined, null, '', '[]'].includes(localStorage.getItem('columns')) === false ? JSON.parse(localStorage.getItem('columns')).filter((item) => item.key != 'todo') : []);

const testTickets = [
	// { id: 'AIS-TEST', type: 'story', title: 'Test Ticket 1', assignee: 'Andrea Ciardi', status: 'todo', points: 5 },
	// { id: 'AIS-TEST', type: 'task', title: 'Test Ticket 2', assignee: 'Gabriel Ciardi', status: 'inprogress' },
	// { id: 'AIS-TEST', type: 'subtask', title: 'Test Ticket 3', assignee: 'Agapi Panagiotidou', status: 'todo' },
	// { id: 'AIS-TEST', type: 'bug', title: 'Test Ticket 4', assignee: 'John Smith', status: 'underqa' },
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
		if (document.getElementById(`column-${fields.title.replaceAll(' ', '').toLowerCase()}`) !== null) {
			alert('The title for the Column that you provided is already used');
		} else {
			fields.key = fields.title.replaceAll(' ', '').toLowerCase();
			columns.push(fields);
			localStorage.setItem('columns', JSON.stringify(columns));

			createColumn(fields);

			closeModal();
		}
	} else {
		alert('Please, complete the Form.');
	}
};

// Add Ticket

const placeTicket = function (ticket, status, toUpdateCollection) {
	const column = document.querySelector(`ais-column[key="${status}"]`);
	if (column != null) {
		column.append(ticket);
	}
	if (toUpdateCollection == true) {
		const updatedTickets = tickets.map((element) => {
			if (element.id == ticket.id) {
				return Object.assign({}, element, { status: status });
			}
			return element;
		});
		tickets = updatedTickets;
		localStorage.setItem('tickets', JSON.stringify(updatedTickets));
	}
};

const createTicket = function (element) {
	const ticket = document.createElement('div');
	ticket.setAttribute('id', `ticket-${element.id}-container`);
	ticket.innerHTML = `<ais-ticket draggable="true" type="${element.type}" id="${element.id}" title="${element.title}" points="${element.points}" assignee="${element.assignee}" status="${element.status}" />`;
	placeTicket(ticket, element.status);
};

const updateTicket = function (element) {
	const ticket = document.querySelector(`#${element.id}`);
	ticket.setAttribute('title', element.title);
};

const updateTickets = function (id) {
	if (id !== undefined) {
		// deleting
		const updatedTickets = tickets.filter((element) => element.id !== id);
		tickets = updatedTickets;
		localStorage.setItem('tickets', JSON.stringify(updatedTickets));
	} else {
		tickets.forEach((element) => {
			createTicket(element);
		});
	}
};

const editTicketTemplate = document.createElement('template');
const getEditTicketTemplate = function (action, element) {
	return `
        <form>
            <fieldset>
                <h3>${action === 'add' ? 'Add' : 'Edit'} Ticket</h3>
                <div ${action === 'edit' && 'style="display: none"'}>
                    <label for="type">Type</label>
                    <select name="type" value="${element?.type ?? ''}" id="selectTypeTicket">
                        <option value="" ${element?.type === '' && 'selected'}>-- Select a value --</option>
                        <option value="story" ${element?.type === 'story' && 'selected'}>Story</option>
                        <option value="task"${element?.type === 'task' && 'selected'}>Task</option>
                        <option value="subtask"${element?.type === 'subtask' && 'selected'}>SubTask</option>
                        <option value="bug"${element?.type === 'bug' && 'selected'}>Bug</option>
                    </select>
                </div>
                <div ${action === 'edit' && 'style="display: none"'}>
                    <label for="id">Id</label>
                    <input type="text" name="id" value="${element?.id ?? ''}" />
                </div>
                <div>
                    <label for="title">Title</label>
                    <input type="text" name="title" value="${element?.title ?? ''}" />
                </div>
                <div ${element?.type !== 'story' && 'style="display: none"'} id="pointsTicketContainer">
                    <label for="points">Points</label>
                    <input type="number" name="points" value="${element?.points ?? ''}" />
                </div>
                <div>
                    <label for="assignee">Assignee</label>
                    <input type="text" name="assignee" value="${element?.assignee ?? ''}" />
                </div>
                
                <div ${action === 'add' && 'style="display: none"'}>
                    <label for="type">Status</label>
                    <select name="status" value="${element?.status ?? ''}">
                        ${columns.map((item, index) => '<option value="' + item.key + '" ' + (element?.status === item.key && 'selected') + '>' + item.title + '</option>')}
                    </select>
                </div>

                <div class="button-container">
                    <button class="cancelModal" type="button">Cancel</button>
                    <button id="${action === 'add' ? 'confirmAddTicket' : 'confirmEditTicket'}" type="button">Save</button>
                </div>
            </fieldset>
        </form>
    `;
};

const onAddTicket = function () {
	editTicketTemplate.innerHTML = getEditTicketTemplate('add', null);
	openModal(editTicketTemplate);
};

const addTicketButton = document.querySelector('#addTicket');
addTicketButton.addEventListener('click', onAddTicket);

const onEditTicket = function (element) {
	editTicketTemplate.innerHTML = getEditTicketTemplate('edit', element);
	openModal(editTicketTemplate);
};

const manageTicket = function (action, e) {
	const form = e.target.closest('form');
	let fields = {};

	fields.type = form.querySelector('[name="type"]').value;
	fields.id = form.querySelector('[name="id"]').value;
	fields.title = form.querySelector('[name="title"]').value;
	fields.points = form.querySelector('[name="points"]').value;
	fields.assignee = form.querySelector('[name="assignee"]').value;
	fields.status = form.querySelector('[name="status"]').value;

	if (validate(fields.type) && validate(fields.id) && validate(fields.title) && validate(fields.assignee) && (fields.type !== 'story' || (fields.type === 'story' && validate(fields.points)))) {
		if (action === 'add' && document.getElementById(fields.id) !== null) {
			alert('The ID provided is already used or not valid');
		} else {
			fields.status = [undefined, null, '', '[]'].includes(fields.status) ? 'todo' : fields.status;

			if (action == 'add') {
				tickets.push(fields);
			} else {
				const index = tickets.findIndex((element, index) => element.id === fields.id);
				tickets[index] = fields;
			}

			localStorage.setItem('tickets', JSON.stringify(tickets));

			if (action == 'add') {
				createTicket(fields);
			} else {
				const ticket = document.querySelector(`#${fields.id}`);
				Object.keys(fields).forEach((key) => {
					ticket.setAttribute(key, fields[key]);
				});
			}
		}

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

document.addEventListener('change', function (e) {
	if (e.target.id === 'selectTypeTicket') {
		const pointsField = document.getElementById('pointsTicketContainer');
		if (e.target.value === 'story') {
			pointsField.setAttribute('style', 'display: flex;');
		} else {
			pointsField.setAttribute('style', 'display: none;');
		}
	}
});

document.addEventListener('click', function (e) {
	if (e.target.closest('#confirmAddTicket')) {
		manageTicket('add', e);
	}
	if (e.target.closest('#confirmEditTicket')) {
		manageTicket('edit', e);
	}
	if (e.target.closest('#confirmAddColumn')) {
		addColumn(e);
	}
	if (e.target.closest('.cancelModal')) {
		closeModal();
	}
});

document.addEventListener('dragstart', function (e) {
	console.log('dragstart');
	e.dataTransfer.setData('draggedTicket', e.target.id);
});

document.addEventListener('drop', function (e) {
	if (e.target.tagName === 'AIS-COLUMN') {
		e.preventDefault();
		const draggedTicketId = e.dataTransfer.getData('draggedTicket');
		if (draggedTicketId != null) {
			const ticket = document.getElementById(draggedTicketId);
			const draggedTicketParent = ticket.closest('ais-column');
			const startColumnKey = draggedTicketParent.getAttribute('key');
			const endColumnKey = e.target.getAttribute('key');
			if (startColumnKey !== endColumnKey) {
				e.target.append(ticket);
				ticket.setAttribute('status', endColumnKey);
			}
		}
	}
});

document.addEventListener('dragover', function (e) {
	if (e.target.tagName === 'AIS-COLUMN') {
		e.preventDefault();
	}
});

// Init

updateColumns();
updateTickets();
