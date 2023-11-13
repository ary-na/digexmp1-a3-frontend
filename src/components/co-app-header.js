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
        padding: var(--sl-spacing-x-small) 0;
        background-color: var(--body-bg);
        border-bottom: var(--link-color) 1px solid;
        display: flex;
        gap: var(--sl-spacing-medium);
        align-items: center;
        z-index: var(--sl-z-index-dropdown);
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

      /* App drawer styles -------------------------------------------------------- */

      .app-drawer-menu-items ul {
        list-style: none;
      }

      .app-drawer-menu-items a {
        display: block;
        text-decoration: none;
        font-size: var(--sl-font-size-large);
        color: var(--menu-link-color);
        margin-bottom: var(--sl-spacing-small);
        transition: 0.2s;
      }

      .app-drawer-menu-items a:hover {
        color: var(--secondary-txt-color);
      }

      .app-drawer-menu-items a.active {
        font-weight: bold;
        color: var(--secondary-txt-color);
        border-bottom: 1px solid var(--secondary-txt-color);
        margin-right: var(--sl-spacing-x-small);
        padding-bottom: var(--sl-spacing-2x-small);
      }

      .app-drawer-logo {
        width: 150px;
      }

      /* Shoelace components ------------------------------------------------------ */

      .hamburger-btn::part(base) {
        color: var(--brand-color);
        font-size: 2em;
        padding-left: 0;
        padding-right: 0;
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

      .avatar::part(image) {
        border: 1px var(--brand-color) solid;
      }

      sl-dropdown {
        margin-right: 6px;
      }
    `

    static properties = {
        user: {type: Object},
        cartItemCount: {type: Number},
    }

    constructor() {
        super()
    }

    async firstUpdated(_changedProperties) {
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

                ${this.user.accessLevel === 1 ? html`
                            <sl-button variant="default" size="small" @click="${() => gotoRoute('/cart')}" circle>
                                <sl-icon name="cart2" title="Shopping cart" label="Shopping cart"></sl-icon>
                                <sl-badge pill>${this.cartItemCount}</sl-badge>
                            </sl-button>` : html``}

                <nav class="app-header-top-nav">
                    <sl-dropdown>
                        <sl-menu>
                            ${this.user.accessLevel === 1 ? html`
                                <sl-menu-item @click="${() => gotoRoute('/orders')}">Orders</sl-menu-item>` : html``}
                            <sl-menu-item @click="${() => gotoRoute('/profile')}">Profile</sl-menu-item>
                            <sl-menu-item @click="${() => gotoRoute('/editProfile')}">Edit Profile</sl-menu-item>
                            <sl-menu-item @click="${() => Auth.logout()}">Logout</sl-menu-item>
                        </sl-menu>
                        <a title="Profile" slot="trigger" href="#" @click="${(e) => e.preventDefault()}">
                            <sl-avatar class="avatar" image=${(this.user && this.user.avatar) ? `${App.apiBase}/images/${this.user.avatar}` : ''}></sl-avatar>
                            ${this.user && this.user.firstName}
                        </a>
                    </sl-dropdown>
                </nav>

            </header>

            <sl-drawer class="app-drawer" label="Welcome ${this.user.firstName}!" placement="start">
                <nav class="app-drawer-menu-items">
                    <ul>
                        <li><a title="Home" href="/" @click="${this.menuClick}">Home</a></li>
                        ${this.user.accessLevel === 2 ? html`
                            <li><a title="My specials" href="/mySpecials" @click="${this.menuClick}">My specials</a></li>
                            <li><a title="My orders" href="/myOrders" @click="${this.menuClick}">My orders</a>` : html`
                            <li><a title="Favourites" href="/favourites" @click="${this.menuClick}">Favourites</a>
                            <li><a title="Baristas" href="/baristas" @click="${this.menuClick}">Baristas</a>
                            <li><a title="Specials" href="/drinks" @click="${this.menuClick}">Drinks</a>
                            <li><a title="Orders" href="/orders" @click="${this.menuClick}">Orders</a>
                        `}
                        <li><a title="Profile" href="/profile" @click="${this.menuClick}">Profile</a></li>
                        <li><a title="Logout" href="#" @click="${() => Auth.logout()}">Logout</a></li>
                    </ul>
                </nav>
                <img slot="footer" class="align-self-start app-drawer-logo" src="/images/logo-white-alternate.svg" alt="This is an image of the coffee on café logo.">
            </sl-drawer>
        `
    }
}

customElements.define('co-app-header', CoAppHeader);

