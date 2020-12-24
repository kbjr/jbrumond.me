(() => {
	const styles = `
		:host {
			display: contents;
		}

		:host .wrapper {
			padding: 0.75rem;
			background: var(--color-bg-light);
			display: inline-flex;
			cursor: pointer;
			border-radius: 0.5rem;
			text-decoration: none;
			transition: background linear .125s;
		}

			:host .wrapper:hover {
				background: var(--color-bg-accent);
			}

			:host jb-icon {
				color: var(--color-text-link);
				--icon-size: 2rem;
			}

			:host .content {
				color: var(--color-text-body);
				font-size: 1.25rem;
				font-family: 'Open Sans', sans-serif;
				line-height: 2rem;
				margin-left: 0.5rem;
			}
	`;

	const template = `
		<style>${styles}</style>
		<a class="wrapper" tabindex="0">
			<jb-icon></jb-icon>
			<div class="content">
				<slot></slot>
			</div>
		</a>
	`;

	customElements.define('jb-icon-button',
		class IconButton extends HTMLElement {
			static get observedAttributes() {
				return [ 'icon', 'href' ];
			}
	
			constructor() {
				super();
				this.attachShadow({ mode: 'open' });
				this.shadowRoot.innerHTML = template;

				this.icon = this.shadowRoot.querySelector('jb-icon');
				this.wrapper = this.shadowRoot.querySelector('.wrapper');

				this.update_href();
				this.update_icon();
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
				this.update_href();
				this.update_icon();
			}

			update_href() {
				this.wrapper.setAttribute('href', this.getAttribute('href'));
			}

			update_icon() {
				this.icon.setAttribute('icon', this.getAttribute('icon'));
			}
		}
	);
})();