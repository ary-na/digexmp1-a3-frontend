import App from '../App'

class Special {
    async getSpecials(){

        // fetch the json data
        const response = await fetch(`${App.apiBase}/special`, {
            headers: { "Authorization": `Bearer ${localStorage.accessToken}`}
        })

        // if response not ok
        if(!response.ok){
            // console log error
            const err = await response.json()
            if(err) console.log(err)
            // throw error (exit this function)
            throw new Error('Problem getting specials!')
        }
        // convert response payload into json - return data
        return await response.json()
    }

    async createSpecial(formData){
        // send fetch request
        const response = await fetch(`${App.apiBase}/special`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${localStorage.accessToken}`},
            body: formData
        })

        // if response not ok
        if(!response.ok){
            let message = 'Problem adding special!'
            if(response.status === 400){
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

export default new Special()