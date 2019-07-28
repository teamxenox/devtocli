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

// Types of Messages
const primaryMsg     = chalk.bold.bgHex(primary).hex(light);
const secondaryMsg   = chalk.bold.bgHex(secondary).hex(light);
const successMsg     = chalk.bold.bgHex(success).hex(light);
const infoMsg        = chalk.bold.bgHex(info).hex(light);
const errorMsg       = chalk.bold.bgHex(danger).hex(light);
const warningMsg     = chalk.bgHex(warning).hex(dark);
const darkMsg        = chalk.bold.bgHex(dark).hex(light);

/**
 * This is a function to display logs in terminal.
 * @param {string} text - Text to display in the terminal
 * @param {string} type - Define the type of log
 * @returns {null} null
 */

function Log(text, type) {
    switch(type.toLowerCase()) {
        case "primary":
            console.log(primaryMsg(text));
            break;
        case "secondary":
            console.log(secondaryMsg(text));
            break;
        case "success":
            console.log(successMsg("Success:", text));
            break;
        case "info":
            console.info(infoMsg("Info:", text));
            break;
        case "error":
            console.error(errorMsg("Error:", text));
            break;
        case "warning":
            console.log(warningMsg("Warning:", text));
            break;
        case "dark":
            console.log(darkMsg(text));
            break;
    }
}

exports.Log = Log;