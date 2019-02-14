#! /usr/bin/env node

const program = require('commander');
const opn = require('opn');


const crawler = require('./util/crawler');
const countdown = require('./util/spinner');
const prompt = require('./util/prompt');

let articles;

const openLink = (answers) => {
    opn(articles.find(data => data.title === answers.title).link);
    process.exit();
}

/**
 * This is a function to fetch top posts of a tags.
 * @param {string} tag - tag by which posts will be fetched
 * @returns {null} null
 */

const showPostsByTags = (tag) => {
    countdown.start();
    crawler.fetchByTags(tag).then(data => {
        countdown.stop();
        articles = data.filter(data => data.title != undefined);
        prompt.showPosts(articles.map(data => data.title)).then(answers => {
            openLink(answers);
        });
    });
}

/**
 * This is a function to fetch top posts by time.
 * @param {string} timeline - timeline by which posts will be fetched
 * @returns {null} null
 */

const showPostsByTimeline = (timeline) => {
    countdown.start();
    crawler.fetchTop(timeline).then(data => {
        countdown.stop();
        articles = data.filter(data => data.title != undefined);
        prompt.showPosts(articles.map(data => data.title)).then(answers => {
            openLink(answers);
        });
    })
}

program
    .version('0.0.0')

program
    .command("top [timeline]")
    .action((timeline) => {

        if (timeline)
            showPostsByTimeline(timeline);

        else
            prompt.selectTimline().then(answers => showPostsByTimeline(answers.timeline));

    })

program
    .command("tag [tag]")
    .alias("t")
    .action((tag) => {

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
    .command("latest")
    .alias("l")
    .action(() => {
        countdown.start();

        crawler.fetchLatest().then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            prompt.showPosts(articles.map(data => data.title)).then(answers => {
                openLink(answers);
            });
        })
        
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