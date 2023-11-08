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
}

export default new Order()