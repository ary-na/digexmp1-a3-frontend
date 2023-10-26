import {LitElement, html, css} from 'lit'
import {anchorRoute, gotoRoute} from '../Router'
import Auth from './../api/Auth'
import App from './../App'

export class CoAppHeader extends LitElement {
    static styles = css`
      /* General styles ----------------------------------------------------------- */

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .app-header {
        position: fixed;
        background-color: var(--body-bg);
        top: 0;
        right: 0;
        left: 0;
        padding: 1em;
        border-bottom: 0.5px solid var(--link-color);
        display: flex;
        align-items: center;
        z-index: 3;
      }

      .app-header-logo {
        display: flex;
        flex-grow: 1;
        align-items: center;
      }

      .app-header-logo img {
        height: 2em;
      }

      .app-header-top-nav a {
        text-decoration: none;
        color: var(--brand-color);
        font-weight: 300;
      }

      /* App drawer styles */

      .app-drawer-menu-items ul {
        list-style: none;
      }

      .app-drawer-menu-items a {
        display: block;
        text-decoration: none;
        font-size: 1.3em;
        color: var(--menu-link-color);
        margin-bottom: .8em;
        transition: 0.2s;
      }

      .app-drawer-menu-items a:hover {
        color: var(--secondary-txt-color);
      }

      .app-drawer-menu-items a.active {
        font-weight: bold;
        color: var(--secondary-txt-color);
        border-bottom: 0.5px solid var(--secondary-txt-color);
        margin-right: 10px;
        padding-bottom: 5px;
      }

      .app-drawer-logo {
        width: 150px;
      }

      /* Shoelace components ------------------------------------------------------ */

      .hamburger-btn::part(base) {
        color: var(--brand-color);
        font-size: 2em;
        padding-left: 0;
      }

      sl-drawer {
        color: var(--secondary-txt-color);
      }

      .app-drawer::part(panel) {
        background-color: var(--heading-color);
      }

      .app-drawer::part(close-button) {
        color: var(--menu-link-color);
      }

      .app-drawer::part(close-button__base) {
        transition: 0.2s;
      }

      .app-drawer::part(close-button__base):hover {
        color: var(--secondary-txt-color);
      }

      sl-avatar {
        --size: 2em;
      }

      sl-dropdown {
        margin-right: 5px;
      }

      /* Responsive - Mobile ------------------------------------------------------ */

      @media all and (max-width: 768px) {
        .app-header-top-nav {
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

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties)
        this.navActiveLinks()
    }

    navActiveLinks() {
        const currentPath = window.location.pathname
        const navLinks = this.shadowRoot.querySelectorAll('.app-drawer-menu-items a')
        navLinks.forEach(navLink => {
            if (navLink.href.slice(-1) === '#') return
            if (navLink.pathname === currentPath) {
                navLink.classList.add('active')
            }
        })
    }

    hamburgerClick() {
        const appMenu = this.shadowRoot.querySelector('.app-drawer')
        appMenu.show()
    }

    menuClick(e) {
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

                <sl-icon-button class="hamburger-btn" name="list" @click="${this.hamburgerClick}"></sl-icon-button>

                <a class="app-header-logo" title="Home" href="/" @click="${anchorRoute}">
                    <img src="/images/logo-primary-alternate.svg" alt="This is an image of the coffee on café logo.">
                </a>

                <nav class="app-header-top-nav">
                    <sl-dropdown>
                        <sl-menu>
                            <sl-menu-item @click="${() => gotoRoute('/profile')}">Profile</sl-menu-item>
                            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Edit Profile</sl-menu-item>
                            <sl-menu-item @click="${() => Auth.logout()}">Logout</sl-menu-item>
                        </sl-menu>
                        <a title="Profile" slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
                            <sl-avatar image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ''}></sl-avatar>
                            ${this.user && this.user.firstName}
                        </a>
                    </sl-dropdown>
                </nav>

            </header>

            <sl-drawer class="app-drawer" label="Welcome ${this.user.firstName}!" placement="start">
                <nav class="app-drawer-menu-items">
                    <ul>
                        <li><a title="Home" href="/" @click="${this.menuClick}">Home</a></li>
                        <li><a title="Profile" href="/profile" @click="${this.menuClick}">Profile</a></li>
                        <li><a title="Logout" href="#" @click="${() => Auth.logout()}">Logout</a></li>
                    </ul>
                </nav>
                <img slot="footer" class="align-self-start app-drawer-logo" src="/images/logo-white-alternate.svg" alt="This is an image of the coffee on café logo.">
            </sl-drawer>
        `;
    }
}

customElements.define('co-app-header', CoAppHeader);

