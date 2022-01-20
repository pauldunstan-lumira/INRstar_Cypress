// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('getIframe', (iframe) => {
    return cy.get(iframe)
        .its('0.contentDocument.body')
        .should('be.visible')
        .then(cy.wrap);
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => { }) => {
    // For more info on targeting inside iframes refer to this GitHub issue:
    // https://github.com/cypress-io/cypress/issues/136
    cy.log('Getting iframe body')

    return cy
        .wrap($iframe)
        .should(iframe => expect(iframe.contents().find('body')).to.exist)
        .then(iframe => cy.wrap(iframe.contents().find('body')))
        .within({}, callback)
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('switchToIframe', (iframe) => {
    return cy
        .get(iframe)
        .its('0.contentDocument.body')
        .should('be.visible')
        .then(cy.wrap);
});
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('stubBrowserTimezone', (timeZone) => {
    return new Promise((resolve) => {
        return resolve(
            Cypress.automation("remote:debugger:protocol", {
                command: "Emulation.setTimezoneOverride",
                params: {
                    timezoneId: timeZone
                }
            })
        )
    })
});
//-------------------------------------------------------------------------------------------------------------------
//INRSTAR
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('INRstar_login_page_has_loaded', (url) => {
    cy.visit(url)
    cy.get('#LoginButton', { timeout: 10000 }).should('be.enabled')
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('enter_username_and_confirm', (username) => {
    cy.get('#Username')
    .type(username)
    //add check to make sure the data is displayed
    .should('have.value', username)
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('enter_password_and_confirm', (password) => {
    cy.get('#Password')
    .type(password)
    //add check to make sure the data is displayed
    .should('have.value', password)
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('enter_DOB_in_date_picker', (DOB, timeZone) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const itMonths = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicenbre']
    const arDate = DOB.split('/');
    let dateYear = arDate[0];
    let dateDay = arDate[2];
    let dateMonth = arDate[1];
    //Click date pick box
    cy.get('input[type="text"]')
        .click()
    //Select month from drop down
    if (timeZone == 'Europe/Rome') {
        cy.get('[name="month"]').select(itMonths[dateMonth - 1])
    } else {
        cy.get('[name="month"]').select(months[dateMonth - 1])
    }
    //Select Year from drop down
    cy.get('[name="year"]').select(dateYear)
    //Select Day from loaded calendar
    cy.get('[class="DayPicker-Day"]')
        //.find(dateDay.replace(/\b0/g, '')).click();
        .each(($ele, index, $list) => {
            console.log($ele, index, $list)
            if ($ele.text() === dateDay.replace(/\b0/g, '')) {
                cy.wrap($ele).click();
            }
        })
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('engage_login_page_has_loaded', (url) => {
    //Using both the spinner and healthstatus to ensure the page has fully loaded
    cy.intercept('GET', '**/healthstatus**')
        .as('healthstatus')
    cy.visit(url)
    //wait for spinner to load
    cy.get('#loader_spinner', { timeout: 10000 }).should('be.visible')
    cy.wait('@healthstatus').its('response.statusCode')
        .should('equal', 200)
    //wait for spinner to disappear - page loaded
    cy.get('#loader_spinner', { timeout: 10000 }).should('not.be.visible')
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('enter_email_and_confirm', (email) => {
    cy.get('input[type="email"]')
    .type(email)
    //add check to make sure the data is displayed
    .should('have.value', email)
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('enter_password_and_confirm', (password) => {
    cy.get('input[type="password"]')
    .type(password)
    //add check to make sure the data is displayed
    .should('have.value', password)
})