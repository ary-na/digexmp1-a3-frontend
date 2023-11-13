import App from './../../App'
import {html, render} from 'lit'
import {anchorRoute, gotoRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'

class LoginView {
    init() {
        console.log('LoginView.init')
        document.title = `Login - ${App.name}`
        this.render()
        Utils.pageIntroAnim()
    }

    loginSubmitHandler(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.setAttribute('loading', '')

        // Login using Auth
        Auth.login(formData, () => {
            submitBtn.removeAttribute('loading')
        })
    }

    render() {
        const template =
            html`
                <div class="row justify-content-center h-100">
                    <div class="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white shadow-sm rounded-1 my-auto p-5">
                        <img class="logo-size d-block mx-auto mb-5" src="/images/logo-primary.svg" alt="This is an image of the coffee on café logo.">
                        <h1>Welcome back!</h1>
                        <p class="small brand-color mb-5">Log in to your account to continue.</p>
                        <form class="d-flex flex-column gap-3 mb-3" @submit=${this.loginSubmitHandler}>
                            <sl-input name="email" type="email" label="Email" placeholder="Enter your email..." required></sl-input>
                            <sl-input name="password" type="password" label="Password" placeholder="Enter your password..." required password-toggle></sl-input>
                            <sl-button class="submit-btn" type="submit" variant="primary">Login</sl-button>
                        </form>
                        <p class="small text-muted">Don't have an account? <a href="/register" @click=${anchorRoute}>Register</a></p>
                    </div>
                </div>
            `
        render(template, App.rootEl)
    }
}

export default new LoginView()