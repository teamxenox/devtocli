const crawler = require('./util/crawler');
const chalk = require('chalk');
const inquirer = require('inquirer');
const opn = require('opn');
const program = require('commander');

let articles;

program
    .version('0.0.0')


program
    .command("tag <tag>")
    .alias("l")
    .action((tag) => {
        crawler.fetchByTags(tag).then(data => {
            articles = data.filter(data => data.title != undefined);
            askQuestion(articles.map(data => data.title));
        });
    })

program.parse(process.argv);

if(program.args.length === 0){
    crawler.fetchHome().then(data => {
        articles = data.filter(data => data.title != undefined);
        askQuestion(articles.map(data => data.title));
    })
} 

const askQuestion = (titles) => {
    inquirer.prompt([{
            type: 'list',
            name: 'title',
            message: 'Select the story 🤓',
            choices: titles,
            paginated: true
        }])
        .then(answers => {
            openLink(answers);
        });
}

const openLink = (answers) => {
    opn(articles.find(data => data.title === answers.title).link);
}

const showArticle = (answers) => {
    crawler.fetchArticle(articles.find(data => data.title === answers.title).link);
}