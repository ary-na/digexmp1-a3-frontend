import {LitElement, render, html, css} from 'lit'
import {anchorRoute, gotoRoute} from '../Router'
import Auth from './../api/Auth'
import App from './../App'

export class CoSpecialCard extends LitElement {
    static styles = css`
      /* General styles ----------------------------------------------------------- */
      sl-card {
        width: 100%;
      }
    `;

    static properties = {
        name: {type: String},
        description: {type: String},
        price: {type: Number},
        user: {type: Object},
        image: {type: String},
        drinkType: {type: String},
        brewMethod: {type: String},
    };

    constructor() {
        super();
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties)
    }

    moreInfoHandler() {
        const dialogEl = document.createElement('sl-dialog');
        dialogEl.className = "special-dialog"
        const dialogContent = html`
        <h2>Test</h2>
        `;
        render(dialogContent, dialogEl)

        document.body.append(dialogEl)
        dialogEl.show()

        // Delete dialog after hide.
        dialogEl.addEventListener('sl-after-hide', () => {
            dialogEl.remove()
        })
    }

    addFavHandler() {
        alert("add to fave")
    }

    render() {
        return html`
            <sl-card class="card-overview">
                <img
                        slot="image"
                        src="${this.image}"
                        alt="An image of the special drink."
                />

                <strong>${this.name}</strong><br/>
                ${this.description}<br/>
                <small>${this.price}</small>

                <div slot="footer">
                    <sl-button variant="primary" pill @click="${this.moreInfoHandler.bind(this)}">More Info</sl-button>
                    <sl-icon-button name="balloon-heart" label="Favourites" @click="${this.addFavHandler.bind(this)}"></sl-icon-button>
                </div>
            </sl-card>
        `;
    }
}

customElements.define('co-special-card', CoSpecialCard);
