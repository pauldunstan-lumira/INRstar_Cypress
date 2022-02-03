// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-mochawesome-reporter/register'

Cypress.Screenshot.defaults({
    capture: 'runner',
    trashAssetsBeforeRuns: true,
    "video": false
  })
    
  afterEach(function () {
    cy.screenshot(this.currentTest.title + '_final'); // for test evidence
    //cy.writeFile('cypress/fixtures/test_run_log.csv', Cypress.config('tags') + ' Test Evidence ' + this.currentTest.title + '|', {flag: "a+"})
  })

// Alternatively you can use CommonJS syntax:
// require('./commands')
