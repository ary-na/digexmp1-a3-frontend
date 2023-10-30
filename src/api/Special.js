import App from '../App'

class Special {
    async getSpecial(specialId) {
        // validate
        if (!specialId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/special/${specialId}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting special!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async getSpecials() {

        // fetch the json data
        const response = await fetch(`${App.apiBase}/special`, {
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting specials!')
        }
        // convert response payload into json - return data
        return await response.json()
    }

    async getMySpecials(userId) {
        // fetch the json data
        const response = await fetch(`${App.apiBase}/special/by/${userId}`, {
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting my specials!')
        }
        // convert response payload into json - return data
        return await response.json()
    }

    async createSpecial(formData) {
        // send fetch request
        const response = await fetch(`${App.apiBase}/special`, {
            method: 'POST',
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`},
            body: formData
        })

        // if response not ok
        if (!response.ok) {
            let message = 'Problem adding special!'
            if (response.status === 400) {
                const err = await response.json()
                message = err.message
            }
            // throw error (exit this function)
            throw new Error(message)
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async updateSpecial(specialId, formData) {
        // validate
        if (!specialId || !formData) return

        // make fetch request to backend
        const response = await fetch(`${App.apiBase}/special/${specialId}`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`},
            body: formData
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem updating special!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async removeSpecial(specialId) {
        // fetch the json data
        const response = await fetch(`${App.apiBase}/special/${specialId}`, {
            method: 'DELETE',
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting my specials!')
        }
        // convert response payload into json - return data
        return await response.json()
    }
}

export default new Special()