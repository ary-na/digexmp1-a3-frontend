import {LitElement, render, html, css} from 'lit'
import {anchorRoute, gotoRoute} from '../Router'
import Auth from './../api/Auth'
import App from './../App'
import User from "../api/User"
import Toast from "../Toast"
import Special from "../api/Special";

export class CoSpecialCard extends LitElement {
    static styles = css`
      /* General styles ----------------------------------------------------------- */

      sl-card {
        width: 100%;
      }

      sl-card img {
        height: 200px;
        object-fit: cover;
      }

      sl-card h2, p {
        margin: 0 0 var(--sl-spacing-x-small) 0;
      }

      small {
        color: var(--brand-color);
        font-weight: bold;
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `

    static properties = {
        id: {type: String},
        name: {type: String},
        description: {type: String},
        price: {type: Number},
        user: {type: Object},
        image: {type: String},
        drinkType: {type: String},
        brewMethod: {type: String},
        favourite: {type: Number},
    }

    constructor() {
        super()
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties)
    }

    addToCartHandler() {
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

    async addFavouriteHandler() {
        try {
            await User.addFavouriteSpecial(this.id)
            Toast.show('Special added to your favourites!')
            this.favourite = 1
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async removeFavouriteHandler() {
        try {
            await User.removeFavouriteSpecial(this.id)
            Toast.show('Special removed from your favourites!')
            this.favourite = 0
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async editMySpecialHandler() {
        await localStorage.setItem('specialId', this.id)
        gotoRoute('/editSpecial')
    }

    async removeMySpecialHandler() {
        const dialogEl = document.createElement('sl-dialog');
        dialogEl.setAttribute('label', `Remove ${this.name}`)
        const dialogContent = html`
            <p>Are you sure you want to remove ${this.name} special?</p>
            <sl-button slot="footer" class="closeBtn" style="margin-right: 0.5em;">Close</sl-button>
            <sl-button slot="footer" class="removeBtn" variant="primary">Remove</sl-button>
        `;
        render(dialogContent, dialogEl)

        await document.body.append(dialogEl)
        dialogEl.show()

        const closeBtn = dialogEl.querySelector('.closeBtn')
        closeBtn.addEventListener('click', () => dialogEl.hide())

        const removeBtn = dialogEl.querySelector('.removeBtn')
        removeBtn.addEventListener('click', async () => {
            dialogEl.hide()
            try {
                await Special.removeSpecial(this.id)
            } catch (err) {
                Toast.show(err, 'error')
            }
        })

        // Delete dialog after hide.
        dialogEl.addEventListener('sl-after-hide', () => {
            dialogEl.remove()
            gotoRoute('/mySpecials')
        })
    }

    render() {
        return html`
            <sl-card class="card-overview">
                <img
                        slot="image"
                        src="${App.apiBase}/images/${this.image}"
                        alt="An image of the special drink."
                />

                <h2>${this.name}</h2>
                <p>${this.description}</p>
                <small>$${this.price}</small>

                <div slot="footer" class="card-footer">
                    ${Auth.currentUser.accessLevel === 1
                            ? html`
                                <sl-button variant="primary" pill @click="${this.addToCartHandler.bind(this)}">
                                    <sl-icon slot="prefix" name="cart2"></sl-icon>
                                    Add
                                </sl-button>

                                ${this.favourite === 1 ? html`
                                            <sl-icon-button name="heart-fill" title="Remove from favourites"
                                                            label="Remove from favourite specials"
                                                            @click="${this.removeFavouriteHandler.bind(this)}"></sl-icon-button>`
                                        : html`
                                            <sl-icon-button name="heart" title="Add to favourites"
                                                            label="Add to favourite specials"
                                                            @click="${this.addFavouriteHandler.bind(this)}"></sl-icon-button>`}

                            `
                            : html`
                                <sl-button variant="primary" pill @click="${this.editMySpecialHandler.bind(this)}">
                                    <sl-icon slot="prefix" name="pencil-square"></sl-icon>
                                    Edit
                                </sl-button>
                                <sl-icon-button name="trash3" title="Remove special"
                                                label="Remove special drink"
                                                @click="${this.removeMySpecialHandler.bind(this)}"></sl-icon-button>
                            `}
                </div>
            </sl-card>
        `
    }
}

customElements.define('co-special-card', CoSpecialCard)

