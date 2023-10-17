import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'

class FavouriteDrinksView {
  init(){
    document.title = 'Favourite Drinks'
    this.render()    
    Utils.pageIntroAnim()
  }

  render(){
    const template = html`
      <co-app-header title="Profile" user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
      <div class="page-content">        
        <h1>Favourite Drinks</h1>
        <p>Page content ...</p>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new FavouriteDrinksView()