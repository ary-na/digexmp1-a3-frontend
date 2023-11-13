import App from "../App";

class Order {
    async createOrder(formData) {
        // send fetch request
        const response = await fetch(`${App.apiBase}/order`, {
            method: 'POST',
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`},
            body: formData
        })

        // if response not ok
        if (!response.ok) {
            let message = 'Problem creating order!'
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

    async getOrders(userId) {
        // validate
        if (!userId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/order/customer/${userId}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting orders!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async getLastOrder(userId) {
        // validate
        if (!userId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/order/last/${userId}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting order!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async getMyLastOrder(userId){
        // validate
        if (!userId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/order/myLast/${userId}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting my order!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async getOrderCount(userId) {
        // validate
        if (!userId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/order/count/${userId}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting order count!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async getMyOrders(userId) {
        // validate
        if (!userId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/order/barista/${userId}`, {
            method: "GET",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting orders!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }

    async changeOrderReadyStatus(orderId, ready = true) {
        // validate
        if (!orderId) return

        // fetch the json data
        const response = await fetch(`${App.apiBase}/order/status`, {
            method: "PUT",
            headers: {"Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
            body: JSON.stringify({orderId: orderId, ready: ready})
        })


        // if response not ok
        if (!response.ok) {
            // console log error
            const err = await response.json()
            if (err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem changing order ready status!')
        }

        // convert response payload into json - store as data
        // return data
        return await response.json()
    }
}

export default new Order()