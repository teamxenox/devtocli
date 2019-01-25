const crawler = require('./util/crawler');
const chalk = require('chalk');
const inquirer = require('inquirer');
const opn = require('opn')

let articles;

crawler.fetchHome().then(data => {
    articles = data.filter(data => data.title != undefined);
    askQuestion(articles.map(data => data.title));
})


const askQuestion = (titles) => {
    inquirer.prompt({
            type: 'list',
            name: 'title',
            message: 'select the story 🤓',
            choices: titles,
            paginated: true
        })
        .then(answers => {
            openLink(answers);
        });
}

const openLink = (answers) => {
      opn(articles.find(data=>data.title === answers.title).link);
}