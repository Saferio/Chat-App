$("document").ready(() => {
    const socket = io()

    const { username, roomname } = Qs.parse(location.search, { ignoreQueryPrefix: true })
        // console.log(username, roomname)

    // socket.on("greet", (greeting) => {
    //     console.log(greeting)
    // })

    const autoScroll = () => {

        $("#messages").animate({ scrollTop: $(document).height() }, 1000);
    }

    $("#sendMessage").click((e) => {
        e.preventDefault();
        const message = $("#getMessage").val()
        if (message == "") {
            return false
        }
        socket.emit("message", message, (error) => {
            if (error) {
                return console.log(error)
            }
            console.log("Message successfully delivered.")
        })
        $("#getMessage").val("")

    })

    socket.on("displayMessage", (message) => {
        console.log("In display Message")
        console.log(message)
        var html = Mustache.render($("#message-template").html(), {
            message: message.text,
            username: message.username,
            createdAt: moment(message.createdAt).format("h:mm a")
        })
        $("#messages").append(html)
        autoScroll()
    })

    socket.on("userLocation", (location) => {
        var html = Mustache.render($("#location-message-template").html(), {
            location: location.url,
            username: location.username,
            createdAt: moment(location.createdAt).format("h:mm a")
        })
        $("#messages").append(html)

        autoScroll()
    })

    $("#send-location").click((e) => {
        $('#send-location').prop('disabled', true);
        if (!navigator.geolocation) {
            $('#send-location').prop('disabled', false);
            return alert("Geolocation is not supported bu your browser.")

        }

        navigator.geolocation.getCurrentPosition((position) => {
            var location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            socket.emit("sendLocation", location, () => {
                    console.log("Location Shared")
                    $('#send-location').prop('disabled', false);
                })
                // console.log(location)
        })

    })

    // console.log(username)
    socket.emit("join", { username, roomname }, (error) => {
        if (error) {
            alert(error)
            location.href = "/"
        }
    })

    socket.on('roomdata', ({ room, users }) => {
        console.log(users)
        var html = Mustache.render($("#sidebar-template").html(), {
            room,
            users
        })
        $("#sideBar").html(html)
    })
});

function animateContent(direction) {
    const messageHeight = $(".message").height()
    const messageLength = $(".message").length
    const totalLength = messageHeight * messageLength
    var animationOffset = totalLength - $('#messages').height() - 42;
    if (direction == 'up') {
        animationOffset = 0;
    }

    console.log("animationOffset:" + animationOffset);
    $('.content').animate({ "marginTop": (animationOffset) + "px" }, 1000);
}

function up() {
    animateContent("up")
}

function down() {
    animateContent("down")
}

function start() {

    setTimeout(function() {
        console.log("wait...");
    }, 1000);
}