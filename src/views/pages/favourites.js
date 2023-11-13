import App from './../../App'
import {html, render} from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import User from "../../api/User";

class FavouritesView {
    async init() {
        if (Auth.currentUser.accessLevel === 2)
            gotoRoute('/404')
        else {
            document.title = `Favourites - ${App.name}`
            this.favouriteBaristas = null
            this.favouriteDrinks = null
            this.cartItemCount = await Utils.getCartItemCount()
            await this.getFavouriteDrinks()
            await this.getFavouriteBaristas()
            this.render()
            Utils.pageIntroAnim()
        }
    }

    async getFavouriteBaristas() {
        try {
            const currentUser = await User.getUser(Auth.currentUser._id)
            this.favouriteBaristas = currentUser.favouriteBaristas
            this.render()
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async getFavouriteDrinks() {
        try {
            const currentUser = await User.getUser(Auth.currentUser._id)
            this.favouriteDrinks = currentUser.favouriteDrinks
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    isFavouriteBarista(id) {
        if (Auth.currentUser.favouriteBaristas.includes(id))
            return 1
        else
            return 0
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}" cartItemCount="${this.cartItemCount}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <h1>Favourites</h1>
                    <p class="small mb-0 brand-color">View and remove your favourite drinks and baristas.</p>
                </div>

                <sl-tab-group class="col-xs-12 col-sm-10 g-4 mt-0">
                    <sl-tab slot="nav" panel="drinks">Drinks</sl-tab>
                    <sl-tab slot="nav" panel="baristas">Baristas</sl-tab>

                    <sl-tab-panel name="drinks">
                        ${Object.keys(this.favouriteDrinks).length === 0 ? html`
                                    <div class="text-center mb-4 mt-4 p-4 bg-white rounded-1">
                                        <h2>You do not have any favourite drinks added to your account.</h2>
                                        <p class="small text-muted mb-0">Explore our website, and we promise you will find what you love.</p>
                                    </div>
                                `
                                : html`
                                    <div class="row g-4 mt-0">
                                        ${this.favouriteDrinks.map(drink => html`
                                                    <co-drink-card class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
                                                                   id="${drink._id}"
                                                                   name="${drink.name}"
                                                                   description="${drink.description}"
                                                                   price="${drink.price}"
                                                                   user="${JSON.stringify(Auth.currentUser)}"
                                                                   image="${drink.image}"
                                                                   drinkType="${drink.drinkType}"
                                                                   brewMethod="${drink.brewMethod}"
                                                                   route="${'/favourites'}">
                                                    </co-drink-card>
                                                `
                                        ).reverse()}
                                        <div>
                                `
                        }
                    </sl-tab-panel>
                    <sl-tab-panel name="baristas">
                        ${Object.keys(this.favouriteBaristas).length === 0 ? html`
                                    <div class="text-center mb-4 mt-4 p-4 bg-white rounded-1">
                                        <h2>You do not have any favourite baristas added to your account.</h2>
                                        <p class="small text-muted mb-0">Look at their profile and add your favourite barista to your account.</p>
                                    </div>
                                `
                                : html`
                                    <div class="row g-4 mt-0">
                                        ${this.favouriteBaristas.map(barista => html`
                                                    <co-barista-card class="col-md-12 col-lg-6"
                                                                     id="${barista._id}"
                                                                     firstName="${barista.firstName}"
                                                                     lastName="${barista.lastName}"
                                                                     avatar="${barista.avatar}"
                                                                     bio="${barista.bio}"
                                                                     favourite="${this.isFavouriteBarista(barista._id)}"></co-barista-card>
                                                `
                                        ).reverse()}
                                        <div>
                                `
                        }

                    </sl-tab-panel>
                </sl-tab-group>
            </div>
            <co-app-footer></co-app-footer>
        `
        render(template, App.rootEl)
    }
}

export default new FavouritesView()