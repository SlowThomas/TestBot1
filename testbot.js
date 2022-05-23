// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');
// node filesystem
const fs = require('fs');
require('dotenv').config()


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    console.log(`./commands/${file}`);
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

const messagePrefix = '!';

client.on('message', (message) => {
    if (!message.content.startsWith(messagePrefix)) return;
    if (message.author.bot) return;

    // we dont care about uppper/lower case
    const command = client.commands.get(message.content.substring(messagePrefix.length).toLowerCase().split(' ')[0]);

    if (!command) return console.log("couldnt find that command");

    const args = message.content.slice(messagePrefix.length + command.name.length).trim().toLowerCase().split(' ');

    if (args.length == 0 && command.argsRequired)
        return message.channel.send("You must input some arguments to use that command!")

    command.execute(message, args);
});



// When the client is ready, run this code (only once)
client.once('ready', () => {
    // https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization 
    const { sequelize } = require('./db.js')
    sequelize.sync();
    console.log('Ready!');
});

// Login to Discord with your client's token
client.login(process.env.token);
