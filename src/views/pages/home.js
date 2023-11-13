import App from './../../App'
import {html, render} from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import Order from "../../api/Order";
import Drink from "../../api/Drink";

class HomeView {
    async init() {
        console.log('HomeView.init')
        document.title = `Home - ${App.name}`
        this.order = null
        this.myOrder = null
        this.orderCount = 0
        this.drinkCount = 0
        this.accessLevel = Auth.currentUser.accessLevel
        if (this.accessLevel === 1) {
            this.cartItemCount = await Utils.getCartItemCount()
            await this.getLastOrder(Auth.currentUser._id)
        } else {
            await this.getDrinkCount(Auth.currentUser._id)
            await this.getOrderCount(Auth.currentUser._id)
            await this.getMyLastOrder(Auth.currentUser._id)
        }
        this.render()
        Utils.pageIntroAnim()
    }

    async getLastOrder(id) {
        try {
            this.order = await Order.getLastOrder(id)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async getMyLastOrder(id) {
        try {
            this.myOrder = await Order.getMyLastOrder(id)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async getDrinkCount(userId) {
        try {
            this.drinkCount = await Drink.getDrinkCount(userId)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async getOrderCount(userId) {
        try {
            this.orderCount = await Order.getOrderCount(userId)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    render() {
        const template = html`
            <co-app-header title="Home" user="${JSON.stringify(Auth.currentUser)}" cartItemCount="${this.cartItemCount}"></co-app-header>

            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10 mb-4">
                    <h1>Hey, ${Auth.currentUser.firstName}</h1>
                    <p class="small mb-0 brand-color">Welcome to coffee on!</p>
                </div>

                <div class="row col-xs-12 col-sm-10">
                    ${this.accessLevel === 1
                            ? html`
                                <sl-card>
                                    <div class="row align-items-center gy-2 justify-content-between">
                                        <div class="col-md-6 d-flex gap-2 align-items-center">
                                            <sl-icon class="link-color" name="star-fill"></sl-icon>
                                            <p class="text-muted mb-0">You have <span class="fw-bold text-black">${Auth.currentUser.favouriteBaristas.length}</span> favourite baristas.</p>
                                        </div>
                                        <sl-button @click="${() => gotoRoute('/baristas')}" pill size="small" class="col-md-2">Baristas
                                        </sl-button>
                                        <div class="col-md-6 d-flex gap-2 align-items-center">
                                            <sl-icon class="link-color" name="heart-fill"></sl-icon>
                                            <p class="text-muted mb-0">You have <span class="fw-bold text-black">${Auth.currentUser.favouriteDrinks.length}</span> favourite drinks.</p>
                                        </div>
                                        <sl-button @click="${() => gotoRoute('/drinks')}" pill size="small" class="col-md-2">Drinks</sl-button>
                                    </div>
                                </sl-card>

                                <div class="d-flex mb-4 mt-4 justify-content-between align-items-end">
                                    <h2 class="mb-0">Last order</h2>
                                    ${this.order._id == null ? html`
                                        <a href="/orders" @click=${anchorRoute}>View all orders</a>
                                    ` : html``}
                                </div>
                                ${this.order._id == null
                                        ? html`
                                            <sl-card class="text-center col-12">
                                                <h2>You do not have any orders.</h2>
                                                <p class="small text-muted mb-0">Explore our drinks, and we promise you will find what you love.</p>
                                            </sl-card>
                                        `
                                        : html`
                                            <co-order-card class="col-12" id="${this.order._id}"
                                                           date="${this.order.date}"
                                                           ready="${this.order.ready}"
                                                           instructions="${this.order.instructions}"
                                                           barista="${JSON.stringify(this.order.barista)}"
                                                           user="${JSON.stringify(this.order.user)}"
                                                           drinks="${JSON.stringify(this.order.drinks)}"
                                                           total="${this.order.total}"
                                            ></co-order-card>
                                        `}
                            `
                            : html`

                                <sl-card>
                                    <div class="row align-items-center gy-2 justify-content-between">
                                        <div class="col-md-6 d-flex gap-2 align-items-center">
                                            <sl-icon class="link-color" name="cup-hot-fill"></sl-icon>
                                            <p class="text-muted mb-0">You have <span class="fw-bold text-black">${this.drinkCount}</span> special drinks.
                                            </p>
                                        </div>
                                        <sl-button @click="${() => gotoRoute('/mySpecials')}" pill size="small" class="col-md-2">My specials
                                        </sl-button>
                                        <div class="col-md-6 d-flex gap-2 align-items-center">
                                            <sl-icon class="link-color" name="bag-heart-fill"></sl-icon>
                                            <p class="text-muted mb-0">You have received <span class="fw-bold text-black">${this.orderCount}</span> orders.</p>
                                        </div>
                                        <sl-button @click="${() => gotoRoute('/myOrders')}" pill size="small" class="col-md-2">My orders</sl-button>
                                    </div>
                                </sl-card>

                                <div class="d-flex mb-4 mt-4 justify-content-between align-items-end">
                                    <h2 class="mb-0">My last order</h2>
                                    ${this.myOrder._id != null ? html`<a href="/myOrders" @click=${anchorRoute}>View all my orders</a>` : html``}
                                </div>
                                ${this.myOrder._id == null
                                        ? html`
                                            <sl-card class="text-center col-12">
                                                <h2>You have not received any orders.</h2>
                                                <p class="small text-muted mb-0">Create more exciting drinks to receive more orders.</p>
                                            </sl-card>
                                        `
                                        : html`
                                            <co-order-card class="col-12" id="${this.myOrder._id}"
                                                           date="${this.myOrder.date}"
                                                           ready="${this.myOrder.ready}"
                                                           instructions="${this.myOrder.instructions}"
                                                           barista="${JSON.stringify(this.myOrder.barista)}"
                                                           user="${JSON.stringify(this.myOrder.user)}"
                                                           drinks="${JSON.stringify(this.myOrder.drinks)}"
                                                           total="${this.myOrder.total}"
                                            ></co-order-card>
                                        `}
                            `}
                </div>
            </div>
            <co-app-footer></co-app-footer>
        `
        render(template, App.rootEl)
    }
}

export default new HomeView()