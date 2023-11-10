import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute } from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import Order from "../../api/Order";

class HomeView {
  async init(){
    console.log('HomeView.init')
    document.title = `Home - ${App.name}`
    this.order = null
    this.accessLevel = Auth.currentUser.accessLevel
    this.cartItemCount = await Utils.getCartItemCount()
    await this.getLastOrder(Auth.currentUser._id)
    this.render()    
    Utils.pageIntroAnim()    
  }

  async getLastOrder(id){
    try{
      this.order = await Order.getLastOrder(id)
    }catch (err){
      Toast.show(err, 'error')
    }
  }

  render(){
    const template = html`
        <co-app-header title="Home" user="${JSON.stringify(Auth.currentUser)}"
                       cartItemCount="${this.cartItemCount}"></co-app-header>

        <div class="row my-4 justify-content-center">
            <div class="row col-xs-12 col-sm-10 mb-4">
                <h1>Hey, ${Auth.currentUser.firstName}</h1>
                <p class="small mb-0 brand-color">Welcome to coffee on!</p>
            </div>

            <div class="row col-xs-12 col-sm-10">
              ${this.accessLevel === 1 
                  ? html`
                    <div class="d-flex mb-4 justify-content-between align-items-end">
                      <h2 class="mb-0">Last order</h2>
                      <a href="/orders" @click=${anchorRoute}>View all orders</a>
                    </div>
                          <co-order-card class="col-12" id="${this.order._id}"
                                         date="${this.order.date}"
                                         ready="${this.order.ready}"
                                         instructions="${this.order.instructions}"
                                         barista="${JSON.stringify(this.order.barista)}"
                                         user="${JSON.stringify(this.order.user)}"
                                         drinks="${JSON.stringify(this.order.drinks)}"
                                         total="${this.order.total}"
                          ></co-order-card>
                      ` 
                  
                  : html``}
            </div>
        </div>
        <co-app-footer></co-app-footer>
    `
    render(template, App.rootEl)
  }
}

export default new HomeView()