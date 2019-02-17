#! /usr/bin/env node

const program = require('commander');
const opn = require('opn');
const chalk = require('chalk');

const crawler = require('./util/crawler');
const countdown = require('./util/spinner');
const prompt = require('./util/prompt');

const log = console.log;
const title = chalk.yellow;
const body = chalk.green;

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

/**
 * This is a function to display name and description of author.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showNameAndDesc = (profile) => {
    log(title('name'))
    log(body(profile.name));
    log(title('\ndescription'))
    log(body(`${profile.desc}\n`));
}

/**
 * This is a function to display author profile details such as email,work,location,etc.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showUserDetails = (profile) => {
    profile.field.forEach((field, index) => {
        log(title(field));
        log(body(`${profile.value[index]}\n`));
    });
}

/**
 * This is a function to display the links of the author mentioned in profile.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showLinks = (profile) => {
    log(title('links'));
    profile.links.forEach(link => {
        log(body(link));
    });
}

/**
 * This is a function to display the details in sidebar such as skills/languages, projects and hacks, etc.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showSidebarDetails = (profile) => {
    log('');
    profile.sidebarHeader.forEach((header, index) => {
        log(title(header));
        log(body(`${profile.sidebarBody[index]}\n`));
    });
}

/**
 * This is a function to display stats such as posts published, comments written, tags followed.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showStats = (profile) => {
    log(title('stats'));
    profile.stats.forEach(stat => {
        log(body(stat));
    });
}

/**
 * This is a driver function to call all the above functions that display profile details on terminal.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showUserProfile = (username) => {
    crawler.fetchAuthorProfile(username).then((profile) => {
        if (!profile.name) {
            console.error("😱 User not found. Please try again.");
            process.exit(1);
        }
        showNameAndDesc(profile);
        showUserDetails(profile);
        showLinks(profile);
        showSidebarDetails(profile);
        showStats(profile);
    });
}

program
    .version('1.3.6')

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
    .option("-p, --profile", "Show author profile")
    .alias("a")
    .action((username, cmd) => {
        if (cmd.profile) {
            showUserProfile(username);
        } else {
            countdown.start();
            crawler.fetchByAuthor(username).then(data => {
                countdown.stop();
                articles = data.filter(data => data.title != undefined);
                prompt.showPosts(articles.map(data => data.title)).then(answers => {
                    openLink(answers);
                });
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
        prompt.showPosts(articles.map(data => data.title)).then(answers => {
            openLink(answers);
        });
    })
}