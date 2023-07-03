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

const client = new Client({
  authStrategy: new LocalAuth()
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

  


    const mediaData = fs.readFileSync("./profile.png", "base64")
    client.sendMessage(message.from, "\uFF37\uFF45\uFF4C\uFF43\uFF4F\uFF4D\uFF45 \uFF54\uFF4F _*\uFF38\uFF25\uFF2B\uFF29\uFF22\uFF2F\uFF34*_\r\n```Author By Raja Wijaya```\r\n\r\nDaftar perintah yang bisa anda gunakan:\r\n*.menu* => Menampilkan daftar menu\r\n*.sticker* => Membuat stiker dari gambar\r\n*.rmbg* => menghapus background gambar\r\n*.chbgred* => Mengganti background gambar menjadi merah\r\n*.chbgblue* => Mengganti background gambar menjadi biru\r\n*.yttomp3* => ubah id url youtube menjadi musik.", {
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


});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

