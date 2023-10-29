import {LitElement, render, html, css} from 'lit'
import {anchorRoute, gotoRoute} from '../Router'
import Auth from './../api/Auth'
import App from './../App'
import User from "../api/User"
import Toast from "../Toast"

export class CoBaristaCard extends LitElement {
    static styles = css`
      sl-card {
        width: 100%;
      }

      .card-body {
        display: flex;
        align-items: center;
        gap: var(--sl-spacing-large);
      }

      .card-body img {
        min-width: 100px;
        height: 100px;
        object-fit: cover;
        border: 1px var(--brand-color) solid;
        border-radius: var(--sl-border-radius-circle);
      }

      .card-body div {
        margin-top: 0;
        flex-grow: 1;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `

    static properties = {
        id: {type: String},
        firstName: {type: String},
        lastName: {type: String},
        avatar: {type: String},
        bio: {type: String},
        favourite: {type: Number}
    }

    constructor() {
        super()
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties)
    }

    async addFavouriteHandler() {
        try {
            await User.addFavouriteBarista(this.id)
            Toast.show('Barista added to your favourites!')
            this.favourite = 1
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async removeFavouriteHandler() {
        try {
            await User.removeFavouriteBarista(this.id)
            Toast.show('Barista removed from your favourites!')
            this.favourite = 0
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    render() {
        return html`
            <sl-card class="card-basic">
                <div class="card-body">
                    <img src="${App.apiBase}/images/${this.avatar}" alt="An image of the barista."/>
                    <div>
                        <div class="card-header">
                            <h2>${this.firstName} ${this.lastName}</h2>
                            ${this.favourite === 1 ? html`
                                        <sl-icon-button name="heart-fill" title="Remove from favourites"
                                                        label="Remove from favourite baristas"
                                                        @click="${this.removeFavouriteHandler.bind(this)}"></sl-icon-button>`
                                    : html`
                                        <sl-icon-button name="heart" title="Add to favourites"
                                                        label="Add to favourite baristas"
                                                        @click="${this.addFavouriteHandler.bind(this)}"></sl-icon-button>`}
                        </div>
                        <p>${this.bio}</p>
                    </div>
                </div>
            </sl-card>
        `
    }
}

customElements.define('co-barista-card', CoBaristaCard)

