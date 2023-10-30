import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from '../../Toast'
import moment from 'moment'
import User from "../../api/User";

class EditProfileView {
  async init(){
    console.log('EditProfileView.init')
    document.title = `${App.name} - Edit profile`
    this.user = null
    this.render()    
    Utils.pageIntroAnim()
    await this.getUser()
  }

  async getUser(){
    try {
      this.user = await User.getUser(Auth.currentUser._id)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  async updateProfileSubmitHandler(e){
    e.preventDefault()
    const formData = new FormData(e.target)
    const submitBtn = document.querySelector('.submit-btn')
    submitBtn.setAttribute('loading', '')
    try {
      const updatedUser = await User.updateUser(Auth.currentUser._id, formData)
      delete updatedUser.password        
      this.user = updatedUser     
      Auth.currentUser = updatedUser
      this.render()
      Toast.show('profile updated')
    }catch(err){      
      Toast.show(err, 'error')
    }
    submitBtn.removeAttribute('loading')
  }

  render(){
    const template = html`
      <co-app-header user=${JSON.stringify(Auth.currentUser)}></co-app-header>
      <div class="row my-4 justify-content-center">
        ${(this.user == null) ? html`
          <sl-spinner></sl-spinner>
        `:html`
            <div class="col-xs-12 col-sm-10">
                <h1>Edit profile</h1>
                <p class="small mb-4 brand-color">If your details need to be corrected, edit your profile to keep your details up to date.</p>

                <form class="row gy-3 mt-0" @submit=${this.updateProfileSubmitHandler.bind(this)}>
                    <sl-input class="col-md-6" type="text" label="First name" name="firstName" value="${this.user.firstName}" placeholder="Enter your first name..." required></sl-input>
                    <sl-input class="col-md-6" type="text" label="Last name" name="lastName" value="${this.user.lastName}" placeholder="Enter your last name..." required></sl-input>
                    <sl-input class="col-md-6" type="text" label="Email" name="email" value="${this.user.email}" placeholder="Enter your email..." required></sl-input>

                    <div class="col-md-6">
                        <label for="formFile" class="form-label mb-1">Upload an avatar</label>
                        <input class="form-control" name="avatar" type="file" id="formFile">
                    </div>

                    <sl-textarea name="bio" label="Bio" placeholder="Enter a short bio about yourself..." value="${this.user.bio}"></sl-textarea>

                    <sl-button class="ms-auto col-md-2" @click="${() => gotoRoute('/profile')}">Back</sl-button>
                    <sl-button type="submit" variant="primary" class="col-md-2 submit-btn">Update</sl-button>
                </form>

                <p class="mt-4 text-muted small">Updated: ${moment(Auth.currentUser.updatedAt).format('MMMM Do YYYY, @ h:mm a')}</p>
        `}
      </div>
    `
    render(template, App.rootEl)
  }
}

export default new EditProfileView()