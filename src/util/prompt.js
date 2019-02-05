'use strict';

// Native import
const inquirer = require('inquirer');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/**
 * This is a function to show autocomplete prompt for tag search
 * @param {Object<string>} tags - Tags fetched from dev.to
 * @returns {Promise} The promise with the tag choosen
 */

const searchTags = (tags) => {
    return inquirer.prompt([{
        type: 'autocomplete',
        name: 'tag',
        message: '🕵🏻‍♂️  Search popular tags:',
        pageSize: 4,
        source: function (answers, input) {
            return new Promise((resolve) => {
                resolve(tags.filter(data => data.indexOf(input) > -1))
            });
        }
    }])
}


/**
 * This is a function to show prompt for all fetched Posts
 * @param {Object<string>} titles - titles of fetched Posts
 * @returns {Promise} The promise with the post choosen
 */

const showPosts = (titles) => {
    return inquirer.prompt([{
        type: 'rawlist',
        name: 'title',
        message: '📚 Here are your posts:',
        choices: titles,
        paginated: true
    }])
}

module.exports = {
    showPosts,
    searchTags
};