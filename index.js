import { token, speakRoleId, serverId, announcementsChannelId, generalChannelId } from './secrets.js'

import Discord from 'discord.js'
import { exec } from 'child_process'
const client = new Discord.Client();
let serverGuild = new Discord.Guild();

async function sleep(millis) {
    return new Promise(res => setTimeout(res, millis))
}

var running = true;
var stilldoing = false;

async function setup() {

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        serverGuild = await (await client.guilds.fetch(serverId))
    });

    client.on('message', async message => {
        let text = message.content.toLowerCase();
        if (text == "bob moss, hit the big red button" || text == "!mcrestart") {
            if (stilldoing == true) { return; }
            stillrestarting = true;
            running = false;
            message.channel.send('On it, compadre. Im shutting down the reactor core plasma stabalizers now...');
            await stop();
            message.channel.send('Ive inserted the cyber bomb into the mainframe. We have to wait a bit for the blockchain crypto buildings to collapse...');
            await sleep(15000);
            message.channel.send('Ok, Im rebooting the AI network with our new code overwrite. Great job captain, you truely saved the day.');
            await start();
            await sleep(20000);
            stilldoing = false;
        }
        else if (text == "!mcstop") {
            if(stilldoing == true) {return;}
            stilldoing = true;
            await stop();
            message.channel.send('Initiated meltdown sequence.');
            await sleep(15000);
            stilldoing = false;
        }
        else if (text == "!mcstart") {
            if(stilldoing == true) {return;}
            if (running) {
                message.channel.send("No can completamento compadrino ... youve gotsa to stopsa the server first brah");
            } else {
                stilldoing = true;
                message.channel.send('Starting server...');
                start();
                message.channel.send('Start command executed!');
                await sleep(20000);
                stilldoing = false;
            }
        }

    })
    client.login(token);
}

function stop() {
    running = false;
    return new Promise(cb => exec('systemctl start minecraft', cb));
}

async function start() {
    running = true;
    return new Promise(cb => exec('systemctl stop minecraft', cb))
}

await setup();
