import App from './../../App'
import {html, render} from 'lit-html'
import {gotoRoute, anchorRoute} from '../../Router'
import Auth from '../../api/Auth'
import Utils from './../../Utils'
import Special from "../../api/Special";
import Toast from "../../Toast";

class createSpecial {
    init() {
        document.title = 'Create Special'

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
            <div class="row app-header-margin">

                <sl-form class="form-signup" @sl-submit=${this.createSpecialHandler}>
                    <input type="hidden" name="user" value="${Auth.currentUser._id}"/>
                    <div class="input-group">
                        <sl-input name="name" type="text" placeholder="Haircut Name" required></sl-input>
                    </div>
                    <div class="input-group">
                        <sl-input name="price" type="text" placeholder="Price" required>
                            <span slot="prefix">$</span>
                        </sl-input>
                    </div>
                    <div class="input-group">
                        <sl-textarea name="description" rows="3" placeholder="Description"></sl-textarea>
                    </div>
                    <div class="input-group" style="margin-bottom: 2em;">
                        <label>Image</label><br>
                        <input type="file" name="image"/>
                    </div>
                    <div class="input-group" style="margin-bottom: 2em;">
                        <label>Gender</label><br>
                        <sl-radio-group label="Select gender" no-fieldset>
                            <sl-radio name="gender" value="m">Male</sl-radio>
                            <sl-radio name="gender" value="f">Female</sl-radio>
                            <sl-radio name="gender" value="u">Unisex</sl-radio>
                        </sl-radio-group>
                    </div>
                    <div class="input-group" style="margin-bottom: 2em;">
                        <label>Length</label><br>
                        <sl-radio-group label="Select length" no-fieldset>
                            <sl-radio name="length" value="s">Short</sl-radio>
                            <sl-radio name="length" value="m">Medium</sl-radio>
                            <sl-radio name="length" value="l">Long</sl-radio>
                        </sl-radio-group>
                    </div>
                    <sl-button type="primary" class="submit-btn" submit>Add Haircut</sl-button>
                </sl-form>


            </div>
        `
        render(template, App.rootEl)
    }
}


export default new createSpecial()