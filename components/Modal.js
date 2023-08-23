const modalTemplate = document.createElement('template');
modalTemplate.innerHTML = `
    <div data-wrapper class="modalWrapper hidden">
        <section data-modal>
            <slot></slot>
        </section>
        <div data-overlay class="overlay"></div>
    </div>
`;

class Modal extends HTMLElement {
	constructor() {
		super();
		// shadow root
		this.shadow = this.attachShadow({ mode: 'open' });
		this.shadow.append(modalTemplate.content.cloneNode(true));

		this.wrapper = this.shadow.querySelector('[data-wrapper]');

		const style = document.createElement('style');
		style.textContent = `
            [data-modal],
            [data-overlay] {
                position: fixed;
            }
            [data-modal] {
                width: 600px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 999;
                background-color: #FFFFFF;
            }
            [data-overlay] {
                width: 100vw;
                height: 100vh;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 997;
                background-color: rgba(0, 0, 0, 0.5);
            }
            .hidden {
                display: none;
            }
        `;
		this.shadow.appendChild(style);
	}

	static get observedAttributes() {
		return ['show'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'show') {
			if (newValue === 'true') {
				this.wrapper.classList.remove('hidden');
			} else {
				this.wrapper.classList.add('hidden');
			}
		}
	}
}

// define element
customElements.define('ais-modal', Modal);
