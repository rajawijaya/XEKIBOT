const fs = require("fs")
const { MessageMedia } = require("whatsapp-web.js")


const imgToSticker = async ({client, message, command, wait, ifNotValid}) => {
    if (message.body.toLowerCase() === command) {
        if (message.hasMedia) {
          try {
            // download media
            const media = await message.downloadMedia();
          
            // Simpan media sebagai file temporary
            const filename = `temp_${Date.now()}.${media.mimetype.split('/')[1]}`;
            await fs.promises.writeFile(filename, media.data, 'base64');
              
            message.reply(wait)

            // Kirim stiker sebagai balasan
            const sticker = await client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, filename), {
              sendMediaAsSticker: true,
              stickerAuthor: "XEKIBOT",
              stickerName: "Sticker Created By"
            });
      
            console.log('Stiker terkirim:', sticker);
      
            fs.unlinkSync(filename);
          } catch (error) {
            console.error('Terjadi kesalahan saat mengirim stiker:', error);
          }
        } else {
          // Jika tidak ada media (gambar) dalam pesan
          message.reply(ifNotValid);
        }
      }
}

module.exports = imgToSticker