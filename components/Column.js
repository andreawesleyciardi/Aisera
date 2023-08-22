const columnTemplate = document.createElement('template');
columnTemplate.innerHTML = `
    <div data-wrapper class="wrapper">
        <header data-header>
            <p data-title></p>
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
		// id
		const textId = this.getAttribute('id');
		const wrapper = this.shadow.querySelector('[data-wrapper]');
		wrapper.setAttribute('id', `column-${textId}`);
		const body = this.shadow.querySelector('[data-body]');
		body.setAttribute('id', `column-body-${textId}`);

		const style = document.createElement('style');
		style.textContent = `
            .wrapper {
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
                padding: 17px;
            }
            [data-body] {
                display: flex;
                flex-direction: column;
                gap: 0.261rem;
                padding: 0.261rem;
            }
        `;
		this.shadow.appendChild(style);
	}
}

// Define element
customElements.define('ais-column', Column);
