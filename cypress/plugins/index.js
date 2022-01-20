/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const cucumber = require('cypress-cucumber-preprocessor').default;
const path = require('path');
const gmail_tester = require('../../node_modules/gmail-tester');
//const addContext = require('mochawesome/addContext');

//const gmail_tester = require("../../../gmail-tester-extended");
module.exports = (on, config) => {
  require('cypress-mochawesome-reporter/plugin')(on);
  
on('file:preprocessor', cucumber());
  
// `on` is used to hook into various events Cypress emits
// `config` is the resolved Cypress config


// ...adding to allow gmail api lookup
// module.exports = (on, config) => {
//   // `on` is used to hook into various events Cypress emits
//   // `config` is the resolved Cypress config

//   // ..THIS OPEN DEV TOOLS WHEN RUNNING TESTS - COMMENT OUT IF NOT NEEDED
  on('before:browser:launch', (browser = {}, launchOptions) => {
    // `args` is an array of all the arguments that will
    // be passed to browsers when it launches
    console.log(launchOptions.args); // print all current args
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // auto open devtools
      launchOptions.args.push('--auto-open-devtools-for-tabs');
      // allow remote debugging
      // launchOptions.args.push("--remote-debugging-port=9221");
      // whatever you return here becomes the launchOptions
    } else if (browser.family === 'firefox') {
      // auto open devtools
      launchOptions.args.push('-devtools');
    }
    return launchOptions;
  });
  on("task", {
    "gmail:get-messages": async args => {
      const messages = await gmail_tester.get_messages(
        path.resolve(__dirname, "credentials.json"),
        path.resolve(__dirname, "gmail_token.json"),
        args.options
      );
      return messages;
    },
    'gmail:check-inbox': async args => {
      const messages = await gmail_tester.check_inbox(
        path.resolve(__dirname, 'credentials.json'),
        path.resolve(__dirname, 'gmail_token.json'),
        args.options
      );
      return messages;
    }
  });
};