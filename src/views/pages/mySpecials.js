import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Special from "../../api/Special";
import Toast from "../../Toast";

class MySpecialsView {
    async init() {
        if (Auth.currentUser.accessLevel === 1)
            gotoRoute('/404')

        document.title = `${App.name} - My specials`
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
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <div class="col-11">
                    <h1>My specials</h1>
                    <p class="small mb-0 brand-color">View, modify or delete your specials. Keep your
                        specials up to date to make the most money by earning commissions.</p>
                    </div>
                    <div class="col-1 mt-auto d-flex justify-content-end">
                        <a href="/createSpecial" @click=${anchorRoute}>Create</a>
                    </div>
                </div>

                ${Object.keys(this.specials).length === 0 ?
                        html`
                            <div class="col-xs-12 col-sm-10 text-center m-4 p-4 bg-white rounded-1">
                                <h2>You do not have any specials.</h2>
                                <p class="small text-muted mb-0">Create a special coffee drink for customers to showcase your
                                    expertise.</p>
                            </div>
                        `
                        :
                        html`
                            <div class="col-xs-12 col-sm-10 row g-4 mt-0">
                                ${this.specials.map(special => html`
                                            <co-special-card class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3"
                                                             id="${special._id}"
                                                             name="${special.name}"
                                                             description="${special.description}"
                                                             price="${special.price}"
                                                             user="${JSON.stringify(special.user)}"
                                                             image="${special.image}"
                                                             drinkType="${special.drinkType}"
                                                             brewMethod="${special.brewMethod}"></co-special-card>
                                        `
                                )}
                                <div>
                        `
                }
            </div>
        `
        render(template, App.rootEl)
    }
}


export default new MySpecialsView()