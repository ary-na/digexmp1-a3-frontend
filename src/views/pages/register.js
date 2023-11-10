import App from './../../App'
import Auth from '../../api/Auth'
import {html, render} from 'lit-html'
import {anchorRoute, gotoRoute} from '../../Router'
import Utils from './../../Utils'

class RegisterView {

    init() {
        console.log('RegisterView.init')
        document.title = `Register - ${App.name}`
        this.render()
        Utils.pageIntroAnim()
    }

    async registerSubmitHandler(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.setAttribute('loading', '')

        // sign up using Auth
        await Auth.register(formData, () => {
            submitBtn.removeAttribute('loading')
        })
    }

    render() {
        const template =
            html`
                <div class="row justify-content-center h-100">
                    <div class="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white shadow-sm rounded-1 my-auto p-5">
                        <img class="logo-size d-block mx-auto mb-5" src="/images/logo-primary.svg" alt="This is an image of the coffee on café logo.">
                        <h1>Welcome!</h1>
                        <p class="small brand-color mb-5">To get started, create an account.</p>
                        <form class="d-flex flex-column gap-3 mb-3" @submit=${this.registerSubmitHandler}>
                            <sl-select name="accessLevel" label="Account type" placeholder="Select an account type..." value="1" required>
                                <sl-option value="1">Customer</sl-option>
                                <sl-option value="2">Barista</sl-option>
                            </sl-select>
                            <sl-input name="firstName" type="text" label="First name" placeholder="Enter your first name..." required></sl-input>
                            <sl-input name="lastName" type="text" label="Last name" placeholder="Enter your last name..." required></sl-input>
                            <sl-input name="email" type="email" label="Email" placeholder="Enter your email..." required></sl-input>
                            <sl-input name="password" type="password" label="Password" placeholder="Enter a password..." required password-toggle></sl-input>
                            <sl-button class="submit-btn" type="submit" variant="primary">Create</sl-button>
                        </form>
                        <p class="small text-muted">Already have an account? <a href="/login" @click=${anchorRoute}>Login</a></p>
                    </div>
                </div>
            `
        render(template, App.rootEl)
    }
}


export default new RegisterView()