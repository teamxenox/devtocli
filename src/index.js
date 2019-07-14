#! /usr/bin/env node

const program = require('commander');
const opn = require('opn');
const escExit = require('esc-exit');

const crawler = require('./util/crawler');
const countdown = require('./util/spinner');
const prompt = require('./util/prompt');
const showProfile = require('./util/profile');
const localStorage = require('./util/localStorage');

const BOOKMARK_TAG = '   ![BOOKMARK]';

let articles;

escExit();

const openLink = (answers) => {
    opn(articles.find(data => data.title === answers.title).link);
    process.exit();
}

const tagBookmark = () => {
    // append the bookmarked post title with ![BOOKMARK]tag
    let titles = articles.map(article => {
        let finalTitle;

        let bookmarks = localStorage.readBookmark().bookmarks;
        if(bookmarks.length > 0) {
            for(let i = 0; i < bookmarks.length; i++) {
                if(article.link === bookmarks[i].link) {
                    finalTitle = article.title + '   ![BOOKMARK]';
                    break;
                }else {
                    finalTitle = article.title;
                }
            }
            return finalTitle;
        }else
            return article.title;
    });

    return titles;
}

/**
 * This is a function to show the prompt for the articles passed
 * @param {Array<Object>} articles 
 * @returns {null} null
 */

const postPrompt = () => {
    prompt.showPosts(tagBookmark()).then(answers => {
        if(!answers.title.includes('   ![BOOKMARK]')){
            
            prompt.postOperation().then(data => {
                if(data.postOperation === 'Add to Bookmark') {
                    // push the answer to bookmark storage
                    localStorage.addBookmark(articles.find(data => data.title === answers.title));
                    return postPrompt();
                }
                openLink(answers);
            }).catch(err => {
                console.log('unexpected error occurred :( - ', err);
            });
        }else{
            // remove the ![BOOKMARK] tag from title
            answers.title = answers.title.slice(0, -(BOOKMARK_TAG.length));
            openLink(answers);
        }
    });
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
        postPrompt();
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
        postPrompt();
    })
}

/**
 * This is a function to display the profile details of the author.
 * @param {string} username - username of the author
 * @returns {null} null
 */

const showAuthorProfile = (username) => {
    countdown.start();
    crawler.fetchAuthorProfile(username).then((profileInfo) => {
        countdown.stop();
        if (!profileInfo.name) {
            console.error("😱 User not found. Please try again.");
            process.exit(1);
        }
        showProfile(profileInfo);
    });
}

program
    .version('1.4.7')

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
            postPrompt();
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
            postPrompt();
        });
    })

program
    .command("author <username>")
    .option("-p, --profile", "Show author profile")
    .alias("a")
    .action((username, cmd) => {
        if (cmd.profile) {
            showAuthorProfile(username);
        } else {
            countdown.start();
            crawler.fetchByAuthor(username).then(data => {
                countdown.stop();
                articles = data.filter(data => data.title != undefined);
                postPrompt();
            });
        }
    })

// error on unknown commands
program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
  });

program.parse(process.argv);

if (program.args.length === 0) {
    countdown.start();
    crawler.fetchHome().then(data => {
        countdown.stop();
        articles = data.filter(data => data.title != undefined);
        postPrompt();
    })
}