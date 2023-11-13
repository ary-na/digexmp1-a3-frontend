import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import App from "../../App";
import Order from "../../api/Order";
import Toast from "../../Toast";

class MyOrdersView {
    async init() {
        if (Auth.currentUser.accessLevel === 1)
            gotoRoute('/404')
        else {
            document.title = `My orders - ${App.name}`
            this.myOrders = null
            await this.getMyOrders(Auth.currentUser._id)
            this.render()
            Utils.pageIntroAnim()
        }
    }

    async getMyOrders(id){
        try {
            this.myOrders = await Order.getMyOrders(id)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10 mb-4">
                    <h1>My orders</h1>
                    <p class="small mb-0 brand-color">View and prepare your orders. Change the status of the orders to let customers know it is ready for pickup.</p>
                </div>

              <div class="row col-xs-12 col-sm-10">
                    ${Object.keys(this.myOrders).length === 0 ? html`
                                <sl-card class="col-12 text-center">
                                    <h2>You have not received any orders.</h2>
                                    <p class="small text-muted mb-0">Create more exciting drinks to receive more orders.</p>
                                </sl-card>
                            `
                            : html`
                                <div class="col-xs-12 col-sm-10 row g-4 mt-0">
                                    ${this.myOrders.map(order => html`
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
                                </div>
                            `}
                  </div>
            </div>
            <co-app-footer></co-app-footer>
        `
        render(template, App.rootEl)
    }
}


export default new MyOrdersView()