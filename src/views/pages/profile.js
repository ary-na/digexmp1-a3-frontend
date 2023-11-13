import App from './../../App'
import {html, render} from 'lit'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import moment from 'moment'

class ProfileView {
    async init() {
        console.log('ProfileView.init')
        document.title = `Profile - ${App.name}`
        this.cartItemCount = await Utils.getCartItemCount()
        this.render()
        Utils.pageIntroAnim()
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}" cartItemCount="${this.cartItemCount}"></co-app-header>
            <div class="row my-4 justify-content-center">
                <div class="row col-xs-12 col-sm-10">
                    <div class="col-11">
                        <h1>My profile</h1>
                        <p class="small mb-0 brand-color">If your details need to be corrected, edit your profile.</p>
                    </div>
                    <div class="col-1 mt-auto d-flex justify-content-end">
                        <a href="/editProfile" @click=${anchorRoute}>Edit</a>
                    </div>
                </div>

                <div class="row gy-4 mt-0 col-xs-12 col-sm-10">
                    <div class="col-md-6 d-flex justify-content-center">
                        ${Auth.currentUser && Auth.currentUser.avatar ? html`
                            <sl-avatar class="avatar align-self-center" image=${(Auth.currentUser && Auth.currentUser.avatar) ? `${App.apiBase}/images/${Auth.currentUser.avatar}` : ''}></sl-avatar>` : html`
                            <sl-avatar class="avatar align-self-center"></sl-avatar>`}
                    </div>
                    <div class="col-md-6 d-flex flex-column justify-content-center">
                        <h2>${Auth.currentUser.firstName} ${Auth.currentUser.lastName}</h2>
                        <p><span class="small text-muted">Email:</span> ${Auth.currentUser.email}</p>
                        ${Auth.currentUser.bio ? html`<p><span class="small text-muted">Bio:</span>${Auth.currentUser.bio}</p>` : null}
                    </div>

                    <p class="mt-4 text-muted small">Updated: ${moment(Auth.currentUser.updatedAt).format('MMMM Do YYYY, @ h:mm a')}</p>
                </div>
            </div>
        `
        render(template, App.rootEl)
    }
}

export default new ProfileView()