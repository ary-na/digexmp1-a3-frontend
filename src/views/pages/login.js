import App from './../../App'
import {html, render } from 'lit-html'
import {anchorRoute, gotoRoute} from '../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'

class LoginView {
  init(){
    console.log('LoginView.init')
    document.title = 'Login'
    this.render()
    Utils.pageIntroAnim()
  }

  loginSubmitHandler(e){
    e.preventDefault()
    const formData = new FormData(e.target)
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')

    // Login using Auth
    Auth.login(formData, () => {
      submitBtn.removeAttribute('loading')
    })
  }

  render(){
    const template = html`      
      <div class="page-content page-centered">
        <div class="signinup-box">
          <img class="signinup-logo" src="/images/logo-primary.svg" alt="Coffee on logo">          
          <form class="form-signup" @submit=${this.loginSubmitHandler}>
              <sl-input name="email" type="email" placeholder="Email" required></sl-input>
              <sl-input name="password" type="password" placeholder="Password" required toggle-password></sl-input>
            <sl-button class="submit-btn" type="primary" submit style="width: 100%;">Login</sl-button>
          </form>
          <p>Don't have an account? <a href="/register" @click=${anchorRoute}>Register</a></p>
        </div>
      </div>
    `
    render(template, App.rootEl)
  }
}

export default new LoginView()