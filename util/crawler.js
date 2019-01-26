'use strict';

// Native import
const Xray = require('x-ray');

//Global Variable
const xray = Xray({
    filters: {
      trim: function (value) {
        return typeof value === 'string' ? value.trim() : value
      }
    }
  });

/**
 * This is a function to fetch home feed of `dev.to` using the `x-ray` module.
 * @param {null} null
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchHome =()=>{
    return xray('https://dev.to', '#substories .single-article', [{
        title: '.index-article-link .content h3 | trim',
        author: 'h4 a | trim',
        link:'.index-article-link@href',
        tag:['.tags .tag | trim']
      }]);
} 

/**
 * This is a function to fetch feed by tags of `dev.to` using the `x-ray` module.
 * @param {string} tag - Tag by which articles will be fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchByTags =(tag)=>{
    return xray('https://dev.to/t/'+tag, '#substories .single-article', [{
        title: '.index-article-link .content h3 | trim',
        author: 'h4 a | trim',
        link:'.index-article-link@href',
        tag:['.tags .tag | trim']
      }]);
} 

/**
 * This is a function to fetch Article from link.
 * @param {string} null 
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchArticle =(url)=>{
    return xray(url, '#article-body | trim').then(data=>console.log(data));
} 

/**
 * This is a function to fetch all poplar tags from dev.to.
 * @param {null} url - url of article to fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchTags=()=>{
  return xray('https://dev.to/tags', ['.articles-list .tag-list-container h2'])
    .then(data=>data.map(data=>data.split("#")[1]));
} 

/**
 * This is a function to Search posts on `dev.to` by keyword.
 * @param {string} keyword - Sear of article to fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const searchPost=(keyword)=>{
  // return xray('https://dev.to/search?q='+keyword+'&filters=class_name:Article','#substories .single-article', [{
  //   title: '.index-article-link .content h3 | trim',
  //   link:'.index-article-link@href',
  // }])
  return xray('https://dev.to/search?q='+keyword+'&filters=class_name:Article','body')
} 

module.exports = { fetchHome , fetchArticle , fetchByTags, fetchTags, searchPost};