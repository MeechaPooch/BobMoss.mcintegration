import { token, serverId, restarterRoleId, adminRoleId } from './secrets.js';

import Discord from 'discord.js';
import { exec } from 'child_process';
const client = new Discord.Client();

async function sleep(millis) {
    return new Promise(res => setTimeout(res, millis))
}

var running = true;
var stilldoing = false;

async function setup() {

    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    
    client.on('message', async message => {
      let args = message.content.split(' ');
      let text = args.shift().toLowerCase();
      if (text == "bob moss, hit the big red button" || text == "!mcrestart") {
        if (stilldoing == true) {
          message.reply('Still in the process of running another command.');
          return;
        }
        if(!doesUserHaveAuth(message.member)) {
          message.reply('You don\'t have permission to restart the server.');
          return;
        }

        stilldoing = true;
        running = false;
        message.channel.send('On it, compadre. Im shutting down the reactor core plasma stabalizers now...');
        await restart();
        message.channel.send('Ive inserted the cyber bomb into the mainframe. We have to wait a bit for the blockchain crypto units to collapse...');
        await sleep(15000);
        message.channel.send('Ok, Im rebooting the AI network with our new code overwrite. Great job captain, you truely saved the day.');
        stilldoing = false;
      } else if (text == "!mcstop") {
        if(stilldoing == true) {
          message.reply('Still in the process of running another command.');
          return;
        }
        if(!doesUserHaveAuth(message.member)) {
          message.reply('You don\'t have permission to stop the server.');
          return;
        }

        stilldoing = true;
        await stop();
        message.channel.send('Initiated meltdown sequence.');
        await sleep(15000);
        stilldoing = false;
      } else if (text == "!mcstart") {
        if(stilldoing == true) {
          message.reply('Still in the process of running another command.');
          return;
        }
        if(!doesUserHaveAuth(message.member)) {
          message.reply('You don\'t have permission to start the server.');
          return;
        }

        if (running) {
          message.channel.send("No can completamento compadrino ... youve gotsa to stopsa the server first brah");
        } else {
          stilldoing = true;
          message.channel.send('Starting server...');
          await start();
          message.channel.send('Start command executed!');
          await sleep(20000);
          stilldoing = false;
        }
      } else if (text === "!mcisup") {
        await message.channel.send(running ? 'The server is up!' : 'The server is not up.');
      } else if (text === "!mcsetup") {
        running = args[0].toLowerCase() === 'true';
        await message.channel.send(`You have set the server to ${running ? 'up' : 'down'}.`);
      }
    });
    client.login(token);
}

const start = async () => {
  running = true;
  await exec('monit start minecraft');
  return new Promise(cb => exec('systemctl start minecraft', cb));
}

const stop = async () => {
  running = false;
  return new Promise(cb => exec('monit stop minecraft', cb));
}

const restart = async () => {
  running = false;
  await stop();
  return start();
}

function doesUserHaveAuth(user) {
  return user.roles.cache.find(r => r.id == adminRoleId || r.id == restarterRoleId);
}

setup();