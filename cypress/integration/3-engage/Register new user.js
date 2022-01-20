describe ('Register new user to engage', function (){
    it('Load site', function () {
        //Wait for page to load
        cy.server()
        cy.intercept('GET', '**/healthstatus**')
        .as('healthstatus')
        cy.visit('https://engage-it-test1.caresolutions.lumiradx.com/')
        cy.wait('@healthstatus').its('response.statusCode')
        .should('equal', 200)
        //Still getting a disconnect from DOM error so adding stupid wait
        cy.wait(1000)
    })
    it('Register user', function(){
        const link = 'link_signintab_' + hyperlink
        cy.get('[id=button_loginleftpanel__register]').click()
    })
});
