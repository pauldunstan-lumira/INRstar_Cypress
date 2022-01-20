//glue code for steps
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'
import { parse } from 'querystring';
import { Settings, DateTime } from "luxon";

//Open supplied web URL from scenario and check it has loaded
Given('the user opens the url supplied in {string} and the page has loaded', (file) => {
        cy.fixture(file).then(data => {
                //set timezone
                cy.stubBrowserTimezone(data.timeZone)
                //Using both the spinner and healthstatus to ensure the page has fully loaded
                cy.engage_login_page_has_loaded(data.url)
        })
});

//Enter a password
And('the user enters the password supplied in {string} into the password section', (file) => {
        cy.fixture(file).then(data => {
                cy.enter_password_and_confirm(data.password)
        })
});

//Click the Sign In button
And('the user clicks the Sign In button', () => {
        cy.get('[id=button_signintab_signin]').click()
});

//Check the landing page has loaded
Then('the landing page has loaded', () => {
        //cy.server()
        cy.intercept('GET', '**/tasks**').as('tasks')
        cy.wait('@tasks').its('response.statusCode', { requestTimeout: 80000 })
                .should('equal', 200)
})

//Check the header of the loaded page contains
And('the header of the web page is {string}', (header) => {
        const test = 'navigation_navbar_title_' + header
        cy.get('[id=' + test.toLowerCase().replace(' ', '').replace(' ', '') + ']')
                //.contains(header);
                .should('contain', header);
});

//Invalid Login pop up checker
Then('the {string} popup is displayed', (header) => {
        Cypress.on('uncaught:exception', (err, runnable, promise) => {
                // when the exception originated from an unhandled promise
                // rejection, the promise is provided as a third argument
                // you can turn off failing the test in this case
                if (promise) {
                        return false
                }
                // we still want to ensure there are no other unexpected
                // errors, so we let them fail the test
        })
        cy.get('.PopUp__Container--2uShF', { timeout: 1000 })
                .should('contain', header);
});

//click the OK button on Invalid Login pop up
And('the user clicks the OK button', () => {
        cy.get('[id=button_popup_ok]').click()
});

//click tab on engage login screen
When('the user clicks the {string} tab', (tab) => {
        const link = 'button_loginleftpanel_' + tab
        cy.get('[id=' + link + ']').click()
});

//click link on engage login page
When('the user clicks the {string} hyperlink', (hyperlink) => {
        const link = 'link_signintab_' + hyperlink
        cy.get('[id=' + link + ']').click()
});

//enter email from file
When('the user enters their email supplied in {string}', (file) => {
        cy.fixture(file).then(data => {
                cy.enter_email_and_confirm(data.email)
        })
});
And('the user enters their email supplied in {string}', (file) => {
        cy.fixture(file).then(data => {
                cy.enter_email_and_confirm(data.email)
        })
});

//enter DOB into Register tab from file
And('the user enters their DOB supplied in {string}', (file) => {
        cy.fixture(file).then(data => {
                //break down DOB
                cy.enter_DOB_in_date_picker(data.DOB, data.timeZone);
        });
});

//click the 'Send me an engage ID code' button
And('the user clicks the send me a code button', () => {
        cy.get('button[class="RegisterTab__SendBtn--_COts"]').click()
});

//Full login flow for engage using passed in url, email and password
Given('the user has logged into the url using the details supplied in {string}', (file) => {
        cy.fixture(file).then(data => {
                //set timezone
                cy.stubBrowserTimezone(data.timeZone)
                cy.visit(data.url)
                //Using both the spinner and healthstatus to ensure the page has fully loaded
                cy.engage_login_page_has_loaded(data.url)
                //Enter email address
                cy.enter_email_and_confirm(data.email)
                //Enter password
                cy.enter_password_and_confirm(data.password)
                //Click logon button
                cy.get('[id=button_signintab_signin]').click()
                //Wait for logon to finish
                cy.intercept('GET', '**/tasks**').as('tasks')
                cy.wait('@tasks').its('response.statusCode', { requestTimeout: 80000 })
                        .should('equal', 200)
        })
});

//Need to look at moving these steps to another steps file, need to update setting in package.json for nonGlobalStepDefinitions

//Click the hamburger menu
When('the user clicks the hamburger menu', () => {
        cy.get('[id=button_navbar_menubutton]').click()
});
//Click a menu option
Then('the user clicks the {string}', (menuOption) => {
        const buildString = 'link_menu_' + menuOption
        cy.get('[id=' + buildString.replace(' ', '') + ']').click()
});
//Confirm the iframe has loaded from the hamburger
And('the iframe {string} has loaded', (header) => {
        cy.wait(3000)
        //try to add wait in get rather than above wait
        cy.get('iframe').iframe(() => {
                cy.contains(header)
                cy.should('contain', header);
        })
});

//Open gmail account and check top email used module npm install --save-dev gmail-tester
Then('the user checks the email account for the password code', () => {
        //const incoming_mailbox = `test+${test_id}@gmail.com`;
        //wait for email to come through
        //cy.wait(5000)
        var ten_seconds_ago = DateTime.now().minus(10, 'seconds');
        const incoming_mailbox = 'psd.lumira@gmail.com';
        //const today = new Date(new Date(Date.now() - 8.64e7).toDateString());
        cy.task('gmail:get-messages', {
                options: {
                        //from: 'ac-support@lumiradx.com',
                        //to: incoming_mailbox,
                        subject: 'Your INRstar engage code',//changing to 'Your INRstar engage code' with the new rebranding only UK for now
                        //before: new Date(Date.now() - 8.64e7)
                        after: ten_seconds_ago,
                        wait_time_sec: 10, // Poll interval (in seconds).
                        max_wait_time_sec: 30, // Maximum poll time (in seconds), after which we'll giveup.
                        include_body: true
                }
        })
                .then(email => {
                        assert.isNotNull(
                                email, `Email was not found`
                        );
                        assert.isAtLeast(
                                email.length,
                                1,
                                "Expected to find at least one email, but none were found!"
                        );
                        //take the body of the last email and pass into content variable 
                        const content = email[0].body.html;
                        assert.isTrue(
                                content.indexOf('Your code is:')
                                >= 0,
                                "Found reset code"
                        );
                });
});

//Get the password reset code from the latest email and reset the password
Then('the user resets the password from the email with the details in {string}', (file) => {
        //wait for email to be recieved
        cy.fixture(file).then(data => {
                var ten_seconds_ago = DateTime.now().minus(10, 'seconds');
                cy.get_email_verification_code_and_enter(data.email_address, data.email_subject, ten_seconds_ago, data.popup1, data.popup2);
                let newPassword = data.newPassword
                cy.get('input[type="password"]').then(els => {
                        [...els].forEach(el => cy.wrap(el).type(newPassword));
                });
        })
        //click the reset password button
        cy.get('[id=button__engage_passwordsignin_submit]')
                .click()
});


And('the user logs in with the new password supplied in {string}', (file) => {
        cy.fixture(file).then(data => {
                //Clear the password reset popup
                cy.get('[id=button_popup_ok]').click()
                cy.get('[id=information_' + data.popup2 + ']', { timeout: 10000 }).should("not.exist");
                cy.get('[id=information_' + data.popup1 + ']', { timeout: 10000 }).should("not.exist");
                //enter the password
                cy.enter_password_and_confirm(data.newPassword)
                //click the sign in button
                cy.get('button[type="submit"]').click()
                //Check the landing page has loaded
                cy.intercept('GET', '**/tasks**').as('tasks')
                cy.wait('@tasks').its('response.statusCode', { requestTimeout: 80000 })
                        .should('equal', 200)
        })
})

And('the user resets the password back to the original one supplied in {string}', (file) => {
        //check engage is loaded by checking the hamburger menu is displayed
        cy.get('[id=button_navbar_menubutton]', { timeout: 10000 }).should('be.visible')
                .click()
        //Logout of engage
        cy.get('[class=Menu__Signout--1VTf3]', { timeout: 10000 }).should('be.visible')
                .click()
        //wait for login page to load
        //Using both the spinner and healthstatus to ensure the page has fully loaded
        cy.intercept('GET', '**/healthstatus**')
                .as('healthstatus')
        //wait for spinner to load
        cy.get('#loader_spinner', { timeout: 10000 }).should('be.visible')
        cy.wait('@healthstatus').its('response.statusCode')
                .should('equal', 200)
        //wait for spinner to disappear - page loaded
        cy.get('#loader_spinner', { timeout: 10000 }).should('not.be.visible')
        cy.get('[id=link_signintab_forgotpassword]', { timeout: 10000 }).should('be.enabled')
                .click()
        //enter email and DOB
        cy.fixture(file).then(data => {
                cy.enter_email_and_confirm(data.email)
                //break down DOB
                cy.enter_DOB_in_date_picker(data.DOB, data.timeZone);
                //click the submit button
                cy.get('button[class="RegisterTab__SendBtn--_COts"]').click()
                var ten_seconds_ago = DateTime.now().minus(10, 'seconds');
                cy.get_email_verification_code_and_enter(data.email_address, data.email_subject, ten_seconds_ago, data.popup1, data.popup2)
                //enter new password and confirmation
                cy.fixture(file).then(data => {
                        let newPassword = data.password
                        cy.get('input[type="password"]').then(els => {
                                [...els].forEach(el => cy.wrap(el).type(newPassword));
                        });
                })
                //click the reset password button
                cy.get('[id=button__engage_passwordsignin_submit]')
                        .click()
                //clear the pop up dialogue
                cy.get('[id=button_popup_ok]', { timeout: 1000 }).click()
        });
})

When('the user clicks the {string} tile', (tile) => {
        cy.get('.TileBox__TileContainer--2EEWt')
        cy.contains(tile)
                .click();
})

And('the user populates INR questionnaire answers', () => {
        //select the INR from dropdown
        cy.get('[id=153057a7-86d4-427a-b99b-828d208acea4]')
                .select('2.1')
        //does the INR match the meter question YES answer
        cy.get(':nth-child(4) > .question__question--182dN > #question_radio_objectobject_ > .question__answer--22ELX > .radio__container--2swMN > :nth-child(1) > .radio__checkmark--1CugE')
                .click()
        //select the daily dose from dropdown
        cy.get('[id=b33afcb7-98e0-49a0-a60f-fef79287224d]')
                .select('2.0')
        //any changes to medication question NO answer
        cy.get(':nth-child(6) > .question__question--182dN > #question_radio_objectobject_ > .question__answer--22ELX > .radio__container--2swMN > :nth-child(2) > .radio__checkmark--1CugE')
                .click()
        //any bleeding symptoms question NO answer
        cy.get(':nth-child(7) > .question__question--182dN > #question_radio_objectobject_ > .question__answer--22ELX > .radio__container--2swMN > :nth-child(2) > .radio__checkmark--1CugE')
                .click()
        //missed any doses question NO answer
        cy.get(':nth-child(8) > .question__question--182dN > #question_radio_objectobject_ > .question__answer--22ELX > .radio__container--2swMN > :nth-child(2) > .radio__checkmark--1CugE')
                .click()
        //enter comments
        cy.get('[class=TextArea__textarea--1fTID]')
                .type('Comments for my clinician')
})

Then('submit the INR questionnaire', () => {
        cy.get('#button__engage_home_anticoagulation_questionnaire_submit')
                .click()
        //confirm INR test complete popup
        Cypress.on('uncaught:exception', (err, runnable, promise) => {
                // when the exception originated from an unhandled promise
                // rejection, the promise is provided as a third argument
                // you can turn off failing the test in this case
                if (promise) {
                        return false
                }
                // we still want to ensure there are no other unexpected
                // errors, so we let them fail the test
        })
        //added wait to allow popup to load before get
        //cy.wait(1000)
        cy.get('[id=information_inrtestcomplete]', { timeout: 1000 })
                //.contains('INR Test Complete');
                .should('contain', 'INR Test Complete')
})

Given('the user has logged into url using email and password from file', () => {
        cy.fixture('Login.json').then(data => {
                //load url from json file in cypress\fixtures
                //set timezone
                cy.stubBrowserTimezone(data.timeZone)
                //wait for page to load
                cy.engage_login_page_has_loaded(data.url)
                //click the sign in tab
                cy.get('#button_loginleftpanel_signin', { timeout: 10000 }).click();
                //enter email address from json file in cypress\fixtures
                cy.enter_email_and_confirm(data.email)
                //enter password from json file in cypress\fixtures
                cy.enter_password_and_confirm(data.password)
                //Click the Sign In button
                cy.get('[id=button_signintab_signin]').click()
                //Check the landing page has loaded
                cy.intercept('GET', '**/tasks**').as('tasks')
                cy.wait('@tasks').its('response.statusCode', { requestTimeout: 80000 })
                        .should('equal', 200)
        })
})

Given('the user has logged into url using email and password from {string}', (file) => {
        cy.fixture(file).then(data => {
                //set timezone
                cy.stubBrowserTimezone(data.timeZone)
                //load url from json file in cypress\fixtures
                //wait for page to load 
                cy.engage_login_page_has_loaded(data.url)
                //click the sign in tab
                cy.get('#button_loginleftpanel_signin', { timeout: 10000 }).click();
                //enter email address from json file in cypress\fixtures
                cy.enter_email_and_confirm(data.email)
                //enter password from json file in cypress\fixtures
                cy.enter_password_and_confirm(data.password)
                //Click the Sign In button
                cy.get('[id=button_signintab_signin]').click()
                //Check the landing page has loaded
                cy.intercept('GET', '**/tasks**').as('tasks')
                cy.wait('@tasks').its('response.statusCode', { requestTimeout: 80000 })
                        .should('equal', 200)
        })
})