#! /usr/bin/env node

const program = require('commander');
const open = require('open');
const escExit = require('esc-exit');
const chalk = require('chalk');
const didYouMean = require('didyoumean');
const showBanner = require('node-banner');

const { description, version } = require('../package');
const crawler = require('./util/crawler');
const countdown = require('./util/spinner');
const prompt = require('./util/prompt');
const showProfile = require('./util/profile');
const localStorage = require('./util/localStorage');

const BOOKMARK_TAG = '   ![BOOKMARK]';

let articles;

escExit();

const openLink = (answers) => {
    open(articles.find(data => data.title === answers.title).link);
}

/**
 * A function to append the ![BOOKMARK] tag to the bookmarked title
 * @params {null} null
 * @return {null} null
 */
const tagBookmark = () => {
    let titles = articles.map(article => {
        let finalTitle;

        let bookmarks = localStorage.readBookmark().bookmarks;
        if(bookmarks.length > 0) {
            for(let i = 0; i < bookmarks.length; i++) {
                if(article.link === bookmarks[i].link) {
                    finalTitle = article.title + BOOKMARK_TAG;
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
        if(!answers.title.includes(BOOKMARK_TAG)){
            
            prompt.postOperation(['Open Link', 'Add to Bookmark']).then(data => {
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
 * This is a function to show the bookmark with post prompt 
 * i.e open link or delete bookmark
 * @param {null} null
 * @returns {null} open link or load updated bookmark
 */
const postBookmarkPrompt = () => {
    bookmark = localStorage.readBookmark().bookmarks;
    prompt.showPosts(bookmark.map(data => data.title)).then(answer => {
        prompt.postOperation(['Open Link', 'Remove from Bookmark']).then(choice => {
            if(choice.postOperation === 'Remove from Bookmark') {
                localStorage.deleteBookmark(answer.title);
                return postBookmarkPrompt();
            }
            open(bookmark.find(data => data.title === answer.title).link);
            process.exit();
        }).catch(err => {
            console.log(err);
        });
        
    }).catch(err => {
        console.log(err);
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

const suggestCommands = cmd => {
	const availableCommands = program.commands.map(c => c._name);

	const suggestion = didYouMean(cmd, availableCommands);
	if (suggestion) {
		console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
	}
}

program
    .version(version)
    .usage('<command> [options]')
    .description(description)

program
    .command("top [timeline]")
    .action(async (timeline) => {
        await showBanner('Devto', 'Browse and Search Dev.to Posts from Command Line', 'white');
        if (timeline)
            showPostsByTimeline(timeline);

        else
            prompt.selectTimline().then(answers => showPostsByTimeline(answers.timeline));

    })

program
    .command("tag [tag]")
    .alias("t")
    .action(async (tag) => {
        await showBanner('Devto', 'Browse and Search Dev.to Posts from Command Line', 'white');
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
    .action(async () => {
        await showBanner('Devto', 'Browse and Search Dev.to Posts from Command Line', 'white');
        countdown.start();
        crawler.fetchLatest().then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            postPrompt();
        })
    })

program
    .command("bookmark")
    .alias("bm")
    .action(async () => {
        await showBanner('Devto', 'Browse and Search Dev.to Posts from Command Line', 'white');
        postBookmarkPrompt();
    })

program
    .command("search <keyword>")
    .alias("s")
    .action(async (keyword) => {
        await showBanner('Devto', 'Browse and Search Dev.to Posts from Command Line', 'white');
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
    .action(async (username, cmd) => {
        await showBanner('Devto', 'Browse and Search Dev.to Posts from Command Line', 'white');
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
program.arguments('<command>').action(async cmd => {
    await showBanner('Devto', 'Browse and Search Dev.to Posts from Command Line', 'white'); 
	program.outputHelp();
	console.log(`  ` + chalk.red(`\n  Unknown command ${chalk.yellow(cmd)}.`));
	console.log();
	suggestCommands(cmd);
	process.exit(1);
});

program.parse(process.argv);

if (program.args.length === 0) {
    (async () => {
        await showBanner('Devto', 'Browse and Search Dev.to Posts from Command Line', 'white');
        countdown.start();
        crawler.fetchHome().then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            postPrompt();
        })
    })();
}