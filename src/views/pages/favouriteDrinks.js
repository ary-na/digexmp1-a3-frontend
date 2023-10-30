import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import User from "../../api/User";

class FavouriteDrinksView {
  init(){
    document.title = `${App.name} - Favourite drinks`
    this.favSpecials = null
    this.render()    
    Utils.pageIntroAnim()
  }

  async getFavSpecials(){
    try {
      const currentUser = await User.getUser(Auth.currentUser._id)
      this.favSpecials = currentUser.favouriteDrinks
      console.log(this.favSpecials)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  render(){
    const template = html`
      <co-app-header title="Profile" user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
      <div class="row">        
        <h1>Favourite Drinks</h1>
        <p>Page content ...</p>

        <div class="haircuts-grid">
          ${this.favSpecials == null ? html`
          <sl-spinner></sl-spinner>
        ` : html`
          ${this.favSpecials.map(haircut => html`
            <va-haircut class="haircut-card"
              id="${haircut._id}"
              name="${haircut.name}"
              description="${haircut.description}"
              price="${haircut.price}"
              user="${JSON.stringify(haircut.user)}"
              image="${haircut.image}"
              gender="${haircut.gender}"
              length="${haircut.length}"
            >        
            </va-haircut>

          `)}
        `}
        </div>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new FavouriteDrinksView()