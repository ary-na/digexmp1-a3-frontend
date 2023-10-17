import { LitElement, html, css } from 'lit'
import {anchorRoute, gotoRoute} from '../Router'
import Auth from './../api/Auth'
import App from './../App'

export class CoAppHeader extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }
    .app-header {
      background: var(--brand-color);
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      height: var(--app-header-height);
      color: #fff;
      display: flex;
      z-index: 9;
      box-shadow: 4px 0px 10px rgba(0,0,0,0.2);
      align-items: center;
    }


    .app-header-main {
      flex-grow: 1;
      display: flex;
      align-items: center;
    }

    .app-header-main::slotted(h1){
      color: #fff;
    }

    .app-logo a {
      color: #fff;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.2em;
      padding: .6em;
      display: inline-block;
    }

    .app-logo img {
      width: 90px;
    }

    .hamburger-btn::part(base) {
      color: #fff;
    }

    .app-top-nav {
      display: flex;
      height: 100%;
      align-items: center;
    }

    .app-top-nav a {
      display: inline-block;
      padding: .8em;
      text-decoration: none;
      color: #fff;
    }

    .app-side-menu-items a {
      display: block;
      text-decoration: none;
      font-size: 1.3em;
      color: #333;
    }

    .app-side-menu-logo {
      width: 120px;
      margin-bottom: 1em;
      position: absolute;
      top: 1em;
      left: 2em;
    }

    .app-drawer::part(panel) {
      background-color: var(--heading-color);
    }
    
    .app-drawer::part(close-button) {
      color: var(--base-txt-color);
    }

    .app-drawer-logo {
      width: 150px;
      display: block;
    }

    .page-title {
      color: var(--app-header-txt-color);
      margin-right: 0.5em;
      font-size: var(--app-header-title-font-size);
    }

    /* active nav links */
    .app-top-nav a.active,
    .app-side-menu-items a.active {
      font-weight: bold;
    }

    /* RESPONSIVE - MOBILE ------------------- */
    @media all and (max-width: 768px){

      .app-top-nav {
        display: none;
      }
    }
  `;

  static properties = {
    title: {type: String},
    user: {type: Object},
  };

  constructor() {
    super();
  }

  firstUpdated(){
    super.firstUpdated()
    this.navActiveLinks()
  }

  navActiveLinks(){
    const currentPath = window.location.pathname
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a')
    navLinks.forEach(navLink => {
      if(navLink.href.slice(-1) == '#') return
      if(navLink.pathname === currentPath){
        navLink.classList.add('active')
      }
    })
  }

  hamburgerClick(){
    const appMenu = this.shadowRoot.querySelector('.app-drawer')
    appMenu.show()
  }

  menuClick(e){
    e.preventDefault()
    const pathname = e.target.closest('a').pathname
    const appSideMenu = this.shadowRoot.querySelector('.app-drawer')
    // hide appMenu
    appSideMenu.hide()
    appSideMenu.addEventListener('sl-after-hide', () => {
      // goto route after menu is hidden
      gotoRoute(pathname)
    })
  }

  render() {
    return html`
       <header class="app-header">
      <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}" style="font-size: 1.5em;"></sl-icon-button>       
      
      <div class="app-header-main">
        ${this.title ? html`
          <h1 class="page-title">${this.title}</h1>
        `:``}
        <slot></slot>
      </div>

      <nav class="app-top-nav">
        <a href="/" @click="${anchorRoute}">Home</a>        
        <sl-dropdown>
          <a slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
            <sl-avatar style="--size: 24px;" image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ''}></sl-avatar> ${this.user && this.user.firstName}
          </a>
          <sl-menu>            
            <sl-menu-item @click="${() => gotoRoute('/profile')}">Profile</sl-menu-item>
            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Edit Profile</sl-menu-item>
            <sl-menu-item @click="${() => Auth.signOut()}">Sign Out</sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </nav>
    </header>

    <sl-drawer class="app-drawer" label="Welcome ${this.user.firstName}!" placement="start">
      <nav class="app-side-menu-items">
        <a href="/" @click="${this.menuClick}">Home</a>
        <a href="/profile" @click="${this.menuClick}">Profile</a>
        <a href="#" @click="${() => Auth.signOut()}">Sign Out</a>
      </nav>
      <img slot="footer" class="app-drawer-logo mx-auto" src="/images/logo-primary-alternate.svg" alt="This is an image of the coffee on café logo.">
    </sl-drawer>
    `;
  }
}

customElements.define('co-app-header', CoAppHeader);

