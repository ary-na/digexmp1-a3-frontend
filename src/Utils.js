import gsap from 'gsap'
import User from "./api/User";
import Auth from "./api/Auth";
import Toast from "./Toast";

class Utils {

    isMobile() {
        let viewportWidth = window.innerWidth
        return viewportWidth <= 768;
    }

    pageIntroAnim() {
        const pageContent = document.querySelector('#root')
        if (!pageContent) return
        gsap.fromTo(pageContent, {opacity: 0, y: -12}, {opacity: 1, y: 0, ease: 'power2.out', duration: 0.5})
    }

    async getCartItemCount() {
        try {
            const user = await User.getUser(Auth.currentUser._id)
            if (!user.cart)
                return 0
            else
                return user.cart.length
        } catch (err) {
            Toast.show(err, 'error')
        }
    }
}

export default new Utils()