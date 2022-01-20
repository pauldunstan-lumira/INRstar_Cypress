describe ('Login to engage', function (){
    it('Load site and login', function () {
        //Wait for page to load
        cy.server()
        cy.intercept('GET', '**/healthstatus**')
        .as('healthstatus')
        cy.visit('https://engage-it-test1.caresolutions.lumiradx.com/')
        cy.wait('@healthstatus').its('response.statusCode')
        .should('equal', 200)
        //Still getting a disconnect from DOM error so adding stupid wait
        cy.wait(1000)
        //Enter email address
        cy.get('[id=input_signintab_emailaddress]')
        .type('psd.lumira+gress2@gmail.com')
        .should('have.value', 'psd.lumira+gress2@gmail.com')
        //Enter password
        cy.get('[id=input_signintab_password]')
        .type('INRstar_5')
        //Click logon button
        cy.get('[id=button_signintab_signin]').click()
        //Wait for logon to finish
        cy.server()
        cy.intercept('GET', '**/tasks**').as('tasks')
        cy.wait('@tasks').its('response.statusCode', {requestTimeout: 80000})
        .should('equal', 200)
        //Click hamburger menu once loaded
        cy.get('[id=button_navbar_menubutton]').click()
        //Click end user license agreement link
        cy.get('[id=link_menu_licenseagreement]').click()
        //wait for iframe to load
        cy.wait(2000)
        //get iframe
        cy.get('iframe').iframe(() => {
            // Targets the cookies pop up within the iframe element
            cy.contains('Accept All').click()
            cy.contains('Contratti di licenza')
          })
        //Click hamburger menu once loaded
        cy.get('[id=button_navbar_menubutton]').click()
        //Click privacy policy link
        cy.get('[id=link_menu_privacypolicy]').click()
        //wait for iframe to load
        cy.wait(2000)
        //get iframe
        cy.get('iframe').iframe(() => {
            cy.contains('Documenti legali')
          })
    })
})