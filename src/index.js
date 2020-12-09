const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const util = require('util')
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/message")
const { addUser, getUser, removeUser, getUsersInRoom } = require("./utils/user")

// const hbs = require('hbs')
const app = express()

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT

const publicPathDir = path.join(__dirname, "../public")
    // const viewsPath = path.join(__dirname, "../templates/views")
    // const partialsPath = path.join(__dirname, "../templates/partials")


// app.set('view engine', 'hbs')
// app.set('views', viewsPath)
// hbs.registerPartials(partialsPath)

app.use(express.static(publicPathDir))


// app.use((req, res, next) => {
//     res.status(503).send("Server is in maintanace")
// })

// app.use(express.json())

io.on('connection', (socket) => {
    console.log("New Connection Socket")



    socket.on("join", ({ username, roomname }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, roomname })

        if (error) {
            return callback(error)
        }

        socket.join(user.roomName)
        console.log(user.roomName)
        console.log(getUsersInRoom(user.roomName))
        io.to(user.roomName).emit("roomdata", {
            room: user.roomName,
            users: getUsersInRoom(user.roomName)
        })
        socket.emit("displayMessage", generateMessage("Welcome !", "Admin"))
        socket.broadcast.to(user.roomName).emit("displayMessage", generateMessage(`${user.userName} has joined !`, "Admin"))

        callback()

    })

    socket.on("message", (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback("Bad words not allowed !")
        }

        io.to(user.roomName).emit("displayMessage", generateMessage(message, user.userName))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.roomName).emit("userLocation", generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`, user.userName))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            console.log(user.roomName)
            console.log(getUsersInRoom(user.roomName))
            io.to(user.roomName).emit("displayMessage", generateMessage(`${user.userName} has left`, "Admin"))
            io.to(user.roomName).emit("roomdata", {
                room: user.roomName,
                users: getUsersInRoom(user.roomName)
            })
        }
    })
})

// app.get('/index', (req, res) => {
//     res.render('index', {
//         title: 'Chat App'
//     })
// })

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})