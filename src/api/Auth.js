import App from '../App'
import Router, {gotoRoute} from '../Router'
import splash from '../views/partials/splash'
import {html, render} from 'lit'
import Toast from '../Toast'

class Auth {
    constructor() {
        this.currentUser = {}
    }

    async register(userData, fail = false) {
        const response = await fetch(`${App.apiBase}/user`, {
            method: 'POST',
            body: userData
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // show error
            Toast.show(`Problem getting user: ${response.status}`)
            // run fail() functon if set
            if (typeof fail == 'function') fail()
        }
        /// sign up success - show toast and redirect to sign in page
        Toast.show('Account created, please login!')
        // redirect to log in
        gotoRoute('/login')
    }

    async login(userData, fail = false) {
        const response = await fetch(`${App.apiBase}/auth/login`, {
            method: 'POST',
            body: userData
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // show error
            Toast.show(`Problem signing in: ${err.message}`, 'error')
            // run fail() functon if set
            if (typeof fail == 'function') fail()
        }

        // sign in success
        const data = await response.json()
        Toast.show(`Welcome  ${data.user.firstName}`)
        // save access token (jwt) to local storage
        if (!localStorage.getItem('accessToken'))
            localStorage.setItem('accessToken', data.accessToken)
        // set current user
        this.currentUser = data.user
        // console.log(this.currentUser)
        // redirect to home
        Router.init()

        // Redirect new user to guide page.
        if (this.currentUser.newUser) {
            gotoRoute('/guide')
        } else {
            gotoRoute('/')
        }
    }


    async check(success) {
        // show splash screen while loading ...
        render(splash, App.rootEl)

        // check local token is there
        if (!localStorage.accessToken) {
            // no local token!
            Toast.show("Please login!")
            // redirect to sign in page
            gotoRoute('/login')
            return
        }

        // token must exist - validate token via the backend
        const response = await fetch(`${App.apiBase}/auth/validate`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.accessToken}`
            }
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // delete local token
            localStorage.removeItem('accessToken')
            Toast.show("session expired, please login!")
            // redirect to sign in
            gotoRoute('/login')
            return
        }

        // token is valid!
        const data = await response.json()
        // console.log(data)
        // set currentUser obj
        this.currentUser = data.user
        // run success
        success()
    }

    logout() {
        Toast.show("You are logged out!")
        // delete local token
        localStorage.removeItem('accessToken')
        // redirect to log in
        gotoRoute('/login')
        // unset currentUser
        this.currentUser = null
    }
}

export default new Auth()