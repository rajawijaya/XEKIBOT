const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const qrcode = require("qrcode-terminal")
const fs = require("fs")
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const imgToSticker = require("./main_scripts/imgToSticker.js")
const rmBg = require("./main_scripts/rmBg/rmBg.js")
const chBgRed = require("./main_scripts/chBgRed.js")
const chBgBlue = require("./main_scripts/chBgBlue.js")
const ytToMp3 = require("./main_scripts/ytToMp3.js")
const animeWaifu = require("./main_scripts/animeWaifu.js")
const animeBlush = require("./main_scripts/animeBlush.js")
const animeBonk = require("./main_scripts/animeBonk.js")
const animeHug = require("./main_scripts/animeHug.js")
const jokesGambar = require("./main_scripts/jokesGambar.js")
const jokesReceh = require("./main_scripts/jokesReceh.js")

const debugingMode = false



if (debugingMode) {
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: "xekibot"
    })
  });
  
  client.on('qr', async (qr) => { 
    qrcode.generate(qr, {small: true});
  });
  
  client.on('ready', () => {
    console.log("Client Ready")
  });

  client.on("message", (message) => {
    const body = message.body
    console.log(body)


    client.sendMessage(message.from, "Bot ini dalam mode debug, untuk sementara bot ini tidak bisa digunakan, untuk pelanggan premium masa kadaluarsa akan di tambahkan sesuai dengan waktu debug.\n Terimakasih")

   


  })

  client.initialize();
} else {
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: "xekibot"
    })
  });
  
  app.use(express.static("public"))
  
  io.on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on("create", (param) => {
      console.log(param.msg)
      client.initialize();
      client.on('qr', async (qr) => { 
        qrcode.generate(qr, {small: true});
        socket.emit("qr", {
          qr
        }) 
      });
    })
  
    client.on('ready', () => {
      console.log("Client Ready")
      socket.emit("ready", {
        msg: "Client is ready"
      })
    });
  
    socket.on("delete", async (param) => {
      console.log(param.msg)
      client.logout()
    })
  });

  client.on("call", (call) => {
    console.log(call)
    // call.reject()
  })
  
  client.on('message', async (message) => {
    const content = message.body.toLowerCase()
    console.log(content)
  
    if (content == "p") {
      message.reply("PA PE PA PE, SALAM YANG BENERRR!!!")
    }
    
    if (/^\s*assalamu[']?alaikum\s*$/.test(content)) {
      message.reply("Wa'alaikumussalam Warahmatullahi Wabarakatuh\n\nAda yang bisa saya bantu? silahkan ketik *.menu* untuk melihat semua perintah!")
    }
  
    if (content === ".menu") {
      const user = null
      const memberCount = null
      const uptime = null
      const mediaData = fs.readFileSync("./profile.png", "base64")
      client.sendMessage(message.from, `\uD835\uDE52 \uD835\uDE40 \uD835\uDE47 \uD835\uDE3E \uD835\uDE4A \uD835\uDE48 \uD835\uDE40   \uD835\uDE4F \uD835\uDE4A   \uD835\uDE53 \uD835\uDE40 \uD835\uDE46 \uD835\uDE44 \uD835\uDE3D \uD835\uDE4A \uD835\uDE4F \u30C5\r\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\r\n\r\nHello ${user} ada yang bisa saya bantu?\r\n\r\n\u250F\u2501\u2501\u2501\u252B\u300E *User information*\u300F\u2503\r\n\u2523\u25A3 Username : ${user}\r\n\u2523\u25A3 Status : Member Unregister\/Regular\/Premium\r\n\u2523\u25A3 Jumlah member : ${memberCount}\r\n\u2523\u25A3 Bot Uptime : ${uptime}\r\n\u2517\u2501\u2501\u2501\u252B\r\n\r\nHubungi owner untuk registrasi member atau membeli paket premium\r\n\r\n\u2630 *MENU*\r\n\r\n\u2554\u2550\u2550\u2550\u2563\u300E *INFO*\u300F\u2551\r\n\u2560\u2550\u233A .owner\r\n\u255A\u2550\u2550\u2550\u2563\r\n\r\n\r\n\u2554\u2550\u2550\u2550\u2563\u300E *ANIME*\u300F\u2551\r\n\u2560\u2550\u233A .animewaifu\r\n\u2560\u2550\u233A .animeblush\r\n\u2560\u2550\u233A .animebonk\r\n\u2560\u2550\u233A .animehug\r\n\u255A\u2550\u2550\u2550\u2563\r\n\r\n\r\n\u2554\u2550\u2550\u2550\u2563\u300E *GAME*\u300F\u2551\r\n\u2560\u2550\u233A .jokesreceh\r\n\u2560\u2550\u233A .jokesgambar\r\n\u255A\u2550\u2550\u2550\u2563\r\n\r\n\r\n\u2554\u2550\u2550\u2550\u2563\u300E *DOWNLOADER*\u300F\u2551\r\n\u2560\u2550\u233A .yttomp3 <id youtube> \u272E\r\n\u255A\u2550\u2550\u2550\u2563`, {
        media: new MessageMedia("image/png", mediaData)
      })
    }
  
    imgToSticker({
        client,
        message,
        command: ".sticker",
        wait: "Mohon tunggu sebentar!!!",
        ifNotValid: "Kirimkan gambar dengan caption *.sticker* untuk membuat stiker!!!"
    })
  
    rmBg({
      client,
      message,
      command: ".rmbg",
      wait: "Mohon tunggu sebentar, jika tidak merespon dalam 10 detik, coba lagi!!!",
      ifNotValid: "Kirim gambar dengan caption *.rmbg* untuk menghapus latar belakang"
    })
    
    chBgRed({
      client,
      message,
      command: ".chbgred",
      wait: "Mohon tunggu sebentar, jika tidak merespon dalam 10 detik, coba lagi!!!",
      ifNotValid: "Kirim gambar dengan caption *.chbgred* untuk menghapus latar belakang"
    })
    
    chBgBlue({
      client,
      message,
      command: ".chbgblue",
      wait: "Mohon tunggu sebentar, jika tidak merespon dalam 10 detik, coba lagi!!!",
      ifNotValid: "Kirim gambar dengan caption *.chbgblue* untuk menghapus latar belakang"
    })
  
    ytToMp3({
      client,
      message,
      command: ".yttomp3",
      ifNotValid: "masukan id video youtube setelah peritah *.yttomp3* dengan separator */* untuk mengubah video youtube menjadi musik. contoh penggunaan : *.yttomp3/aDAbUDJn* . id youtube berada di ujung endpoint url youtube",
      wait: "Mohon tunggu sebentar, musik sedang di unduh!!!"
    })

    animeWaifu({
      client,
      message,
      command: ".animewaifu",
      wait: '_prosess_'
    })

    animeBlush({
      client,
      message,
      command: ".animeblush",
      wait: '_prosess_'
    })

    animeBonk({
      client,
      message,
      command: ".animebonk",
      wait: '_prosess_'
    })

    animeHug({
      client,
      message,
      command: ".animehug",
      wait: '_prosess_'
    })

    jokesGambar({
      client,
      message,
      command: ".jokesgambar",
      wait: '_prosess_'
    })

    jokesReceh({
      client,
      message,
      command: ".jokesreceh",
      wait: '_prosess_'
    })
  
  
  });

  server.listen(3000, () => {
    console.log('listening on *:3000');
  });
}