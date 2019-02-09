#! /usr/bin/env node

const program = require('commander');
const opn = require('opn');


const crawler = require('./util/crawler');
const countdown = require('./util/spinner');
const prompt = require('./util/prompt');

let articles;


program
    .version('0.0.0')


program
    .command("tag [tag]")
    .alias("l")
    .action((tag) => {
        countdown.start();

        if (tag) showPostsByTags(tag);

        else {
            crawler.fetchTags().then(data => {
                prompt.searchTags(data).then((answers) => {
                    showPostsByTags(answers.tag);
                });
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
            prompt.showPosts(articles.map(data => data.title)).then(answers => {
                openLink(answers);
            });
        });
    })

program
    .command("author <username>")
    .alias("a")
    .action((username) => {
        countdown.start();
        crawler.fetchByAuthor(username).then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            prompt.showPosts(articles.map(data => data.title)).then(answers => {
                openLink(answers);
            });
        });
    })


program.parse(process.argv);

if (program.args.length === 0) {
    countdown.start();
    crawler.fetchHome().then(data => {
        countdown.stop();
        articles = data.filter(data => data.title != undefined);
        prompt.showPosts(articles.map(data => data.title)).then(answers => {
            openLink(answers);
        });
    })
}

const openLink = (answers) => {
    opn(articles.find(data => data.title === answers.title).link);
    process.exit();
}

/**
 * This is a function to fetch top posts of a tags.
 * @param {string} tag - tag by which posts will be fixed
 * @returns {null} null
 */

const showPostsByTags = (tag) => {
    crawler.fetchByTags(tag).then(data => {
        countdown.stop();
        articles = data.filter(data => data.title != undefined);
        prompt.showPosts(articles.map(data => data.title)).then(answers => {
            openLink(answers);
        });
    });
}