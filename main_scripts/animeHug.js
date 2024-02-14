const axios = require("axios")
const {MessageMedia} = require("whatsapp-web.js")

const animeHug = async ({client, message, command, wait, ifNotValid}) => {
    if (message.body == command) {
        try {
            const response = await axios.get('https://kyoko.rei.my.id/api/hug.php');
            console.log(response.data.apiResult);
            client.sendMessage(message.from, wait)
            const media = await MessageMedia.fromUrl(response.data.apiResult.url)
            client.sendMessage(message.from, media)
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = animeHug