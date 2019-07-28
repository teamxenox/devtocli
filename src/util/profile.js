'use strict';

const chalk = require('chalk');

const { Log } = require('./chalkExtra');

const log = console.log;
const title = chalk.yellow;
const body = chalk.green;

/**
 * This is a function to display name and description of author.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showNameAndDesc = (profile) => {
    Log('name', 'primary');
    Log(profile.name, 'secondary');
    Log('\ndescription', 'primary');    
    Log(`${profile.desc}\n`, 'secondary');
}

/**
 * This is a function to display author profile details such as email,work,location,etc.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showAuthorInfo = (profile) => {
    profile.field.forEach((field, index) => {
        Log(field, 'primary');
        Log(`${profile.value[index]}\n`, 'secondary');
    });
}

/**
 * This is a function to display the links of the author mentioned in profile.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showLinks = (profile) => {
    Log('links', 'primary');
    profile.links.forEach(link => {
        Log(link, 'secondary');
    });
}

/**
 * This is a function to display the details in sidebar such as skills/languages, projects and hacks, etc.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showSidebarDetails = (profile) => {
    log('');
    Log('', 'dark');
    profile.sidebarHeader.forEach((header, index) => {
        Log(header, 'primary');
        Log(`${profile.sidebarBody[index]}\n`, 'secondary')
    });
}

/**
 * This is a function to display stats such as posts published, comments written, tags followed.
 * @param {Object} profile - profile of the author
 * @returns {null} null
 */

const showStats = (profile) => {
    Log('stats', 'primary');
    profile.stats.forEach(stat => {
        Log(stat, 'secondary');
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