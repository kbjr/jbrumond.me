(() => {
	const icons = {
		'github': '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
		'linkedin': `
			<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
			<rect x="2" y="9" width="4" height="12"></rect>
			<circle cx="4" cy="4" r="2"></circle>
		`,
		'mail': `
			<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
			<polyline points="22,6 12,13 2,6"></polyline>
		`,
		'moon': '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
		'sun': `
			<circle cx="12" cy="12" r="5"></circle>
			<line x1="12" y1="1" x2="12" y2="3"></line>
			<line x1="12" y1="21" x2="12" y2="23"></line>
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
			<line x1="1" y1="12" x2="3" y2="12"></line>
			<line x1="21" y1="12" x2="23" y2="12"></line>
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
		`,
	};

	const template = `
		<style>
			:host svg {
				width: var(--icon-size, 40px);
				height: var(--icon-size, 40px);
				display: inline-block;
			}
		</style>
		<div class="wrapper"></div>
	`;

	customElements.define('jb-icon',
		class Icon extends HTMLElement {
			static get observedAttributes() {
				return [ 'icon' ];
			}
	
			constructor() {
				super();
				this.attachShadow({ mode: 'open' });
	
				this.shadowRoot.innerHTML = template;
				this.svg = null;
				this.wrapper = this.shadowRoot.querySelector('.wrapper');

				this.update_icon();
			}

			get icon() {
				return this.getAttribute('icon');
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
				if (attr === 'icon' && old_value !== new_value) {
					this.update_icon();
				}
			}

			update_icon() {
				this.wrapper.innerHTML = `
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						${icons[this.icon] || ''}
					</svg>
				`;

				this.svg = document.querySelector('svg');
			}
		}
	);
})();