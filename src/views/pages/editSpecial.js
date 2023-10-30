import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Toast from "../../Toast";
import Drink from "../../api/Drink";
class EditSpecialView {
    async init() {
        document.title = `${App.name} - Edit my special`
        this.specialId = localStorage.getItem('specialId')
        this.special = null
        await this.getMySpecial(this.specialId)
        this.render()
        Utils.pageIntroAnim()
        await this.retrieveCheckboxCheckedValue()
    }

    async getMySpecial(id) {
        try {
            this.special = await Drink.getDrink(id)
        } catch (err) {
            Toast.show(err, 'error')
        }
    }

    async retrieveCheckboxCheckedValue() {
        const checkboxEl = await document.querySelector('sl-checkbox')
        if(this.special.decaf)
            checkboxEl.checked = true
    }

    async editSpecialSubmitHandler(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.setAttribute('loading', '')
        try {
            await Drink.updateSpecial(this.specialId, formData)
            Toast.show('Special updated!')
        }catch(err){
            Toast.show(err, 'error')
        }
        submitBtn.removeAttribute('loading')
        await this.getMySpecial(this.specialId)
        this.render()
    }

    render() {
        const template = html`
            <co-app-header user="${JSON.stringify(Auth.currentUser)}"></co-app-header>
            <div class="row my-4 justify-content-center">

                <div class="col-xs-12 col-sm-10">
                    <h1>Edit special</h1>
                    <p class="small text-muted mb-4">Edit your specials and make sure you keep them up to date.</p>

                    <form class="row gy-3 mt-0" @submit=${this.editSpecialSubmitHandler.bind(this)}>
                        <sl-input class="col-12" name="name" type="text" label="Drink name"
                                  placeholder="Enter drink name..." value="${this.special.name}" required></sl-input>

                        <sl-textarea name="description" label="Description"
                                     placeholder="Enter a detailed description of the drink..."
                                     value="${this.special.description}" required></sl-textarea>

                        <sl-select class="col-md-8" name="brewMethod" label="Brew method"
                                   placeholder="Select a brew method..." value="${this.special.brewMethod}" required>
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

                        <sl-input class="col-md-4" name="price" type="text" label="Price" value="${this.special.price}"
                                  placeholder="Enter price..."
                                  required>
                            <sl-icon class="ps-2" name="currency-dollar" slot="prefix"></sl-icon>
                        </sl-input>

                        <sl-radio-group label="Drink type" name="drinkType" value="${this.special.drinkType}" required>
                            <sl-radio class="d-inline me-2" value="Hot">Hot</sl-radio>
                            <sl-radio class="d-inline" value="Ice">Ice</sl-radio>
                        </sl-radio-group>

                        <div class="col-2 col-lg-1 d-flex justify-content-start align-items-end">
                            <img class="edit-image" src="${App.apiBase}/images/${this.special.image}" alt="This is an image of the special drink."/>
                        </div>
                        <div class="col-10 col-lg-11">
                            <label for="formFile" class="form-label">Upload an image</label>
                            <input class="form-control" name="image" type="file" id="formFile">
                        </div>

                        <sl-checkbox name="decaf" value="${true}">Decaf</sl-checkbox>

                        <sl-button class="ms-auto col-md-2" @click="${() => gotoRoute('/mySpecials')}">Back</sl-button>
                        <sl-button class="col-md-2 submit-btn" type="submit" variant="primary">Edit</sl-button>
                    </form>
                </div>
            </div>
        `
        render(template, App.rootEl)
    }
}

export default new EditSpecialView()