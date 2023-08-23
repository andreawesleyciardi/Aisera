const ticketTemplate = document.createElement('template');
ticketTemplate.innerHTML = `
    <div class="ticketWrapper">
        <div data-header>
            <p data-title></p>
            <button data-cancel title="Remove ticket">X</button>
        </div>
        <div class="left">
            <img data-type />
            <img data-priority src="assets/priority.svg" />
            <div data-points-container class="hidden">
                <p data-points></p>
            </div>
        </div>
        <div class="right">
            <div data-id></div>
            <ais-user data-assignee></ais-user>
        </div>
        <div data-status style="display: none;"></div>
    </div>
`;

class Ticket extends HTMLElement {
	constructor() {
		super();
		// shadow root
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.append(ticketTemplate.content.cloneNode(true));

		// this.update(this, {
		// 	type: this.getAttribute('type'),
		// 	id: this.getAttribute('id'),
		// 	title: this.getAttribute('title'),
		// 	points: this.getAttribute('points'),
		// 	status: this.getAttribute('status'),
		// 	assignee: this.getAttribute('assignee'),
		// });
		// // title
		// const textTitle = this.getAttribute('title');
		// const title = this.shadow.querySelector('[data-title]');
		// title.textContent = textTitle;
		// // id
		const textId = this.getAttribute('id');
		// const id = this.shadow.querySelector('[data-id]');
		// id.textContent = textId;
		// this.setAttribute('data-index', textId);
		// // assignee
		// const textAssignee = this.getAttribute('assignee');
		// const assignee = this.shadow.querySelector('[data-assignee]');
		// assignee.setAttribute('name', textAssignee);
		// style
		const style = document.createElement('style');
		style.textContent = `
            .ticketWrapper {
                margin-top: 0.261rem;
                padding: 0.521rem;
                background-color: #fff;
                border-radius: 0.104rem;
                box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
                font-size: 0.73rem;
                display: grid;
                grid-template-areas: 'header header' 'left right';
                gap: 0.521rem;
            }
            .ticketWrapper:hover {
                background-color: var(--secondary);
            }
            [data-header] {
                grid-area: header;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            [data-title] {
                font-size: 0.73rem;
                font-weight: 400;
                color: #172b4d;
                line-height: 1.42857143;
                max-height: 3.127rem;
                overflow: hidden;
                margin: 0px;
                cursor: pointer;
            }
            [data-title]:hover {
                color: var(--primary);
            }
            [data-type],
            [data-priority] {
                width: 16px;
                height: 16px;
            }
            .left {
                grid-area: left;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 0.261rem;
            }
            [data-points-container] {
                min-width: 1.355rem;
                height: 1.094rem;
                background-color: #dfe1e6;
                padding: 0.156rem 0.365rem;
                border-radius: 1.251rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            [data-points-container].hidden {
                display: none !important;
            }
            [data-points] {
                font-size: 0.625rem;
                font-weight: 600;
                line-height: 0.834rem;
                color: #172b4d;
            }
            .right {
                grid-area: right;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            [data-id] {
                margin-right: 0.261rem;
                font-size: 0.73rem;
                font-weight: 400;
                color: #505f79;
            }
            [data-cancel] {
                border: none;
                color: #6b778c;
                background-color: transparent;
                opacity: 0;
                cursor: pointer;
            }
            [data-header]:hover [data-cancel] {
                opacity: 1;
            }
        `;
		this.shadow.appendChild(style);

		// buttons
		const that = this;
		const title = this.shadow.querySelector('[data-title]');
		title.addEventListener('click', (e) => {
			onEditTicket({
				type: this.getAttribute('type'),
				id: this.getAttribute('id'),
				title: this.getAttribute('title'),
				points: this.getAttribute('points'),
				assignee: this.getAttribute('assignee'),
				status: this.getAttribute('status'),
			});
		});
		const button = this.shadow.querySelector('[data-cancel]');
		button.addEventListener('click', function (e) {
			that.delete(that, textId);
		});
	}

	static get observedAttributes() {
		return ['type', 'id', 'title', 'points', 'assignee', 'status'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.update(this, { [name]: newValue });
		if (name === 'status' && oldValue !== null && oldValue !== newValue) {
			placeTicket(this, newValue, true);
		}
	}
}

Ticket.prototype.delete = function (that, id) {
	const container = that.closest(`#${id}`);
	updateTickets(id);
	container.remove();
};

Ticket.prototype.update = function (that, element) {
	if (element.type != null) {
		const type = that.shadow.querySelector('[data-type]');
		type.setAttribute('src', `assets/${element.type}.svg`);

		const pointsContainer = that.shadow.querySelector('[data-points-container]');
		pointsContainer.classList[element.type === 'story' ? 'remove' : 'add']('hidden');
	}
	if (element.id != null) {
		const id = that.shadow.querySelector('[data-id]');
		id.textContent = element.id;
		that.setAttribute('data-index', element.id);
	}
	if (element.title != null) {
		const title = that.shadow.querySelector('[data-title]');
		title.textContent = element.title;
	}
	if (element.points != null && that.getAttribute('type') === 'story') {
		const points = that.shadow.querySelector('[data-points]');
		points.textContent = element.points;
	}
	if (element.status != null) {
		const status = that.shadow.querySelector('[data-status]');
		status.setAttribute('status', element.status);
	}
	if (element.assignee != null) {
		const assignee = that.shadow.querySelector('[data-assignee]');
		assignee.setAttribute('name', element.assignee);
	}
};

Ticket.prototype.setTypeImg = function (shadow, img) {
	const type = shadow.querySelector('[data-type]');
	type.setAttribute('src', `assets/${img}`);
};

// define elements
customElements.define('ais-ticket', Ticket);
