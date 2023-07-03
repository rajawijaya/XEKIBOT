const socket = io();
const createS = document.querySelector("button.create-session")
const deleteS = document.querySelector("button.delete-session")
const qr = document.querySelector(".qr")

createS.addEventListener("click", () => {
    qr.innerText = "Created session"
    socket.emit("create", {
        msg: "session created"
    })
})

socket.on("qr", (param) => {
    qr.innerText = param.qr
})

socket.on("ready", (param) => {
    qr.innerText = param.msg
})

deleteS.addEventListener("click", () => {
    qr.innerText = "Deleted session"
    socket.emit("delete", {
        msg: "session deleted"
    })
})
