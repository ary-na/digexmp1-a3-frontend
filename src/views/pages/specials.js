import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Drink from "../../api/Drink";
import Toast from "../../Toast";

class SpecialsView {
    async init() {
        if (Auth.currentUser.accessLevel === 2)
            gotoRoute('/404')
        else {
            document.title = `${App.name} - Specials`
            this.specials = null
            await this.getSpecials()
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

    isFavouriteDrink(id) {
        if (Auth.currentUser.favouriteDrinks.includes(id))
            return 1
        else
            return 0
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <h1>Specials</h1>
                    <p class="small mb-0 brand-color">View and order special drinks created by our talented baristas. You can also add them to your favourites.</p>
                </div>

                ${Object.keys(this.specials).length === 0 ? html`
                            <div class="col-xs-12 col-sm-10 text-center m-4 p-4 bg-white rounded-1">
                                <h2>We do not have any special drinks at the moment.</h2>
                                <p class="small text-muted mb-0">Check back later, as we may have a pleasant surprise for you.</p>
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
                                                             user="${JSON.stringify(special.user)}"
                                                             image="${special.image}"
                                                             drinkType="${special.drinkType}"
                                                             brewMethod="${special.brewMethod}"
                                                             favourite="${this.isFavouriteDrink(special._id)}">
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


export default new SpecialsView()