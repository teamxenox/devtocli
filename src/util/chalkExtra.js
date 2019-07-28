/*
 * This File will Handle a set of functions for remove the complexity or verbosity of
 ** Console.log( chalk.background.foreground( "Long String Text" ) );
 */

'use strict';

const chalk = require('chalk');

// Types of Logs
const normal = console.log;
const error = console.error;
const info = console.info;
const warning = console.warn;

// Bootstrap Colors Template
const primary = "#007bff", secondary = '#6c757d', success = '#28a745', info = '#17a2b8', warning = '#ffc107', danger = '#dc3545', light = '#f8f9fa', dark = '#343a40';

function Log(text, type) {

}

exports.Log = Log;