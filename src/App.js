import Router from './Router'
import Auth from './api/Auth'
import Toast from './Toast'


class App {
    constructor() {
        this.name = "coffee on"
        this.version = "1.0.0"
        this.apiBase = 'https://anyamchelo-coffeeon-backend-b2n2v.ondigitalocean.app'
        this.rootEl = document.getElementById("root")
        this.version = "1.0.0"
    }

    init() {
        console.log("App.init")

        // Toast init
        Toast.init()

        // Authentication check
        Auth.check(() => {
            // authenticated! init Router
            Router.init()
        })
    }
}

export default new App()