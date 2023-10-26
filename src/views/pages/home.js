import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute } from './../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'

class HomeView {
  init(){    
    console.log('HomeView.init')
    document.title = 'Home'    
    this.render()    
    Utils.pageIntroAnim()    
  }

  render(){
    const template = html`
      <co-app-header title="Home" user=${JSON.stringify(Auth.currentUser)}></co-app-header>
      
      <div class="row app-header-margin">
        <h1 class="col-6 anim-in">Hey ${Auth.currentUser.firstName}</h1>
        <h3 class="col-6">Button example:</h3>
        <sl-button class="col-auto anim-in" @click=${() => gotoRoute('/profile')}>View Profile</sl-button>
        <p>&nbsp;</p>
        <h3>Link example</h3>
        <a href="/profile" @click=${anchorRoute}>View Profile</a>
      </div>
    `
    render(template, App.rootEl)
  }
}

export default new HomeView()