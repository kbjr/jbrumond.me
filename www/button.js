(() => {
	const template = `
		<style>
			:host {
				display: contents;
			}

			:host([type='round']) {
				width: 5rem;
				height: 5rem;
				border-radius: 100%;
				background: var(--background-layer1);
			}
			
			:host([type='small']) {
				/*  */
			}
			
			:host([type='large']) {
				/*  */
			}
		</style>
		<div class="wrapper">
			<slot></slot>
		</div>
	`;

	customElements.define('jb-button',
		class Button extends HTMLElement {
			static get observedAttributes() {
				return [ ];
			}
	
			constructor() {
				super();
				this.attachShadow({ mode: 'open' });
				this.shadowRoot.innerHTML = template;
			}
	
			connectedCallback() {
				// 
			}
	
			disconnectedCallback() {
				// 
			}
	
			adoptedCallback() {
				// 
			}
	
			attributeChangedCallback(attr, old_value, new_value) {
				// 
			}
		}
	);
})();