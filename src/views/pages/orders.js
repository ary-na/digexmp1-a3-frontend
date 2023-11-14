import App from './../../App'
import {html, render} from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import Order from "../../api/Order"

class OrdersView {
    async init() {
        if (Auth.currentUser.accessLevel === 2)
            gotoRoute('/404')
        else {
            document.title = `Orders - ${App.name}`
            this.orders = null
            this.cartItemCount = await Utils.getCartItemCount()
            await this.getOrders(Auth.currentUser._id)
            this.render()
            Utils.pageIntroAnim()
        }
    }

    async getOrders(id) {
        try {
            this.orders = await Order.getOrders(id)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"
                           cartItemCount="${this.cartItemCount}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <h1>Orders</h1>
                    <p class="small mb-0 brand-color">View and see the status of your orders before you pick them
                        up.</p>
                </div>

                <div class="row col-xs-12 col-sm-10 row g-4 mt-0">
                    ${Object.keys(this.orders).length === 0 ? html`
                                <sl-card class="col-12 text-center">
                                    <h2>You do not have any orders.</h2>
                                    <p class="small text-muted mb-0">Explore our drinks, and we promise you will find what you love.</p>
                                </sl-card>`
                            : html`
                                ${this.orders.map(order => html`
                                    <co-order-card class="col-12" id="${order._id}"
                                                   date="${order.date}"
                                                   ready="${order.ready}"
                                                   instructions="${order.instructions}"
                                                   barista="${JSON.stringify(order.barista)}"
                                                   user="${JSON.stringify(order.user)}"
                                                   drinks="${JSON.stringify(order.drinks)}"
                                                   total="${order.total}"
                                    ></co-order-card>
                                `).reverse()}
                            `}
                </div>
            </div>
            <co-app-footer></co-app-footer>
        `
        render(template, App.rootEl)
    }
}

export default new OrdersView()