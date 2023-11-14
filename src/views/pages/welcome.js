import App from './../../App'
import {html, render} from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import User from "../../api/User";
import Toast from "../../Toast";

class WelcomeView {
    async init() {
        document.title = `Welcome - ${App.name}`
        this.render()
        await this.updateCurrentUser()
        Utils.pageIntroAnim()
    }

    async updateCurrentUser() {
        try {
            await User.updateUser(Auth.currentUser._id, {newUser: false}, "json")
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    render() {
        const template = html`
            <div class="row justify-content-center h-100">
                <div class="row g-4 col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white shadow-sm rounded-1 my-auto p-5">
                    <img class="logo-size d-block mx-auto mb-4" src="/images/logo-primary.svg" alt="This is an image of the coffee on café logo.">
                    <img class="w-100 d-block" src="/images/welcome-page.svg" alt="This is an image of the coffee on café logo.">
                    <h1>Welcome ${Auth.currentUser.firstName}!</h1>
                    ${Auth.currentUser.accessLevel === 1 
                            ? html`<p>Find your <span class="fst-italic">favourite barista</span>, <span class="fst-italic">drinks</span> and <span class="fst-italic">order</span> away with coffee on.</p>`
                            : html`<p>List your <span class="fst-italic">special drinks</span>, <span class="fst-italic">receive</span> and <span class="fst-italic">prepare orders</span> with coffee on.</p></p>`}
                    <sl-button variant="primary" class="ms-auto col-md-4" pill @click=${() => gotoRoute('/')}>Continue</sl-button>
                </div>
            </div>

        `
        render(template, App.rootEl)
    }
}

export default new WelcomeView()