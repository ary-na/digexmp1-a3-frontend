import {LitElement, render, html, css} from 'lit'
import {anchorRoute, gotoRoute} from '../Router'

export class CoAppFooter extends LitElement {
    static styles = css`
      footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      img {
        width: 40px;
      }

      p {
        color: var(--link-color);
      }
    `

    render() {
        return html`
            <footer>
                <img src="/images/logo-secondary.svg" alt="This is an image of the coffee on café logo.">
                <p>&copy 2023 coffee on</p>
            </footer>
        `
    }
}

customElements.define('co-app-footer', CoAppFooter)

