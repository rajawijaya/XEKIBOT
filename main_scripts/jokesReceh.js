const axios = require("axios")
const {MessageMedia} = require("whatsapp-web.js")

const jokesReceh = async ({client, message, command, wait, ifNotValid}) => {
    if (message.body == command) {
        try {
            const response = await axios.get('https://candaan-api.vercel.app/api/text/random');
            console.log(response.data.data);
            client.sendMessage(message.from, response.data.data)
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = jokesReceh