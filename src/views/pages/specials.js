import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Special from "../../api/Special";
import Toast from "../../Toast";

class SpecialsView {
    async init() {
        document.title = 'Specials'
        this.specials = null
        await this.getSpecials()
        this.render()
        Utils.pageIntroAnim()
    }

    async getSpecials() {
        try {
            this.specials = await Special.getSpecials()
        } catch (err) {
            Toast.show(err, 'error')
        }
    }


    render() {
        const template = html`
            <co-app-header title="Profile" user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row g-3 app-header-margin">
                <h1 class="col-12">Specials</h1>
                ${this.specials.map(special => html`
                            <co-special-card class="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                                             name="${special.name}"
                                             description="${special.description}"
                                             price="${special.price}"
                                             user="${JSON.stringify(special.user)}"
                                             image="${special.image}"
                                             drinkType="${special.drinkType}"
                                             brewMethod="${special.brewMethod}"></co-special-card>
                        `
                )}
            </div>
        `
        render(template, App.rootEl)
    }
}


export default new SpecialsView()