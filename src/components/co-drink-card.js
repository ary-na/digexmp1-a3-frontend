import {LitElement, render, html, css} from 'lit'
import {anchorRoute, gotoRoute} from '../Router'
import Auth from './../api/Auth'
import App from './../App'
import User from "../api/User"
import Toast from "../Toast"
import Drink from "../api/Drink";

export class CoDrinkCard extends LitElement {
    static styles = css`
      /* General styles ----------------------------------------------------------- */

      sl-card {
        width: 100%;
      }
      
      sl-card::part(base) {
        --border-color: none;
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

      a {
        display: block;
        color: var(--link-color);
        margin-bottom: var(--sl-spacing-small);
      }
    `

    static properties = {
        id: {type: String},
        name: {type: String},
        description: {type: String},
        price: {type: Number},
        user: {type: Object},
        barista: {type: Object},
        image: {type: String},
        drinkType: {type: String},
        brewMethod: {type: String},
        favourite: {type: Number},
        inCart: {type: Number},
        route: {type: String},
    }

    constructor() {
        super()
    }

    firstUpdated(_changedProperties) {
        this.favourite = this._isFavouriteDrink(this.id)
        this.inCart = this._isAddedToCart(this.id)
    }

    _isFavouriteDrink(id) {
        if (Auth.currentUser.favouriteDrinks.includes(id))
            return 1
        else
            return 0
    }

    _isAddedToCart(id) {
        if (Auth.currentUser.cart.includes(id))
            return 1
        else
            return 0
    }

    async addFavouriteHandler() {
        try {
            await User.addFavouriteDrink(this.id)
            Toast.show('Special added to your favourites!')
            this.favourite = 1
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async removeFavouriteHandler() {
        try {
            await User.removeFavouriteDrink(this.id)
            Toast.show('Special removed from your favourites!')
            this.favourite = 0
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async addToCartHandler() {
        try {
            await User.addToCart(this.id)
            Toast.show('Drink added to your shopping cart!')
            this.inCart = 1
            if (this.route)
                gotoRoute(this.route)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async removeFromCartHandler() {
        try {
            await User.removeFromCart(this.id)
            Toast.show('Drink removed from your shopping cart!')
            this.inCart = 0
            if (this.route)
                gotoRoute(this.route)
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
                await Drink.removeSpecial(this.id)
                gotoRoute('/mySpecials')
            } catch (err) {
                Toast.show(err, 'error')
            }
        })

        // Delete dialog after hide.
        dialogEl.addEventListener('sl-after-hide', () => {
            dialogEl.remove()
        })
    }

    async readMoreHandler(e){
        e.preventDefault()
        const dialogEl = document.createElement('sl-dialog');
        dialogEl.setAttribute('label', `${this.name}`)
        const dialogContent = html`
            <p>${this.description}</p>
            ${this.barista ? html`
                <small><em>by ${this.barista.firstName} ${this.barista.lastName}</em></small>
            ` : html``}
        `;
        render(dialogContent, dialogEl)

        await document.body.append(dialogEl)
        dialogEl.show()

        // Delete dialog after hide.
        dialogEl.addEventListener('sl-after-hide', () => {
            dialogEl.remove()
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
                <p>${this.description.substring(0, 60)}...</p>
                <a href="#" @click=${this.readMoreHandler.bind(this)}>read more</a>
                <small>$${this.price}.00</small>

                <div slot="footer" class="card-footer">
                    ${Auth.currentUser.accessLevel === 1
                            ? html`
                                ${this.inCart === 1 ? html`
                                    <sl-button title="Remove from cart" label="Remove drink from cart" pill
                                               @click="${this.removeFromCartHandler.bind(this)}">
                                        <sl-icon slot="prefix" name="trash"></sl-icon>
                                    </sl-button>
                                ` : html`
                                    <sl-button title="Add to cart" label="Add drink to cart" variant="primary"
                                               pill @click="${this.addToCartHandler.bind(this)}">
                                        <sl-icon slot="prefix" name="cart2"></sl-icon>
                                        Add
                                    </sl-button>
                                `}
                                ${this.favourite === 1 ? html`
                                            <sl-icon-button name="heart-fill" title="Remove from favourites"
                                                            label="Remove from favourite specials"
                                                            @click="${this.removeFavouriteHandler.bind(this)}"></sl-icon-button>`
                                        : html`
                                            <sl-icon-button name="heart" title="Add to favourites"
                                                            label="Add to favourite specials"
                                                            @click="${this.addFavouriteHandler.bind(this)}"></sl-icon-button>`}

                            ` : html`
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

customElements.define('co-drink-card', CoDrinkCard)

