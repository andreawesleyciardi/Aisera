const gridTemplate = document.createElement('template');
gridTemplate.innerHTML = `
    <div data-wrapper class="gridWrapper">
        <slot></slot>
    </div>
`;

class GridComponent extends HTMLElement {
	constructor() {
		super();
		// shadow root
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.append(gridTemplate.content.cloneNode(true));

		const style = document.createElement('style');
		style.textContent = `
            .gridWrapper {
                min-width: 100%;
                display: flex;
                gap: 10px;
            }
            .wrapper > * {
                flex: 1;
                min-width: 23%;
            }
        `;
		this.shadow.appendChild(style);
	}
}

// Define element
customElements.define('ais-grid', GridComponent);
