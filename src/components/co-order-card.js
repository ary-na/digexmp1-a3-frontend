import {LitElement, render, html, css} from 'lit'
import moment from "moment";
import Auth from "../api/Auth";
import Toast from "../Toast";
import Order from "../api/Order";

export class CoOrderCard extends LitElement {
    static styles = css`
      sl-card {
        width: 100%;
      }

      .card-header, .card-body, .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--sl-spacing-large);
        font-size: var(--sl-font-size-small);
      }

      .card-header span {
        color: var(--link-color);
        font-weight: bold;
      }

      .instructions p {
        margin-top: 0;
      }

      .instructions h3 {
        margin-bottom: 0;
      }

      .table {
        display: grid;
        grid-template-columns: auto 4fr auto auto;
        width: 100%;
        margin: var(--sl-spacing-large) 0;
        gap: var(--sl-spacing-small);
      }

      .thead {
        font-weight: bold;
        border-bottom: solid 1px var(--link-color);
      }
    `

    static properties = {
        id: {type: String},
        date: {type: String},
        ready: {type: String},
        instructions: {type: String},
        barista: {type: Object},
        user: {type: Object},
        drinks: {type: Array},
        total: {type: String},
        itemCountUserView: {type: Number},
        itemCountBaristaView: {type: Number},
    }

    constructor() {
        super()
        this.itemCountUserView = 1;
        this.itemCountBaristaView = 1;
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties)
    }

    async viewDetailsHandler(e) {
        this.itemCountUserView = 1;
        this.itemCountBaristaView = 1;
        e.preventDefault()
        const dialogEl = document.createElement('sl-dialog');
        dialogEl.setAttribute('label', `${this.user.firstName} ${this.user.lastName}'s order`)
        dialogEl.className = "dialog-scrolling"
        const dialogContent = html`
            <div class="row justify-content-center">
                ${this.drinks.map(drink => html`
                    <div class="row pe-0 ps-0 col-12 mb-4 border-bottom">
                        <h4><span class="small">${this.itemCountBaristaView++}.</span> ${drink._id.name}</h4>
                        <sl-badge class="pe-0 mb-2 col-auto" pill>${drink._id.type}</sl-badge>
                        <sl-badge class="ps-1 pe-1 mb-2 col-auto" pill>${drink._id.brewMethod.replaceAll('_', ' ')}
                        </sl-badge>
                        ${drink._id.decaf ? html`<sl-badge class="ps-0 pe-0 mb-2 col-auto" pill>Decaf</sl-badge>` : html``}
                        <p><span class="small text-muted">Description: </span> ${drink._id.description}</p>
                    </div>
                `)}
                ${this.instructions ? html`<p class="small">Instructions: <span class="fw-light">${this.instructions}</span></p>` : html``}
            </div>
            ${this.ready === 'false'
                    ? html`<sl-button slot="footer" class="markAsReadyBtn" variant="primary">Mark as Ready</sl-button>`
                    : html`<sl-button slot="footer" class="markAsPreparingBtn" variant="primary">Mark as Preparing</sl-button>`}`

        render(dialogContent, dialogEl)

        await document.body.append(dialogEl)
        dialogEl.show()


        const markAsReadyBtn = dialogEl.querySelector('.markAsReadyBtn')

        if (markAsReadyBtn) {
            markAsReadyBtn.addEventListener('click', async () => {
                dialogEl.hide()
                try {
                    await Order.changeOrderReadyStatus(this.id)
                    this.ready = "true"
                } catch (err) {
                    Toast.show(err, 'error')
                }
            })
        }

        const markAsPreparingBtn = dialogEl.querySelector('.markAsPreparingBtn')
        if (markAsPreparingBtn) {
            markAsPreparingBtn.addEventListener('click', async () => {
                dialogEl.hide()
                try {
                    await Order.changeOrderReadyStatus(this.id, false)
                    this.ready = "false"
                } catch (err) {
                    Toast.show(err, 'error')
                }
            })
        }

        // Delete dialog after hide.
        dialogEl.addEventListener('sl-after-hide', () => {
            dialogEl.remove()
        })
    }

    render() {
        return html`
            <sl-card class="card-basic">
                <div class="card-header">
                    <p>Ordered: ${moment(this.date).format('MMMM Do YYYY, @ h:mm a')}</p>
                    <p>Status: ${this.ready === "false" ? html`<span>Preparing</span>` : html`<span>Ready for pickup</span>`}</p>
                </div>

                <div class="card-body">
                    ${Auth.currentUser.accessLevel === 1
                            ? html`<h2>Barista: <span>${this.barista.firstName} ${this.barista.lastName}</span></h2>`
                            : html`<h2>Customer: <span>${this.user.firstName} ${this.user.lastName}</span></h2>`}
                    ${Auth.currentUser.accessLevel === 2 ? html`<sl-button @click="${this.viewDetailsHandler.bind(this)}">View details</sl-button>` : html``}
                </div>

                <div class="table">
                    <div class="thead">No.</div>
                    <div class="thead">Items</div>
                    <div class="thead">Quantity</div>
                    <div class="thead">Price</div>

                    ${this.drinks.map(drink => html`
                        <div>${this.itemCountUserView++}.</div>
                        <div>${drink._id.name}</div>
                        <div>${drink.quantity}</div>
                        <div>$${drink._id.price}.00</div>`)}
                </div>

                ${this.instructions !== "" ? html`
                    <div class="instructions">
                        <h3>Instructions</h3>
                        <p>${this.instructions}</p>
                    </div>` : html``}

                <div class="card-footer">
                    <h3>Total:</h3>
                    <h3>$${this.total}.00<span>
                </div>
            </sl-card>
        `
    }
}

customElements.define('co-order-card', CoOrderCard)

