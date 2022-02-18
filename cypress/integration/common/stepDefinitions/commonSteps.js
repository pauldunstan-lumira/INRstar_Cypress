//glue code for steps
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'
import { faker } from '@faker-js/faker';
import { parse } from 'querystring';
import { Settings, DateTime } from "luxon";
//import { faker } from 'faker-js/faker';

//Open supplied web URL from scenario and check it has loaded
Given('the user opens the INRstar url supplied in {string} and the page has loaded', (file) => {
        cy.fixture(file).then(data => {
                //set timezone
                cy.stubBrowserTimezone(data.timeZone)//not really needed
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
});

Given('the user logs into INRstar with detais in {string}', (file) => {
        cy.fixture(file).then(data => {
                //set timezone
                cy.stubBrowserTimezone(data.timeZone)//not really needed
                //Open and load INRstar login page
                cy.login_to_INRstar(data.url, data.username, data.password)
        })
});

When('the user adds a new patient for region from {string}', (file) =>{
        cy.fixture(file).then(data => {
                cy.add_new_patient(data.region);
        })
});

Then('the user adds a new treatment plan from detais in {string}', (file) => {
        cy.fixture(file).then(data => {
                cy.add_new_treatment_plan(data.drug, data.algorithm, data.dosingMethod);
        })
})

Given('the user logs into INRstar UTD with detais in {string}', (file) => {
        cy.fixture(file).then(data => {
                cy.fixture(file).then(data => {
                        //set timezone
                        cy.stubBrowserTimezone(data.timeZone)//not really needed
                        //Open and load INRstar login page
                        //cy.login_to_INRstar_under_the_hood(data.url, data.username, data.password)
                        cy.create_patient_in_INRstar_under_the_hood(data.url, data.username, data.password);
                        //select plan start date

                })
        })
});