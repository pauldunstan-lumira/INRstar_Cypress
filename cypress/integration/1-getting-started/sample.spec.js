// const getIframeDocument = () => {
//     return cy
//     .get('iframe[data-cy="app-root"]')
//     // Cypress yields jQuery element, which has the real
//     // DOM element under property "0".
//     // From the real DOM iframe element we can get
//     // the "document" element, it is stored in "contentDocument" property
//     // Cypress "its" command can access deep properties using dot notation
//     // https://on.cypress.io/its
//     .its('0.contentDocument').should('exist')
//   }
  
//   const getIframeBody = () => {
//     // get the document
//     return getIframeDocument()
//     // automatically retries until body is loaded
//     .its('body').should('not.be.undefined')
//     // wraps "body" DOM element to allow
//     // chaining more Cypress commands, like ".find(...)"
//     .then(cy.wrap)
//   }

describe ('My First Test', function (){
    it('Visit site and login', function () {
        //Disable ChromeWebSecurity for iframe use in engage
        Cypress.config('chromeWebSecurity', false)
        //Wait for page to load
        cy.server()
        cy.intercept('GET', '**/healthstatus**').as('healthstatus')
        cy.visit('https://engage-it-test1.caresolutions.lumiradx.com/')
        cy.wait('@healthstatus').its('response.statusCode', {requestTimeout: 10000}).should('equal', 200)
        //Still getting a disconnect from DOM error so adding stupid wait
        cy.wait(1000)
        //Enter email address
        cy.get('[id=input_signintab_emailaddress]')
        .type('psd.lumira+gress2@gmail.com').should('have.value', 'psd.lumira+gress2@gmail.com')
        //Enter password
        cy.get('[id=input_signintab_password]')
        .type('INRstar_5')
        //Click logon button
        cy.get('[id=button_signintab_signin]').click()
        //Wait for logon to finish
        cy.server()
        cy.intercept('GET', '**/tasks**').as('tasks')
        cy.wait('@tasks').its('response.statusCode', {requestTimeout: 80000}).should('equal', 200)
        //cy.wait(1000)
        //Click hamburger menu once loaded
        cy.get('[id=button_navbar_menubutton]').click()
        //Click end user license agreement
        cy.get('[id=link_menu_licenseagreement]').click()
        //License loads - check for cookies option
        cy.wait(5000)
        //cy.getIframeBody()
        //cy.getIframe('in_iframe')
        //getIframeBody('[id=app-root]')//.find('[id=app-root]')
        //window.postMessage('[id=app-root]')
        //cy.get('[id=app-root]')
        //cy.get('[id=app-root]').iframe('.section-hero__content font-brand__blue').should('exist')
        cy.iframeSelector()
        
    })
})

const getIframeBody = (iframeSelector) => {
    // get the iframe > document > body
    // and retry until the body element is not empty
    return cy
    .get(iframeSelector)
    .its('0.contentDocument.body').should('not.be.empty')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    // https://on.cypress.io/wrap
    .then(cy.wrap)
  }