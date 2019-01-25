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
 * @param {string} url - url of article to fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchArticle =(url)=>{
    return xray(url, '#article-body | trim').then(data=>console.log(data));
} 

module.exports = { fetchHome , fetchArticle , fetchByTags};