(() => {
	
	const animation = 'linear .2s';
	const color_scheme = 'color_scheme';
	const color_scheme_attr = 'data-color-scheme';
	const prefers_dark_scheme = window.matchMedia('(prefers-color-scheme: dark)');
	
	// Make sure we set the correct starting color scheme where loading

	const override = localStorage.getItem(color_scheme);

	if (override) {
		document.body.setAttribute(color_scheme_attr, override);
	}

	document.body.style.transition = `background ${animation}`;


	const styles = `
		:host {
			display: contents;
		}

		:host .wrapper {
			width: 3rem;
			height: 3rem;
			padding: 0.5rem;
			background: var(--color-bg-light);
			border-radius: 100%;
			cursor: pointer;
			overflow: hidden;
			position: relative;
			transition: background ${animation};
		}

			:host .wrapper:hover {
				background: var(--color-bg-accent);
			}

			:host .wrapper .icons {
				width: 6rem;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				transition: transform ${animation};
				pointer-events: none;
			}

				:host .wrapper .icons[data-mode='light'] {
					/*  */
				}

				:host .wrapper .icons[data-mode='dark'] {
					transform: translateX(-3rem);
				}

		:host jb-icon {
			--icon-size: 3rem;
			transition: opacity ${animation};
		}

			:host jb-icon[icon='sun'] {
				color: var(--color-sun);
				filter: drop-shadow(1px 1px 1px #555);
			}

			:host [data-mode='dark'] jb-icon[icon='sun'] {
				opacity: 0;
			}

			:host jb-icon[icon='moon'] {
				color: var(--color-moon);
				filter: drop-shadow(1px 1px 0.5px #bbb);
			}

			:host [data-mode='light'] jb-icon[icon='moon'] {
				opacity: 0;
			}
	`;

	const template = `
		<style>${styles}</style>
		<div class="wrapper" title="Toggle Light / Dark Mode" tabindex="0" role="button" aria-pressed="false">
			<div class="icons">
				<jb-icon icon="sun"></jb-icon>
				<jb-icon icon="moon"></jb-icon>
			</div>
		</div>
	`;

	customElements.define('jb-color-scheme-toggle',
		class ColorSchemeToggle extends HTMLElement {
			constructor() {
				super();
				this.attachShadow({ mode: 'open' });
				this.shadowRoot.innerHTML = template;
				this.wrapper = this.shadowRoot.querySelector('.wrapper');
				this.icons = this.shadowRoot.querySelector('.icons');
				this.update_icons();
			}

			connectedCallback() {
				this.addEventListener('click', this.onSelect);
				this.addEventListener('keydown', this.onKeydown);
				this.addEventListener('keyup', this.onKeyup);
			}
			
			disconnectedCallback() {
				this.removeEventListener('click', this.onSelect);
				this.removeEventListener('keydown', this.onKeydown);
				this.removeEventListener('keyup', this.onKeyup);
			}

			onKeydown = (/** @type KeyboardEvent */ event) => {
				if (event.keyCode === 32) {
					event.preventDefault();
				}


				if (event.keyCode === 13) {
					event.preventDefault();
					this.onSelect();
				}
			};

			onKeyup = (/** @type KeyboardEvent */ event) => {
				if (event.keyCode === 32) {
					event.preventDefault();
					this.onSelect();
				}
			};

			onSelect = () => {
				toggle();
				this.update_icons();
			};

			update_icons() {
				const current = get_current();

				this.icons.setAttribute('data-mode', current);
				this.wrapper.setAttribute('aria-pressed', current === 'dark');
			}
		}
	);

	function get_current() {
		const override = localStorage.getItem(color_scheme);

		if (override) {
			return override;
		}

		return prefers_dark_scheme.matches ? 'dark' : 'light';
	}

	function toggle() {
		if (document.body.hasAttribute(color_scheme_attr)) {
			localStorage.removeItem(color_scheme);
			document.body.removeAttribute(color_scheme_attr);
		}

		else {
			const preference = prefers_dark_scheme.matches ? 'light' : 'dark';

			localStorage.setItem(color_scheme, preference);
			document.body.setAttribute(color_scheme_attr, preference);
		}
	}

})();