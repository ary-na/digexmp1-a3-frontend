import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import Drink from "../../api/Drink";

class createSpecial {
    init() {
        if (Auth.currentUser.accessLevel === 1)
            gotoRoute('/404')
        else {
            document.title = `${App.name} - Create special`
            this.render()
            Utils.pageIntroAnim()
        }
    }

    async createSpecialHandler(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.setAttribute('loading', '')

        try {
            await Drink.createSpecial(formData)
            Toast.show("Special added!")

            // Reset form
            const inputs = document.querySelectorAll("sl-input, sl-textarea, input[type=file], sl-select, sl-radio-group")
            if (inputs)
                inputs.forEach(input => input.value = null)

            const checkbox = document.querySelector("sl-checkbox")
            if (checkbox)
                checkbox.removeAttribute("checked")

        } catch (err) {
            Toast.show(err, 'error');
        }
        submitBtn.removeAttribute('loading')
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row my-4 justify-content-center">

                <div class="col-xs-12 col-sm-10">
                    <h1>Create special</h1>
                    <p class="small text-muted mb-4">Create a special coffee drink for customers to showcase your
                        expertise and earn a 50% commission on top of your wage for selling your drinks.</p>

                    <form class="row gy-3 mt-0" @submit=${this.createSpecialHandler}>
                        <input name="user" type="hidden" value="${Auth.currentUser._id}"/>
                        <sl-input class="col-12" name="name" type="text" label="Drink name"
                                  placeholder="Enter drink name..." required></sl-input>

                        <sl-textarea name="description" label="Description"
                                     placeholder="Enter a detailed description of the drink..." required></sl-textarea>

                        <sl-select class="col-md-8" name="brewMethod" label="Brew method"
                                   placeholder="Select a brew method..." required>
                            <sl-option value="Aeropress_(pressure)">Aeropress (pressure)</sl-option>
                            <sl-option value="Auto_drip_(drip)">Auto drip (drip)</sl-option>
                            <sl-option value="Chemex_(drip)">Chemex (drip)</sl-option>
                            <sl-option value="Clever_dripper_(drip)">Clever dripper (drip)</sl-option>
                            <sl-option value="Cold_brew_(steep)">Cold brew (steep)</sl-option>
                            <sl-option value="Espresso_machine_(pressure)">Espresso machine (pressure)</sl-option>
                            <sl-option value="French_press_(steep)">French press (steep)</sl-option>
                            <sl-option value="Moka_pot_(pressure)">Moka pot (pressure)</sl-option>
                            <sl-option value="Siphon_(pressure)">Siphon (pressure)</sl-option>
                        </sl-select>

                        <sl-input class="col-md-4" name="price" type="text" label="Price" placeholder="Enter price..."
                                  required>
                            <sl-icon class="ps-2" name="currency-dollar" slot="prefix"></sl-icon>
                        </sl-input>

                        <sl-radio-group label="Drink type" name="drinkType" required>
                            <sl-radio class="d-inline me-2" value="Hot">Hot</sl-radio>
                            <sl-radio class="d-inline" value="Ice">Ice</sl-radio>
                        </sl-radio-group>

                        <div>
                            <label for="formFile" class="form-label">Upload an image</label>
                            <input class="form-control" name="image" type="file" id="formFile" required>
                        </div>

                        <sl-checkbox name="decaf" value="${true}">Decaf</sl-checkbox>

                        <sl-button class="ms-auto col-md-2" @click="${() => gotoRoute('/mySpecials')}">Back</sl-button>
                        <sl-button class="col-md-2 submit-btn" type="submit" variant="primary">Create</sl-button>
                    </form>
                </div>
            </div>
        `
        render(template, App.rootEl)
    }
}


export default new createSpecial()