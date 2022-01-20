//glue code for steps
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'
import { parse } from 'querystring';
import { Settings, DateTime } from "luxon";

//Open supplied web URL from scenario and check it has loaded
Given('the user opens the INRstar url supplied in {string} and the page has loaded', (file) => {
        cy.fixture(file).then(data => {
                //set timezone
                cy.stubBrowserTimezone(data.timeZone)
                //Open and load INRstar login page
                cy.INRstar_login_page_has_loaded(data.url)
        })
});

//enter username from file
When('the user enters their username supplied in {string}', (file) => {
        cy.fixture(file).then(data => {
                cy.enter_username_and_confirm(data.username)
        })
});

//Enter a password
And('the user enters the password supplied in {string} into the password section', (file) => {
        cy.fixture(file).then(data => {
                cy.enter_password_and_confirm(data.password)
        })
});

//Click the Sign In button
And('the user clicks the Login button', () => {
        cy.get('#LoginButton').click()
});

//Check the home page has loaded and clear any email or warning pop up
Then('the home page has loaded', () => {
        //clear out of date client error
        cy.get('[aria-labelledby="ui-dialog-title-modalDialogBox"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > .ui-button > .ui-button-text').click();
        //clear the email pop up
        cy.get('[aria-labelledby="ui-dialog-title-modalDialogBox"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1) > .ui-button-text').click();
})