import pkg from 'whatsapp-web.js';
import express  from 'express';
import cors from "cors";
import qrcode from 'qrcode-terminal'
import App from './src/App.js'
import { MongoStore } from 'wwebjs-mongo'
import mongoose from 'mongoose'

const { Client, RemoteAuth } = pkg
const app = express()
const port = 3000

let bots = {};



    app.use(express.urlencoded({ extended: true }));
    app.use(express.json())
    app.use(cors())


    const sendMessage = async (clientId, res) => {
        const store = new MongoStore({ mongoose: mongoose });
        const bot = client[clientId]



        bot.sendMessage('6281399558608@c.us', "alhamdulillah")

        res.json(
            {
                msg: "berhasil cuyyy"
            }
        )
    }


    const createSession = async (clientId, res) => {
            const store = new MongoStore({ mongoose: mongoose });
            const client = new Client({
                authStrategy: new RemoteAuth({
                    store: store,
                    backupSyncIntervalMs: 300000,
                    clientId
                })
            });

            bots[clientId] = client

            if (bots[clientId].info) {
                res.json(
                    {
                        message: "client is ready"
                    }
                )
            }

            client.on('qr', qr => {
                qrcode.generate(qr, {small: true});
                res.json(
                    {
                        qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qr}`
                    }
                )
            });


            
            client.on('ready', () => {
                console.log(`${clientId} is ready!`);
            });
    
            client.on('remote_session_saved', () => {
                console.log(`${clientId} sudah tersimpan di db`);
            })
    
            client.on('message', async (msg) => {
                const app = new App(client)
    
                app.handleMessage(msg)
            })
            
    
            client.initialize();
    }

    app.get('/new/:clientId', async (req, res) => {
        console.log("masuk");
        const clientId = req.params.clientId;

        const response = await createSession(clientId, res)
    })

    app.get('/sendmessage/:clientId', async (req, res) => {
        const {clientId} = req.params
        
        const response = await sendMessage(clientId, res)
    })


mongoose.connect('mongodb://127.0.0.1:27017/xekibot-sessions-auth').then(() => {
    console.log('koneksi ke xekibot-sessions-auth berhasil');
    app.listen(port, () => {
        console.log(`XEKIBOT app listening on port ${port}`)
    })
});