const axios = require("axios")
const {MessageMedia} = require("whatsapp-web.js")

const jokesGambar = async ({client, message, command, wait, ifNotValid}) => {
    if (message.body == command) {
        try {
            const response = await axios.get('https://candaan-api.vercel.app/api/image/random');
            console.log(response.data.data.url);
            client.sendMessage(message.from, wait)
            const media = await MessageMedia.fromUrl(response.data.data.url)
            client.sendMessage(message.from, media)
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = jokesGambar