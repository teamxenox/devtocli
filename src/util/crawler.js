'use strict';

// Native import
const Xray = require('x-ray');
const algoliasearch = require('algoliasearch');
const client = algoliasearch('YE5Y9R600C', 'OTU1YjU5MWNlZTk1MjQ0YmExOTRjZmY4NDM2ZTM2YWZiYTM2ODA2NThhMzNjMDkzYTEzYjFmNDY0MDcwNjRkOHJlc3RyaWN0SW5kaWNlcz1zZWFyY2hhYmxlc19wcm9kdWN0aW9uJTJDVGFnX3Byb2R1Y3Rpb24lMkNvcmRlcmVkX2FydGljbGVzX3Byb2R1Y3Rpb24lMkNvcmRlcmVkX2FydGljbGVzX2J5X3B1Ymxpc2hlZF9hdF9wcm9kdWN0aW9uJTJDb3JkZXJlZF9hcnRpY2xlc19ieV9wb3NpdGl2ZV9yZWFjdGlvbnNfY291bnRfcHJvZHVjdGlvbiUyQ29yZGVyZWRfY29tbWVudHNfcHJvZHVjdGlvbg==');
const index = client.initIndex('searchables_production');

const { Log } = require('./util/chalkExtra');

//Global Variable
const xray = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    removeNewLine: function (value) {
      return value.replace(/\s\s+/g, ' ');
    }
  }
});

/**
 * This is a function to fetch home feed of `dev.to` using the `x-ray` module.
 * @param {null} null
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchHome = () => {
  return xray('https://dev.to', '#substories .single-article', [{
    title: '.index-article-link .content h3 | trim',
    author: 'h4 a | trim',
    link: '.index-article-link@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

/**
 * This is a function to fetch home feed of `dev.to` using the `x-ray` module.
 * @param {string} timeline - the time by which posts will be fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchTop = (timeline) => {
  return xray('https://dev.to/top/'+timeline, '#substories .single-article', [{
    title: '.index-article-link .content h3 | trim',
    author: 'h4 a | trim',
    link: '.index-article-link@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

/**
 * This is a function to fetch latest feed of `dev.to` using the `x-ray` module.
 * @param {null} null
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchLatest = () => {
  return xray('https://dev.to/latest/', '#substories .single-article', [{
    title: '.index-article-link .content h3 | trim',
    author: 'h4 a | trim',
    link: '.index-article-link@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}



/**
 * This is a function to fetch feed by tags of `dev.to` using the `x-ray` module.
 * @param {string} tag - Tag by which articles will be fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchByTags = (tag) => {
  return xray('https://dev.to/t/' + tag, '#substories .single-article', [{
    title: '.index-article-link .content h3 | trim',
    author: 'h4 a | trim',
    link: '.index-article-link@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

/**
 * This is a function to fetch posts by a author from `dev.to` using the `x-ray` module.
 * @param {string} username - username by which posts will be fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchByAuthor = (username) => {
  return xray('https://dev.to/' + username, '#substories .single-article', [{
    title: '.index-article-link .content h3 | trim',
    author: 'h4 a | trim',
    link: '.index-article-link@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

/**
 * This is a function to fetch profile details of a author from `dev.to` using the `x-ray` module.
 * @param {string} username - username by which the profile details of author will be fetched
 * @returns {Promise<Object>} The promise with profile details of author.
 */

const fetchAuthorProfile = (username) => {
  return xray('https://dev.to/' + username, 'body', {
    name: '.profile-details h1 span | trim',
    desc: '.profile-details p | trim',
    field: ['.key | trim'],
    value: ['.value | trim | removeNewLine'],
    links: ['.profile-details .social a@href'],
    sidebarHeader: ['.user-sidebar .widget header h4 | trim'],
    sidebarBody: ['.widget-body | trim'],
    stats: ['.sidebar-data div | trim']
  })
  .then(data => {
    return data;
  });
}

/**
 * This is a function to fetch Article from link.
 * @param {string} null 
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchArticle = (url) => {
  return xray(url, '#article-body | trim').then(data => Log(data, 'dark'));
}

/**
 * This is a function to fetch all poplar tags from dev.to.
 * @param {null} url - url of article to fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const fetchTags = () => {
  return xray('https://dev.to/tags', ['.articles-list .tag-list-container h2'])
    .then(data => data.map(data => data.split("#")[1]));
}

/**
 * This is a function to Search posts on `dev.to` by keyword.
 * @param {string} keyword - Keyword of article to fetched
 * @returns {Promise<Array>} The promise with data scrapped from webpage.
 */

const searchPost = (keyword) => {
  const searchObj = {
    hitsPerPage: 10,
    page: "0",
    queryType: "prefixNone",
    filters: "class_name:Article",
    attributesToRetrieve: [
      'title',
      'path'
    ],
    exactOnSingleWordQuery: "none",
  }

  return index.search(keyword, searchObj);

}

/**
 * This is a function to Take the tag from the post title.
 * @param {Array} posts - Posts to be edited
 * @returns {Array} edited post
 */
const formatTitle = (posts) => {
  return posts.map(post => {
    post.tag.forEach(tag => {
      if (post.title.indexOf(tag) > -1) post.title = post.title.split(tag)[1];
    })
    return post;
  });
}


module.exports = {
  fetchHome,
  fetchArticle,
  fetchByTags,
  fetchTags,
  searchPost,
  fetchByAuthor,
  fetchAuthorProfile,
  fetchTop,
  fetchLatest
};