import App from './../../App'
import {html, render} from 'lit-html'
import {anchorRoute, gotoRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'

class LoginView {
    init() {
        console.log('LoginView.init')
        document.title = 'Login'
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
                    <div class="col-xs-12 col-sm-9 col-md-6 col-lg-4 col-xl-4 bg-white shadow-sm rounded-1 my-auto p-4">
                        <img class="logo-size d-block mx-auto mb-4" src="/images/logo-primary.svg" alt="This is an image of the coffee on café logo.">
                        <h1>Welcome back!</h1>
                        <p class="small text-muted mb-4">Log in to your account to continue.</p>
                        <form class="d-flex flex-column gap-2 mb-2" @submit=${this.loginSubmitHandler}>
                            <sl-input name="email" type="email" label="Email" placeholder="Enter your email..." required></sl-input>
                            <sl-input name="password" type="password" label="Password" placeholder="Enter your password..." required password-toggle></sl-input>
                            <sl-button class="submit-btn" type="submit" variant="primary">Login</sl-button>
                        </form>
                        <p>Don't have an account? <a href="/register" @click=${anchorRoute}>Register</a></p>
                    </div>
                </div>
            `
        render(template, App.rootEl)
    }
}

export default new LoginView()