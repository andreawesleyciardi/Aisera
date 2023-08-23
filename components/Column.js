const columnTemplate = document.createElement('template');
columnTemplate.innerHTML = `
    <div data-wrapper class="columnWrapper">
        <header data-header>
            <p data-title></p>
            <button data-cancel title="Remove column">X</button>
        </header>
        <section data-body>
            <slot></slot>
        </section>
    </div>
`;

class Column extends HTMLElement {
	constructor() {
		super();
		// shadow root
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.append(columnTemplate.content.cloneNode(true));
		// title
		const textTitle = this.getAttribute('title');
		const title = this.shadow.querySelector('[data-title]');
		title.textContent = textTitle;
		// key
		const textKey = this.getAttribute('key');
		const wrapper = this.shadow.querySelector('[data-wrapper]');
		this.setAttribute('id', `column-${textKey}`);
		const body = this.shadow.querySelector('[data-body]');
		body.setAttribute('id', `column-body-${textKey}`);
		if (textKey === 'todo') {
			const cancelButton = this.shadow.querySelector('[data-cancel]');
			cancelButton.setAttribute('style', 'visibility: hidden;');
		}

		const style = document.createElement('style');
		style.textContent = `
            .columnWrapper {
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            [data-title] {
                font-size: 0.625rem;
                font-weight: 600;
                text-transform: uppercase;
                margin: 0px;
            }
            [data-header],
            [data-body] {
                background-color: #f4f5f7;
                border-radius: 4px;
            }
            [data-header] {
                font-size: 0.85714286rem;
                color: #5e6c84;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 17px;
            }
            [data-body] {
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.261rem;
                padding: 0.261rem;
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

		// button
		const that = this;
		const button = this.shadow.querySelector('[data-cancel]');
		button.addEventListener('click', function (e) {
			that.delete(that, textKey);
		});
	}
}

Column.prototype.delete = function (that, textKey) {
	const ticketsInColumn = tickets.filter((ticket) => ticket.status === textKey);
	if (ticketsInColumn.length > 0) {
		alert(`You can't delete the selected column because there are active Tickets in it. Move the tickets before to proceed.`);
	} else {
		const container = that.closest(`#column-${textKey}-container`);
		updateColumns(textKey);
		container.remove();
	}
};

// Define element
customElements.define('ais-column', Column);
