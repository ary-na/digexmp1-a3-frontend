import App from './../../App'
import {html, render} from 'lit'
import {gotoRoute} from "../../Router";

class FourOFourView {
    init() {
        console.log('FourOFourView.init')
        document.title = `Page not found - ${App.name}`
        this.render()
    }

    render() {
        const template = html`
            <div class="row h-100 justify-content-center">
                <div class="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white shadow-sm rounded-1 my-auto p-5">
                    <img class="logo-size d-block mx-auto mb-5" src="/images/logo-primary.svg" alt="This is an image of the coffee on café logo.">
                    <h1>Ops</h1>
                    <p class="small text-muted mb-5">Page not found!</p>
                    <sl-button @click=${() => gotoRoute('/')} class="col-12" variant="primary">Go home</sl-button>
                </div>
            </div>
        `
        render(template, App.rootEl)
    }
}

export default new FourOFourView()