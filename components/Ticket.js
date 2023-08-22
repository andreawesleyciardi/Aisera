const ticketTemplate = document.createElement('template');
ticketTemplate.innerHTML = `
    <div class="wrapper">
        <p data-title></p>
        <div class="left">
            <img data-type />
            <img data-priority src="assets/priority.svg" />
            <div data-points-container class="hidden">
                <p data-points></p>
            </div>
        </div>
        <div class="right">
            <div data-id></div>
            <ais-user name="Andrea Ciardi"></ais-user>
        </div>
    </div>
`;

class Ticket extends HTMLElement {
	constructor() {
		super();
		// shadow root
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.append(ticketTemplate.content.cloneNode(true));
		// title
		const textTitle = this.getAttribute('title');
		const title = this.shadow.querySelector('[data-title]');
		title.textContent = textTitle;
		// id
		const textId = this.getAttribute('id');
		const id = this.shadow.querySelector('[data-id]');
		id.textContent = textId;
		// style
		const style = document.createElement('style');
		style.textContent = `
            .wrapper {
                margin-top: 0.261rem;
                padding: 0.521rem;
                background-color: #fff;
                border-radius: 0.104rem;
                box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
                font-size: 0.73rem;
                display: grid;
                grid-template-areas: 'title title' 'left right';
                gap: 0.521rem;
            }
            [data-title] {
                grid-area: title;
                font-size: 0.73rem;
                font-weight: 400;
                color: #172b4d;
                line-height: 1.42857143;
                max-height: 3.127rem;
                overflow: hidden;
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
        `;
		this.shadow.appendChild(style);
	}
}

Ticket.prototype.setTypeImg = function (shadow, img) {
	const type = shadow.querySelector('[data-type]');
	type.setAttribute('src', `/assets/${img}`);
};

class Story extends Ticket {
	constructor() {
		super();
		// show points
		const pointsContainer = this.shadow.querySelector('[data-points-container]');
		pointsContainer.classList.remove('hidden');
		// points
		const textPoints = this.getAttribute('points');
		const points = this.shadow.querySelector('[data-points]');
		points.textContent = textPoints;
		// type img
		this.setTypeImg(this.shadow, 'story.svg');
	}
}

class Task extends Ticket {
	constructor() {
		super();
		// type img
		this.setTypeImg(this.shadow, 'task.svg');
	}
}

class Subtask extends Ticket {
	constructor() {
		super();
		// type img
		this.setTypeImg(this.shadow, 'subtask.svg');
	}
}

class Bug extends Ticket {
	constructor() {
		super();
		// type img
		this.setTypeImg(this.shadow, 'bug.svg');
	}
}

// define elements
customElements.define('ais-story', Story);
customElements.define('ais-task', Task);
customElements.define('ais-subtask', Subtask);
customElements.define('ais-bug', Bug);