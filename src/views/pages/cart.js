import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import User from "../../api/User";
import Drink from "../../api/Drink";
import Order from "../../api/Order";
import baristas from "./baristas";

class CartView {
    async init() {
        document.title = `Cart - ${App.name}`
        this.cartItems = null
        this.baristas = null
        this.favouriteBaristas = null
        this.total = 0
        this.cartItemCount = await Utils.getCartItemCount()
        await this.getCartItems()
        await this.calculateTotal(null)
        await this.getBaristas()
        await this.getFavouriteBaristas()
        this.render()
        await this.createBaristaSelectOptions()
        Utils.pageIntroAnim()
    }

    async getCartItems() {
        try {
            const currentUser = await User.getUser(Auth.currentUser._id)
            this.cartItems = currentUser.cart
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async getDrink(id) {
        try {
            return await Drink.getDrink(id)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async getBaristas() {
        try {
            this.baristas = await User.getUsersByAccess()
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async getFavouriteBaristas() {
        try {
            const currentUser = await User.getUser(Auth.currentUser._id)
            this.favouriteBaristas = currentUser.favouriteBaristas
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async createBaristaSelectOptions() {
        if (this.favouriteBaristas.length !== 0) {
            this.favouriteBaristas.map(barista => {
                this.createOptionElement(barista._id, `${barista.firstName} ${barista.lastName}`)
            })
        } else {
            this.baristas.map(barista => {
                this.createOptionElement(barista._id, `${barista.firstName} ${barista.lastName}`)
            })
        }
        this.render()
    }

    async createOptionElement(barista_id, baristaName) {
        const selectElement = await document.querySelector("sl-select")
        const optionElement = document.createElement('sl-option')
        optionElement.value = barista_id
        optionElement.innerHTML = baristaName
        if(selectElement)
            selectElement.appendChild(optionElement)
    }

    async calculateTotal(e) {

        this.total = 0
        const quantityElements = document.querySelectorAll("sl-input")

        // Calculate total price.
        if (e) {
            for (let i = 0; i < quantityElements.length; i++) {
                let drink = await this.getDrink(quantityElements[i].id)
                this.total += (drink.price * quantityElements[i].value)
            }
            this.render()
        } else {
            this.cartItems.forEach(item => this.total += item.price)
        }
    }

    async removeFromCartHandler(id) {
        try {
            await User.removeFromCart(id)
            Toast.show('Drink removed from your shopping cart!')
            gotoRoute('/cart')
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async orderSubmitHandler(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('total', this.total)
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.setAttribute('loading', '')

        try {
            await Order.createOrder(formData)
            Toast.show("Order created!")

        } catch (err) {
            Toast.show(err, 'error');
        }
        submitBtn.removeAttribute('loading')

        await User.removeAllFromCart()
        gotoRoute('/cart')
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"
                           cartItemCount="${this.cartItemCount}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="col-xs-12 col-sm-10">
                    <h1>Cart</h1>
                    <p class="small mb-4 brand-color">You have ${this.cartItemCount} items in your cart.</p>

                    ${this.cartItemCount === 0 ? html`
                                <div class="text-center mb-4 mt-4 p-4 bg-white rounded-1">
                                    <h2>You do not have any items in your cart.</h2>
                                    <p class="small text-muted mb-0">Explore our website, and we promise you will find what
                                        you love.</p>
                                </div>
                            `
                            : html`
                                <form class="row gy-3 mt-0" @submit=${this.orderSubmitHandler.bind(this)}>
                                    <input name="user" type="hidden" value="${Auth.currentUser._id}"/>
                                    ${this.cartItems.map(cart =>
                                            html`

                                                <sl-card>
                                                    <div class="row gy-3">
                                                        <div class="col d-flex gap-3 align-items-center">
                                                            <img class="cart-img"
                                                                 src="${App.apiBase}/images/${cart.image}"
                                                                 alt="An image of the drink."/>
                                                            <div>
                                                                <h2>${cart.name}</h2>
                                                                <p>${cart.description.substring(0, 60)}...</p>
                                                            </div>
                                                        </div>
                                                        <div class="col d-flex align-items-center gap-3 justify-content-end">
                                                            <input name="items" type="hidden" value="${cart._id}"/>
                                                            <input name="prices" type="hidden" value="${cart.price}"/>
                                                            <sl-input @input="${this.calculateTotal.bind(this)}"
                                                                      id="${cart._id}"
                                                                      value="1"
                                                                      class="w-25" name="quantities" type="number"
                                                                      size="small"
                                                                      min="1" max="10" required></sl-input>

                                                            <p class="fw-bold link-color mb-0">$${cart.price}</p>
                                                            <sl-button title="Remove from cart"
                                                                       label="Remove drink from cart" pill
                                                                       @click="${() => this.removeFromCartHandler(cart._id)}">
                                                                <sl-icon slot="prefix" name="trash"></sl-icon>
                                                            </sl-button>
                                                        </div>
                                                    </div>
                                                </sl-card>

                                            `).reverse()}

                                    <sl-textarea name="instructions" label="Instructions" placeholder="Enter any instructions (e.g., extra hot, sugar etc.)..."></sl-textarea>


                                    <sl-select class="col-12" name="barista" label="Barista"
                                               placeholder="Select a barista to make your drink/s..." required>
                                    </sl-select>

                                    <div class="col-12 d-flex justify-content-between border-top pt-2">
                                        <h3>Total:</h3>
                                        <p class="align-self-end mb-2 fw-bold link-color">$${this.total}</p>
                                    </div>

                                    <sl-button type="submit" variant="primary" class="ms-auto col-md-2 submit-btn">
                                        Checkout
                                    </sl-button>
                                </form>
                            `
                    }
                </div>
            </div>
        `
        render(template, App.rootEl)
    }
}

export default new CartView()