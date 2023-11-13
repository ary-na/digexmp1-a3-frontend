import App from '../App'

class User {
    async updateUser(userId, userData, dataType = 'form') {
        // validate
        if (!userId || !userData) return

        let responseHeader

        // form data
        if (dataType === 'form') {
            // fetch response header normal (form data)
            responseHeader = {
                method: "PUT",
                headers: {"Authorization": `Bearer ${localStorage.accessToken}`},
                body: userData
            }

            // json data
        } else if (dataType === 'json') {
            responseHeader = {
                method: "PUT",
                headers: {"Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": "application/json"},
                body: JSON.stringify(userData)
            }
        }

        // make fetch request to backend
        const response = await fetch(`${App.apiBase}/user/${userId}`, responseHeader)

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem updating user')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async getUser(userId) {
        // validate
        if (!userId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/user/${userId}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting user!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async getUsersByAccess(accessLevel = 2) {

        // Fetch baristas from the db
        const response = await fetch(`${App.apiBase}/user/access/${accessLevel}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        if (!response.ok) {
            const err = await response.json()
            if (err) console.log(err)
            throw new Error('Problem getting users!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }


    async addFavouriteDrink(drinkId) {
        // validate
        if (!drinkId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/user/add/favouriteDrink`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
            body: JSON.stringify({drinkId: drinkId})
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem adding drink to favourites!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()

    }

    async removeFavouriteDrink(drinkId) {
        // validate
        if (!drinkId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/user/remove/favouriteDrink`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
            body: JSON.stringify({drinkId: drinkId})
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem removing drink from favourites!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()

    }

    async addFavouriteBarista(userId) {
        // validate
        if (!userId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/user/add/favouriteBarista`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
            body: JSON.stringify({userId: userId})
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem adding barista to favourites!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()

    }

    async removeFavouriteBarista(userId) {
        // validate
        if (!userId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/user/remove/favouriteBarista`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
            body: JSON.stringify({userId: userId})
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem removing barista from favourites!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()

    }

    async addToCart(drinkId) {
        // validate
        if (!drinkId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/user/add/cart`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
            body: JSON.stringify({drinkId: drinkId})
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem adding drink to shopping cart!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()

    }

    async removeFromCart(drinkId) {
        // validate
        if (!drinkId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/user/remove/cart`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
            body: JSON.stringify({drinkId: drinkId})
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem removing drink from shopping cart!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()

    }

    async removeAllFromCart() {
        // fetch the json data
        const response = await fetch(`${App.apiBase}/user/removeAll/cart`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem removing all from shopping cart!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }
}

export default new User()