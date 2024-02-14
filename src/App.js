import fs from 'fs/promises'
import path from 'path';

export default class App {
    constructor (client) {
        this.client = client;
        this.commands = {}
    }

    async handleMessage (msg) {
        const __filename = new URL(import.meta.url).pathname
        const __dirname = path.dirname(__filename)

        const folder = await fs.readdir(path.join(__dirname, './commands'))
        for (const file of folder) {
            const comandName = file.split('.')[0]
            const commandClass = (await import(`./commands/${file}`)).default
            this.commands[comandName] = new commandClass(this.client)
        }



        if (msg.body.startsWith('.')) {
            const [commandName, ...args] = msg.body.split(' ')
            const className = commandName.substring(1)
            const command = this.commands[className]

            if (command) {
                command.run(msg)
            }
        }
        
        
    }
}