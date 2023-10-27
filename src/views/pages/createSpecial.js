import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Special from "../../api/Special";
import Toast from "../../Toast";

class createSpecial {
    init() {
        document.title = `${App.name} - Create special`

        if(Auth.currentUser.accessLevel === 2)
            this.render()
        else
            gotoRoute('/')

        Utils.pageIntroAnim()
    }

    async createSpecialHandler(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.setAttribute('loading', '')

        try {
            await Special.createSpecial(formData)
            Toast.show("Special added!")
            // Reset form
            const inputs = document.querySelectorAll("sl-input, sl-textarea, input[type=file]")
            if(inputs)
                inputs.forEach(input => inputs.value = null)

            const radioInputs = document.querySelectorAll("sl-radio")
            if(radioInputs)
                radioInputs.forEach(radioInput => radioInput.removeAttribute("checked"))

        } catch (err) {
            Toast.show(err, 'error');
        }
        submitBtn.removeAttribute('loading')
    }

    render() {
        const template = html`
            <co-app-header title="Create Special" user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row pt-5 app-header-padding justify-content-center">

                <form class="col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 bg-white shadow-sm rounded-1 my-auto p-5 row g-3" @submit=${this.createSpecialHandler}>
                    <input name="user" type="hidden" value="${Auth.currentUser._id}"/>
                    <sl-input class="col-12" name="name" type="text" label="Drink name"
                              placeholder="Enter drink name..." required></sl-input>

                    <sl-textarea name="description" label="Description"
                                 placeholder="Enter a detailed description of the drink..." required></sl-textarea>


                    <sl-select class="col-md-7" name="brewMethod" label="Brew method" placeholder="Select a brew method..." required>
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

                    <sl-input class="col-md-5" name="price" type="text" label="Price" placeholder="Enter price..." required>
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

                    <sl-button class="submit-btn" type="submit" variant="primary">Create special</sl-button>
                </form>


            </div>
        `
        render(template, App.rootEl)
    }
}


export default new createSpecial()