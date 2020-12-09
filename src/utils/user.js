const users = []

const addUser = ({ id, username, roomname }) => {
    console.log(id, username, roomname)
    userName = username.trim().toLowerCase()
    roomName = roomname.trim().toLowerCase()

    if (!username || !roomName) {
        return {
            error: "Username and room are required"
        }
    }

    const existingUser = users.find((user) => {
        return user.userName === userName && user.roomName === roomName
    })

    if (existingUser) {
        return {
            error: "Username is in use!"
        }
    }

    const user = { id, userName, roomName }
    users.push(user)
    return { user }
}

const getUser = (id) => {
    console.log(id)
    return users.find((user) => user.id === id)

    // if (index !== -1) {
    //     return undefined
    // }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUsersInRoom = (room) => {
    const roomName = room.trim().toLowerCase()
    return users.filter((user) => user.roomName === roomName)
        // const roomUsers = []
        // users.find((user) => {
        //     if (user.room === room) {
        //         roomUsers.push(user)
        //     }
        // })

    // return roomUsers
}


module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInRoom
}