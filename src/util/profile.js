'use strict';

const chalk = require('chalk');

const log = console.log;
const title = chalk.yellow;
const body = chalk.green;

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

const showAuthorInfo = (profile) => {
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
 * This is a driver function call the above the functions that display profile details of author.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showProfile = (profile) => {
    showNameAndDesc(profile);
    showAuthorInfo(profile);
    showLinks(profile);
    showSidebarDetails(profile);
    showStats(profile);
}

module.exports = showProfile;