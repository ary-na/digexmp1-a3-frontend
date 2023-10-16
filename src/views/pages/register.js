import App from './../../App'
import Auth from './../../Auth'
import {html, render } from 'lit-html'
import {anchorRoute, gotoRoute} from '../../Router'
import Utils from './../../Utils'

class RegisterView{

  init(){
    console.log('RegisterView.init')
    document.title = 'Register'
    this.render()
    Utils.pageIntroAnim()
  }

  registerSubmitHandler(e){
    e.preventDefault()
    console.log("hi hi hi hi")
    const formData = new FormData(e.target)
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')

    // sign up using Auth
    Auth.register(formData, () => {
      submitBtn.removeAttribute('loading')
    })
  }

  render(){
    const template = html`
        <div class="page-content page-centered">
            <div class="signinup-box">
                <img class="signinup-logo" src="/images/logo-primary.svg">
                <h1>Register</h1>
                <form class="form-signup" @submit=${this.registerSubmitHandler}>
                    <sl-select name="accessLevel" label="Access Level" help-text="Select access level..." clearable required>
                        <sl-option value="1">Customer</sl-option>
                        <sl-option value="2">Barista</sl-option>
                    </sl-select>
                    <sl-input name="firstName" type="text" placeholder="First name" required></sl-input>
                    <sl-input name="lastName" type="text" placeholder="Last name" required></sl-input>
                    <sl-input name="email" type="email" placeholder="Email" required></sl-input>
                    <sl-input name="password" type="password" placeholder="Password" required
                              toggle-password></sl-input>
                    <sl-button class="submit-btn" type="primary" submit style="width: 100%;">Register</sl-button>
                </form>
                <p>Already have an account? <a href="/login" @click=${anchorRoute}>Login</a></p>
            </div>
        </div>
    `
    render(template, App.rootEl)
  }
}


export default new RegisterView()