import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Drink from "../../api/Drink";
import Toast from "../../Toast";
import User from "../../api/User";

class DrinksView {
    async init() {
        if (Auth.currentUser.accessLevel === 2)
            gotoRoute('/404')
        else {
            document.title = `Drinks - ${App.name}`
            this.specials = null
            this.cartItemCount = await Utils.getCartItemCount()
            await this.getSpecials()
            //this.filterDrinks('price', '30-40')
            this.render()
            Utils.pageIntroAnim()
        }
    }

    async getSpecials() {
        try {
            this.specials = await Drink.getSpecials()
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    clearFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn')
        filterButtons.forEach(btn => btn.removeAttribute("type"))
    }

    filterButtonHandler(e) {
        this.clearFilterButtons()
        // Set button type
        e.target.setAttribute("type", "primary")
        e.target.getAttribute("data-property")
        e.target.getAttribute("data-match")
    }

    async filterDrinks(property, match) {
        if (!property || !match) return

        // Get drinks again
        this.specials = await this.getSpecials()

        let filteredDrinks

        if (property === 'drinkType')
            filteredDrinks = this.specials.filter(drink => drink.drinkType === match)

        if (property === 'decaf')
            filteredDrinks = this.specials.filter(drink => drink.decaf === match)

        if (property === 'price') {
            const priceRangeStart = match.split('-')[0]
            const priceRangeEnd = match.split('-')[1]
            filteredDrinks = this.specials.filter(drink => drink.price >= priceRangeStart && drink.price <= priceRangeEnd)
        }

        this.specials = filteredDrinks
        this.render()
    }

    async clearFilters() {
        this.clearFilterButtons()
        await this.getSpecials()
        this.render()
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"
                           cartItemCount="${this.cartItemCount}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <h1>Specials</h1>
                    <p class="small mb-0 brand-color">View and order special drinks created by our talented baristas.
                        You can also add them to your favourites.</p>


                    <div>
                        <div>Filter by
                            <div>
                                <div>Drink type</div>
                                <sl-button class="filter-btn" size="small" data-property="drinkType" data-match="Ice"
                                           @click="${this.filterButtonHandler.bind(this)}">Ice
                                </sl-button>
                                <sl-button size="small" @click="${this.filterButtonHandler.bind(this)}">Hot</sl-button>
                                <sl-button size="small" @click="${this.clearFilters().bind(this)}>Clear filter</sl-button>
                            </div>


                        </div>

                        ${Object.keys(this.specials).length === 0 ? html`
                                    <div class="col-xs-12 col-sm-10 text-center m-4 p-4 bg-white rounded-1">
                                        <h2>We do not have any special drinks at the moment.</h2>
                                        <p class="small text-muted mb-0">Check back later, as we may have a pleasant surprise
                                            for
                                            you.</p>
                                    </div>
                                `
                                : html`
                                    <div class="col-xs-12 col-sm-10 row g-4 mt-0">
                                        ${this.specials.map(special => html`
                                                    <co-drink-card class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
                                                                   id="${special._id}"
                                                                   name="${special.name}"
                                                                   description="${special.description}"
                                                                   price="${special.price}"
                                                                   user="${JSON.stringify(Auth.currentUser)}"
                                                                   image="${special.image}"
                                                                   drinkType="${special.drinkType}"
                                                                   brewMethod="${special.brewMethod}"
                                                                   route="${'/specials'}">
                                                    </co-drink-card>
                                                `
                                        ).reverse()}
                                        <div>
                                `
                        }
                    </div>
        `
        render(template, App.rootEl)
    }
}


export default new DrinksView()