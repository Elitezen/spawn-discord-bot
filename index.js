#!/usr/bin/env node

import chalk from "chalk";
import clone from "git-clone/promise.js";
import inquirer from "inquirer";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import { promisify } from "util";

const wait = promisify(setTimeout);

let folderName = '';
let language = '';

async function start() {
  await askFolderName();
  await askLanguage();
  await cloneRepo();
}

start();

async function askFolderName() {
  const answers = await inquirer.prompt({
    name: 'folder_name',
    type: 'input',
    message: 'Enter folder name',
    default() {
      return 'my-discord-bot'
    }
  });

  folderName = answers.folder_name;
}

async function askLanguage() {
  const answers = await inquirer.prompt({
    name: 'language',
    type: 'list',
    message: 'Choose your language\n',
    choices: [
      chalk.yellow('JavaScript'),
      chalk.blue('TypeScript')
    ],
    default() {
      return 'javascript';
    }
  });

  language = answers.language.toLowerCase();
}

async function cloneRepo() {
  const spinner = createSpinner('Creating...')
    .start();

  try {
    await clone(`https://github.com/Elitezen/DiscordJS-Bot-Template`, folderName, {
      checkout: language == chalk.yellow('javascript') ? 'javascript' : 'typescript'
    });

    await wait(1000);

    figlet('A Wild Discord Bot Has Appeared!', (err, data) => {
      console.log(language == chalk.yellow('javascript') ? chalk.yellow(data) : chalk.blue(data));
      spinner.success({
        text: `Bot directory setup complete
  
          cd ${folderName}
          npm i 
          npm run configure
        `
      });
  
      process.exit(0);
    });
  } catch (err) {
    spinner.error({
      text: `An error occured: ${err}`
    });

    process.exit(1);
  }
}