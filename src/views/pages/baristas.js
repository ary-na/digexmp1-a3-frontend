import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import User from "../../api/User";
import Toast from "../../Toast";

class BaristasView {
    async init() {
        if (Auth.currentUser.accessLevel === 2)
            gotoRoute('/404')

        document.title = `${App.name} - Baristas`
        this.baristas = null
        await this.getBaristas()
        this.render()
        Utils.pageIntroAnim()
    }

    async getBaristas() {
        try {
            this.baristas = await User.getUsersByAccess()
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
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <h1>Baristas</h1>
                    <p class="small mb-0 brand-color">View our baristas and add them to your list of favourite
                        baristas.</p>
                </div>

                <div class="col-xs-12 col-sm-10 row g-4 mt-0">
                    ${this.baristas.map(barista => html`
                                <co-barista-card class="col-md-12 col-lg-6"
                                                 id="${barista._id}"
                                                 firstName="${barista.firstName}"
                                                 lastName="${barista.lastName}"
                                                 avatar="${barista.avatar}"
                                                 bio="${barista.bio}"
                                                 favourite="${this.isFavouriteBarista(barista._id)}"></co-barista-card>
                            `
                    )}
                    <div>


                    </div>
        `
        render(template, App.rootEl)
    }
}


export default new BaristasView()