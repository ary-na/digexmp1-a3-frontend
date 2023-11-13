import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Drink from "../../api/Drink";
import Toast from "../../Toast";

class DrinksView {
    async init() {
        if (Auth.currentUser.accessLevel === 2)
            gotoRoute('/404')
        else {
            document.title = `Drinks - ${App.name}`
            this.drinks = null
            this.cartItemCount = await Utils.getCartItemCount()
            await this.getDrinks()
            this.render()
            Utils.pageIntroAnim()
        }
    }

    async getDrinks() {
        try {
            this.drinks = await Drink.getDrinks()
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    clearFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn')
        filterButtons.forEach(btn => btn.setAttribute("variant", "default"))
    }

    async filterButtonHandler(e) {
        this.clearFilterButtons()
        // Set button type
        e.target.setAttribute("variant", "primary")
        const property = e.target.getAttribute("data-property")
        const match = e.target.getAttribute("data-match")
        await this.filterDrinks(property, match)
    }

    async clearFilters() {
        await this.getDrinks()
        this.clearFilterButtons()
        this.render()
    }

    async filterDrinks(property, match) {
        if (!property || !match) return

        // Get drinks again
        this.drinks = await Drink.getDrinks()

        let filteredDrinks

        if (property === 'type')
            filteredDrinks = this.drinks.filter(drink => drink.type === match)

        if (property === 'decaf')
            filteredDrinks = this.drinks.filter(drink => drink.decaf === Boolean(match).valueOf())

        if (property === 'special')
            filteredDrinks = this.drinks.filter(drink => drink.special === Boolean(match).valueOf())

        this.drinks = filteredDrinks
        this.render()
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"
                           cartItemCount="${this.cartItemCount}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <h1>Drinks</h1>
                    <p class="small mb-4 brand-color">View and order drinks created by our talented baristas.
                        You can also add them to your favourites.</p>


                    <div class="align-items-center">
                        <span class="text-muted">Filters: </span>
                        <sl-button pill class="filter-btn" size="small" data-property="type" data-match="Hot"
                                   @click="${this.filterButtonHandler.bind(this)}">Hot
                        </sl-button>
                        <sl-button pill class="filter-btn" size="small" data-property="type" data-match="Ice"
                                   @click="${this.filterButtonHandler.bind(this)}">Ice
                        </sl-button>
                        <sl-button pill class="filter-btn" size="small" data-property="decaf" data-match="true"
                                   @click="${this.filterButtonHandler.bind(this)}">Decaf
                        </sl-button>
                        <sl-button pill class="filter-btn" size="small" data-property="special" data-match="true"
                                   @click="${this.filterButtonHandler.bind(this)}">Special
                        </sl-button>
                        <sl-button pill size="small" @click="${this.clearFilters.bind(this)}">Clear filter</sl-button>
                    </div>
                </div>


                <div class="row col-xs-12 col-sm-10 g-4 mt-0">
                    ${this.drinks.map(drink => html`
                                <co-drink-card class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
                                               id="${drink._id}"
                                               name="${drink.name}"
                                               description="${drink.description}"
                                               price="${drink.price}"
                                               user="${JSON.stringify(Auth.currentUser)}"
                                               barista="${JSON.stringify(drink.user)}"
                                               image="${drink.image}"
                                               drinkType="${drink.drinkType}"
                                               brewMethod="${drink.brewMethod}"
                                               route="${'/drinks'}">
                                </co-drink-card>
                            `
                    ).reverse()}
                </div>
            </div>
            <co-app-footer></co-app-footer>
        `
        render(template, App.rootEl)
    }
}


export default new DrinksView()