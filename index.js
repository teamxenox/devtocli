const chalk = require('chalk');
const inquirer = require('inquirer');
const opn = require('opn');
const program = require('commander');

const crawler = require('./util/crawler');
const countdown = require('./util/spinner')

let articles;

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

program
    .version('0.0.0')


program
    .command("tag [tag]")
    .alias("l")
    .action((tag) => {
        if (tag) {
            crawler.fetchByTags(tag).then(data => {
                articles = data.filter(data => data.title != undefined);
                askQuestion(articles.map(data => data.title));
            });
        } else {
            crawler.fetchTags().then(data => {
                searchTags(data);
            });
        }
    })

program
    .command("search <keyword>")
    .alias("s")
    .action((keyword) => {
        countdown.start();

        crawler.searchPost(keyword).then(data => {
            countdown.stop();
            articles = data.hits.map(post => {
                return {
                    title: post.title,
                    link: "https://dev.to" + post.path
                }
            });
            askQuestion(articles.map(data => data.title));
        });
    })


program.parse(process.argv);

if (program.args.length === 0) {
    countdown.start();
    crawler.fetchHome().then(data => {
        countdown.stop();
        articles = data.filter(data => data.title != undefined);
        askQuestion(articles.map(data => data.title));
    })
}

const askQuestion = (titles) => {
    inquirer.prompt([{
            type: 'list',
            name: 'title',
            message: '📚 Here are your posts:',
            choices: titles,
            paginated: true
        }])
        .then(answers => {          
            openLink(answers);
        });
}

const searchTags = (tags) => {
    inquirer.prompt([{
        type: 'autocomplete',
        name: 'tag',
        message: '🕵🏻‍♂️  Search popular tags:',
        pageSize: 4,
        source: function (answers, input) {
            return new Promise((resolve) => {
                resolve(tags.filter(data => data.indexOf(input) > -1))
            });
        }
    }]).then((answers) => {
        countdown.start();
        crawler.fetchByTags(answers.tag).then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            askQuestion(articles.map(data => data.title));
        });
    })
}
const openLink = (answers) => {
    opn(articles.find(data => data.title === answers.title).link);
}

const showArticle = (answers) => {
    crawler.fetchArticle(articles.find(data => data.title === answers.title).link);
}