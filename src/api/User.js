import App from '../App'

class User {

  async updateUser(userId, userData, dataType = 'form'){
    // validate
    if(!userId || !userData) return

    let responseHeader

    // form data
    if(dataType === 'form'){
      // fetch response header normal (form data)
      responseHeader = {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.accessToken}`},
        body: userData
      }

      // json data
    }else if(dataType === 'json'){
      responseHeader = {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type" : "application/json"},
        body: JSON.stringify(userData)
      }
    }

    // make fetch request to backend
    const response = await fetch(`${App.apiBase}/user/${userId}`, responseHeader)

    // if response not ok
    if(!response.ok){
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // throw error (exit this function)
      throw new Error('Problem updating user')
    }

    // convert response payload into json - store as data
    const data = await response.json()

    // return data
    return data
  }

  async getUser(userId){
    // validate
    if(!userId) return

    // fetch the json data
    const response = await fetch(`${App.apiBase}/user/${userId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${localStorage.accessToken}`}
    })

    // if response not ok
    if(!response.ok){
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // throw error (exit this function)
      throw new Error('Problem getting user')
    }

    // convert response payload into json - store as data
    const data = await response.json()

    // return data
    return data
  }

  async addFavSpecial(specialId){
    // validate
    if(!specialId) return

    // fetch the json data
    const response = await fetch(`${App.apiBase}/user/addFavSpecial`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${localStorage.accessToken}`, "Content-Type": 'application/json'},
      body: JSON.stringify({specialId: specialId})
    })

    // if response not ok
    if(!response.ok){
      // console log error
      const err = await response.json()
      if(err) console.log(err)
      // throw error (exit this function)
      throw new Error('Problem adding special to favourites')
    }

    // convert response payload into json - store as data
    // return data
    return await response.json()

  }
}

export default new User()