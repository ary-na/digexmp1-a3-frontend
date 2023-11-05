import {LitElement, render, html, css} from 'lit'
import {anchorRoute, gotoRoute} from '../Router'
import Auth from './../api/Auth'
import App from './../App'
import User from "../api/User"
import Toast from "../Toast"

export class CoCartItem extends LitElement {
    static styles = css`
      sl-card {
        width: 100%;
      }

      h2 {
        margin-bottom: 0;
        margin-top: 0;
      }

      .card-body {
        display: flex;
        justify-content: space-between;
        gap: var(--sl-spacing-large);
      }

      .card-body-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: var(--sl-spacing-large);
      }

      .card-body-left img {
        min-width: 60px;
        height: 60px;
        object-fit: cover;
        border: 2px var(--brand-color) solid;
        border-radius: var(--sl-border-radius-circle);
      }

      .card-body-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--sl-spacing-large);
      }
      
      .card-body-right div {
        flex-direction: column;
      }

      .price {
        font-size: var(--sl-font-size-large);
        color: var(--link-color);
        font-weight: var(--sl-font-weight-semibold);
      }
    `

    static properties = {
        id: {type: String},
        name: {type: String},
        description: {type: String},
        price: {type: Number},
        image: {type: String},
        route: {type: String},
    }

    constructor() {
        super()
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties)
    }


    async removeFromCartHandler() {
        try {
            await User.removeFromCart(this.id)
            Toast.show('Drink removed from your shopping cart!')
            if (this.route)
                gotoRoute(this.route)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    render() {
        return html`
            <sl-card class="card-basic">
                <div class="card-body">
                    <div class="card-body-left">
                        <img src="${App.apiBase}/images/${this.image}" alt="An image of the drink."/>
                        <div>
                            <h2>${this.name}</h2>
                            <p>${this.description.substring(0, 60)}...</p>
                        </div>
                    </div>
                    <div class="card-body-right">
                        <input name="drink[]" type="hidden" value="${this.id}"/>
                        <sl-input name="quantity[]" type="number" value="1" size="small" min="1" max="10"
                                  required></sl-input>
                        <div>
                            <p class="price">$${this.price}</p>
                            <sl-button title="Remove from cart" label="Remove drink from cart" pill
                                       @click="${this.removeFromCartHandler.bind(this)}">
                                <sl-icon slot="prefix" name="trash"></sl-icon>
                            </sl-button>
                        </div>
                    </div>
            </sl-card>
        `
    }
}

customElements.define('co-cart-item', CoCartItem)

