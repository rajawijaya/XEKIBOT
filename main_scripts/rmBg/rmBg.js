const { RemoveBgResult, removeBackgroundFromImageFile } = require("remove.bg")
const fs = require("fs")
const { MessageMedia } = require("whatsapp-web.js")


const rmBg = async ({client, message, command, wait, ifNotValid}) => {
    if (message.body === command) {
        if (message.hasMedia) {
            try {
                const json = fs.readFileSync("main_scripts/rmBg/settings.json")
                const api = JSON.parse(json)
                // download media
                const media = await message.downloadMedia();
            
                // Simpan media sebagai file temporary
                const filename = `temp_${Date.now()}.png`;
                const outputFile = `remove-background-by-XEKIBOT.${Date.now()}.png`;
                const settings = {
                    path: filename,
                    apiKey: api.apiKey,
                    size: "regular",
                    type: "auto",
                    format: "png",
                    outputFile
                }
                await fs.promises.writeFile(filename, media.data, 'base64');
                
                message.reply(wait)

                removeBackgroundFromImageFile(settings)
                    .then(async (result) => {
                        console.log(`File saved to ${outputFile}`);
                        const base64img = result.base64img;

                        const img = await client.sendMessage(message.from, " ", {
                            media: new MessageMedia("", base64img, outputFile)
                        });
                        // const img = await client.sendMessage(message.from, new MessageMedia("", base64img, outputFile));

                        console.log('Gambar terkirim:', img);
                        console.log(media.mimetype);
            
                        fs.unlinkSync(filename);
                        fs.unlinkSync(outputFile);
                    })
                    .catch(async (errors) => {
                        if (errors[0].title === "Insufficient credits") {
                            api.apiKey = api.LIST_API_KEY[0]
                            api.LIST_API_KEY.splice(0, 1)
                            fs.writeFileSync("main_scripts/rmBg/settings.json", JSON.stringify(api))
                            fs.unlinkSync(filename);
                        }
                    })

            } catch (error) {
                console.error('Terjadi kesalahan saat mengirim gambar:', error);
            }
        } else {
        // Jika tidak ada media (gambar) dalam pesan
        message.reply(ifNotValid);
        }
    }
}


module.exports = rmBg

