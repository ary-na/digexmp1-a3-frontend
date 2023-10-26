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
            throw new Error('Problem getting haircuts')
        }
        // convert response payload into json - return data
        return await response.json()
    }
}

export default new Special()