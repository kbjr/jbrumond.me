(() => {
	let scheme;
	let base_host;

	switch (location.hostname) {
		case 'localhost':
		case 'www.localhost':
		case 'watl.localhost':
			scheme = 'http:';
			base_host = 'localhost:8080';
			break;
		
		case 'jbrumond.me':
		case 'www.jbrumond.me':
		case 'watl.jbrumond.me':
			scheme = 'https:';
			base_host = 'jbrumond.me';
			break;
	}

	const markdown_host = `${scheme}//md.${base_host}`;

	const styles = `
		:host .wrapper {
			display: contents;
		}

		:host > .wrapper > .loading {
			color: var(--color-text-light);
		}

		:host > .wrapper > .network-error,
		:host > .wrapper > .response-error {
			color: var(--color-text-light);
		}

		:host > .wrapper > .content {
			/* */
		}

		/* ===== Typography ===== */

		h1, h2, h3, h4, h5, h6,
		p, small, a, li, dt, dd {
			font-family: 'Open Sans', sans-serif;
		}
		
		code, pre {
			font-family: 'Source Code Pro', monospace;
		}

		h1 {
			color: var(--color-text-heading);
			font-size: 3rem;
			font-weight: 300;
		}
		
		p {
			color: var(--color-text-body);
			font-size: 1.5rem;
		}
		
		a {
			color: var(--color-text-link);
		}
		
		a:active,
		a:hover,
		a:focus {
			color: var(--color-text-link-active);
		}
		
		a:visited {
			color: var(--color-text-link-visited);
		}
	`;

	const template = `
		<style>${styles}</style>
		<div class="wrapper"></div>
	`;

	const cache = { };

	customElements.define('jb-markdown-file',
		class MarkdownFile extends HTMLElement {
			static get observedAttributes() {
				return [ 'file' ];
			}
	
			constructor() {
				super();
				this.attachShadow({ mode: 'open' });

				this.shadowRoot.innerHTML = template;
				this.wrapper = this.shadowRoot.querySelector('.wrapper');

				this.update_content();
			}

			get href() {
				return `${markdown_host}/${this.getAttribute('file')}`;
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
				if (attr === 'file' && old_value !== new_value) {
					this.update_content();
				}
			}

			async update_content() {
				const href = this.href;

				if (cache[href]) {
					this.show_content(cache[href]);
					return;
				}

				this.show_loading();

				try {
					const res = await fetch(href, {
						method: 'GET',
						mode: 'cors',
						cache: 'default',
						redirect: 'follow',
						headers: { }
					});

					if (! res.ok) {
						console.error(res);
						await this.show_response_error(res);
						return;
					}

					const content_html = await res.text();

					cache[href] = content_html;
					this.show_content(content_html);
				}

				catch (error) {
					console.error(error);
					this.show_network_error();
					return;
				}
			}

			show_loading() {
				this.wrapper.innerHTML = '<div class="loading">Loading...</div>';
			}

			show_network_error() {
				// TODO: Show retry button
				this.wrapper.innerHTML = `
					<div class="network-error">
						<p>An network error occured while trying to load the content.</p>
					</div>
				`;
			}

			async show_response_error(res) {
				// TODO: Show retry button
				this.wrapper.innerHTML = `
					<div class="response-error">
						<p>An error occured while trying to load the content.</p>
						<pre>${res.status} ${res.statusText}\n${await res.text()}</pre>
					</div>
				`;
			}

			show_content(html) {
				this.wrapper.innerHTML = `<article class="content">${html}</article>`;
			}
		}
	);
})();