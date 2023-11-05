import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import User from "../../api/User";

class CartView {
    async init() {
        document.title = `${App.name} - Cart`
        this.cartItems = null
        this.cartItemCount = await Utils.getCartItemCount()
        await this.getCartItems()
        this.render()
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

    async orderSubmitHandler() {

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
                                <div class="text-center m-4 p-4 bg-white rounded-1">
                                    <h2>You do not have any items in your cart.</h2>
                                    <p class="small text-muted mb-0">Explore our website, and we promise you will find what
                                        you love.</p>
                                </div>
                            `
                            : html`
                                <form class="row gy-3 mt-0" @submit=${this.orderSubmitHandler.bind(this)}>
                                    ${this.cartItems.map(cart =>
                                            html`
                                                <co-cart-item id="${cart._id}"
                                                              name="${cart.name}"
                                                              description="${cart.description}"
                                                              price="${cart.price}"
                                                              image="${cart.image}"
                                                              route="${'/cart'}">
                                                </co-cart-item>
                                            `).reverse()}

                                    <div>
                
                                    </div>
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