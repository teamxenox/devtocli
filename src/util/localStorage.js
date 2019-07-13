'use strict';

const fs = require('fs');

/**
 * This is a function to initialize the bookmark JSON file
 * @param {null} null
 * @returns {null} null
 */
const initBookmark = () => {
    let emptyBookmark = {
        bookmarks: []
    };

    try{
        fs.writeFileSync('.bookmarks.json', JSON.stringify(emptyBookmark));
    }catch(err) {
        throw new Error('unexpected error occurred :(');
    }
}

/**
 * This is a function to read the saved bookmark if available
 * or else initialize it
 * @param {null} null
 * @returns {Object<Array>} JSON object with bookmark array list
 */

const readBookmark = () => {
    try{
        return JSON.parse(fs.readFileSync('.bookmarks.json'));
    }catch(err) {
        if(err.code === 'ENOENT') {
            initBookmark();
            return JSON.parse(fs.readFileSync('.bookmarks.json'));
        } else {
            throw new Error('unexpected error occurred :(');
        }
    }
}

/**
 * This is a function to add the selected post as the new 
 * bookmark to the local bookmark storage
 * @param {Object<title, link>} selectedPost 
 * @returns {null} null
 */

const addBookmark = (selectedPost) => {
    let bookmark = readBookmark();

    bookmark.bookmarks.push({
        title: selectedPost.title,
        link: selectedPost.link
    });

    fs.writeFileSync('.bookmarks.json', JSON.stringify(bookmark));       
}

module.exports = {
    readBookmark,
    addBookmark
};
