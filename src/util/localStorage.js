'use strict';

const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.join(process.cwd(), '.bookmarks.json');

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
        fs.writeFileSync(STORAGE_PATH, JSON.stringify(emptyBookmark));
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
        return JSON.parse(fs.readFileSync(STORAGE_PATH));
    }catch(err) {
        if(err.code === 'ENOENT') {
            initBookmark();
            return JSON.parse(fs.readFileSync(STORAGE_PATH));
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

    fs.writeFileSync(STORAGE_PATH, JSON.stringify(bookmark));       
}

/**
 * This is a function to delete the selected bookmark
 * @param {Object<string>} selectedPostTitle 
 * @returns {null} null
 */
const deleteBookmark = (selectedPostTitle) => {
    let bookmark = readBookmark().bookmarks;
    bookmark.splice(bookmark.indexOf(bookmark.find(data => data.title === selectedPostTitle)), 1)
    fs.writeFileSync(STORAGE_PATH, JSON.stringify({bookmarks:bookmark}));      
}

module.exports = {
    readBookmark,
    addBookmark,
    deleteBookmark
};
