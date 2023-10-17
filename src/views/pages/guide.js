import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import UserAPI from "../../api/User";
import Toast from "../../Toast";

class GuideView {
    init() {
        document.title = 'Guide'
        this.render()
        this.updateCurrentUser()
        Utils.pageIntroAnim()
    }

    async updateCurrentUser() {
        try {
            await UserAPI.updateUser(Auth.currentUser._id, {newUser: false}, "json")
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    render() {
        const template = html`
            <co-app-header title="Profile" user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="page-content calign">
                <h3 class="brand-color">Welcome ${Auth.currentUser.firstName}!</h3>
                <p>This is a quick tour to teach you the basics of using Haircuts ...</p>

                <div class="guide-step">
                    <h4>Search Hairdressers</h4>
                    <img src="https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE">
                </div>

                <div class="guide-step">
                    <h4>Find a haircut</h4>
                    <img src="https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE">
                </div>

                <div class="guide-step">
                    <h4>Save haircuts to favourites</h4>
                    <img src="https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE">
                </div>

                <sl-button type="primary" @click=${() => gotoRoute('/')}>Okay got it!</sl-button>

            </div>
        `
        render(template, App.rootEl)
    }
}


export default new GuideView()