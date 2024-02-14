const createdGrub = ({client, message, command, wait}) => {
    if (message.body === command) {
        client.sendMessage(message.from, "berhasil")
    }
}

module.exports = createdGrub