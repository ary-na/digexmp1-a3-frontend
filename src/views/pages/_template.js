import App from './../../App'
import {html, render } from 'lit-html'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'

class TemplateView {
  init(){
    document.title = 'Template'    
    this.render()    
    Utils.pageIntroAnim()
  }

  render(){
    const template = html`
      <co-app-header user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
      <div class="page-content">        
        <h1>Page title</h1>
        <p>Page content ...</p>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new TemplateView()