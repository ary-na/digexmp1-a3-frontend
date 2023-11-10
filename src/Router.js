// import views
import homeView from './views/pages/home'
import fourOFourView from './views/pages/404'
import loginView from './views/pages/login'
import registerView from './views/pages/register'
import profileView from './views/pages/profile'
import editProfileView from './views/pages/editProfile'
import guideView from './views/pages/guide'
import baristasView from './views/pages/baristas'
import favouritesView from './views/pages/favourites'
import mySpecialsView from './views/pages/mySpecials'
import drinksView from './views/pages/drinks'
import createSpecialView from './views/pages/createSpecial'
import editSpecialView from './views/pages/editSpecial'
import cartView from './views/pages/cart'
import ordersView from './views/pages/orders'

// define routes
const routes = {
    '/': homeView,
    '404': fourOFourView,
    '/login': loginView,
    '/register': registerView,
    '/profile': profileView,
    '/editProfile': editProfileView,
    '/baristas': baristasView,
    '/mySpecials': mySpecialsView,
    '/drinks': drinksView,
    '/favourites': favouritesView,
    '/guide': guideView,
    '/createSpecial': createSpecialView,
    '/editSpecial': editSpecialView,
    '/cart': cartView,
    '/orders': ordersView,
}

class Router {
    constructor() {
        this.routes = routes
    }

    init() {
        // initial call
        this.route(window.location.pathname)

        // on back/forward
        window.addEventListener('popstate', () => {
            this.route(window.location.pathname)
        })
    }

    route(fullPathname) {
        // extract path without params
        const pathname = fullPathname.split('?')[0]
        const route = this.routes[pathname]

        if (route) {
            // if route exists, run init() of the view
            this.routes[window.location.pathname].init()
        } else {
            // show 404 view instead
            this.routes['404'].init()
        }
    }

    gotoRoute(pathname) {
        window.history.pushState({}, pathname, window.location.origin + pathname);
        this.route(pathname)
    }
}

// create appRouter instance and export
const AppRouter = new Router()
export default AppRouter


// programmatically load any route
export function gotoRoute(pathname) {
    AppRouter.gotoRoute(pathname)
}


// allows anchor <a> links to load routes
export function anchorRoute(e) {
    e.preventDefault()
    const pathname = e.target.closest('a').pathname
    AppRouter.gotoRoute(pathname)
}