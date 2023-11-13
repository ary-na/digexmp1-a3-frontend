import App from './../../App'
import {html, render} from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Drink from "../../api/Drink";
import Toast from "../../Toast";

class MySpecialsView {
    async init() {
        if (Auth.currentUser.accessLevel === 1)
            gotoRoute('/404')
        else {
            document.title = `My specials - ${App.name}`
            this.mySpecials = null
            await this.getMySpecials(Auth.currentUser._id)
            localStorage.removeItem('specialId')
            this.render()
            Utils.pageIntroAnim()
        }
    }

    async getMySpecials(userId) {
        try {
            this.mySpecials = await Drink.getMySpecials(userId)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }


    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <div class="d-flex gap-3 justify-content-between">
                        <div>
                            <h1>My specials</h1>
                            <p class="small mb-0 brand-color">View, modify or delete your specials. Keep your specials up to date to make the most money by earning commissions.</p>
                        </div>
                        <a class="align-self-end" href="/createSpecial" @click=${anchorRoute}>Create</a>
                    </div>
                </div>

                <div class="col-xs-12 col-sm-10 row g-4 mt-0">
                    ${Object.keys(this.mySpecials).length === 0 ? html`
                                <sl-card class="col-12 text-center">
                                    <h2>You do not have any specials.</h2>
                                    <p class="small text-muted mb-0">Create a special coffee drink for customers to showcase your expertise.</p>
                                </sl-card>
                            `
                            : html`
                                ${this.mySpecials.map(special => html`
                                            <co-drink-card class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
                                                           id="${special._id}"
                                                           name="${special.name}"
                                                           description="${special.description}"
                                                           price="${special.price}"
                                                           user="${JSON.stringify(special.user)}"
                                                           image="${special.image}"
                                                           type="${special.type}"
                                                           decaf="${special.decaf}"
                                                           brewMethod="${special.brewMethod}"></co-drink-card>
                                        `
                                ).reverse()}
                            `
                    }
                </div>
            </div>
            <co-app-footer></co-app-footer>
        `
        render(template, App.rootEl)
    }
}

export default new MySpecialsView()