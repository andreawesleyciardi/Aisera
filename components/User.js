const userTemplate = document.createElement('template');
userTemplate.innerHTML = `
    <div class="userWrapper">
        <p data-name></p>
    </div>
`;

class User extends HTMLElement {
	constructor() {
		super();
		// shadow root
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.append(userTemplate.content.cloneNode(true));
		// style
		const width = this.getAttribute('width');
		const fontSize = this.getAttribute('font-size');
		const style = document.createElement('style');
		style.textContent = `
            .userWrapper {
                width: ${width ?? '1.25rem'};
                aspect-ratio: 1;
                background-color: #172b4d;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            [data-name] {
                color: #fff;
                font-size: ${fontSize ?? '0.6rem'};
                font-weight: 700;
                text-transform: uppercase;
                margin: auto;
            }
        `;
		this.shadow.appendChild(style);
	}

	static get observedAttributes() {
		return ['name'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'name' && newValue !== null && newValue !== '') {
			const textName = newValue;
			const arrName = textName.split(' ');
			const initials = `${arrName[0].substring(0, 1)}${arrName[1].substring(0, 1)}`;
			const name = this.shadow.querySelector('[data-name]');
			name.textContent = initials;
		}
	}
}

// define element
customElements.define('ais-user', User);
