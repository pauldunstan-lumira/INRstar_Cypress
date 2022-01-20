//glue code for steps
import {When, Then, And} from 'cypress-cucumber-preprocessor/steps'

//Click the hamburger menu
When('I click the hamburger menu', () =>{
    cy.get('[id=button_navbar_menubutton]').click()
});
//Click a menu option
Then('I click the {string}', (menuOption) =>{
    const buildString = 'link_menu_' + menuOption
    cy.get('[id='+buildString.replace(' ','')+']').click()
});
//Confirm the iframe has loaded from the hamburger
And('the iframe {string} has loaded', (header) =>{
    cy.wait(2000)
    cy.get('iframe').iframe(() => {
            cy.contains(header)
          })
});