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
module.exports = { fetchHome };