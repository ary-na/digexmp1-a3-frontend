import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Special from "../../api/Special";
import Toast from "../../Toast";
import special from "../../api/Special";

class SpecialsView {
    init() {
        document.title = 'Specials'
        this.render()
        this.specials = null
        Utils.pageIntroAnim()
        this.getSpecials()
    }

    async getSpecials() {
        try {
            this.specials = await Special.getSpecials()
            console.log(this.specials)
            this.render()
        } catch (err) {
            Toast.show(err, 'error')
        }
    }


    render() {
        const template = html`
            <va-app-header title="Profile" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
            <div class="page-content">
                <h1>Specials</h1>
                ${this.specials.map(special => {
                    html `<p>special ${special.name}</p>`
                })}
            </div>
        `
        render(template, App.rootEl)
    }
}


export default new SpecialsView()