const axios = require('axios');
const fs = require("fs")
const { MessageMedia } = require("whatsapp-web.js")
const download = require('file-download')

const ytToMp3 = async ({client, message, command, wait, ifNotValid}) => {
    const body = message.body
    if (body.includes(command)) {
        const idYt = message.body.split("/")[1]

        if (!idYt) {
            message.reply(ifNotValid)
            return
        }

        const options = {
            method: 'GET',
            url: 'https://youtube-mp36.p.rapidapi.com/dl',
            params: {id: idYt},
            headers: {
                'X-RapidAPI-Key': '58f59793e8mshe9739fc58ca0e7cp10d656jsn3d727d5c165b',
                'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
            }
        };
    
        try {
            const response = await axios.request(options);
            console.log(response.data);
            const durasi = response.data.duration
            const jam = Math.floor(durasi / 3600)
            const menit = Math.floor(durasi / 60)
            const detik = Math.floor(durasi % 60)

            message.reply(wait)

            download(response.data.link, {
                directory: "./",
                filename: response.data.title
            }, async (err) => {
                if (err) {
                    console.log(err)
                }
                const title = response.data.title
                const music = fs.readFileSync(title, "base64")
                
                const pesan = await client.sendMessage(message.from, title,{
                    media: new MessageMedia("audio/mpeg", music, title),
                })
                const sizeMB = parseFloat((pesan._data.size / 1000000).toFixed(1))
                client.sendMessage(message.from, `*Informasi musik*\n\nJudul: ${response.data.title}\nDurasi: ${jam} Jam ${menit} menit ${detik} detik\nUkuran: ${sizeMB} MB (${pesan._data.size}B)`)
                console.log(pesan)
                fs.unlinkSync(title)
            })
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = ytToMp3