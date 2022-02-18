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
//-------------------------------------------------------------------------------------------------------------------
//INRSTAR
//-------------------------------------------------------------------------------------------------------------------
//add faker so required data can be generated
const faker = require('@faker-js/faker');
//import custom commands
import './patient'
import './misc'
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
Cypress.Commands.add('login_to_INRstar', (url, username, password) => {
    cy.visit(url)
    cy.get('#LoginButton', { timeout: 10000 }).should('be.enabled')
    cy.get('#Username')
        .type(username)
        //add check to make sure the data is displayed
        .should('have.value', username)
    cy.get('#Password')
        .type(password)
        //add check to make sure the data is displayed
        .should('have.value', password)
    //click login button
    cy.get('#LoginButton').click()
    //clear out of date client error
    cy.get('[aria-labelledby="ui-dialog-title-modalDialogBox"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > .ui-button > .ui-button-text').click();
    //clear the email pop up
    cy.get('[aria-labelledby="ui-dialog-title-modalDialogBox"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > :nth-child(1) > .ui-button-text').click();
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('login_to_INRstar_under_the_hood', (url, username, password) => {
    //make sure session is logged out
    let logoutURL = url + 'Security/Authentication/LogOff'
    cy.visit({
        method: 'GET',
        url: logoutURL,
    })
    cy.request('GET', url)
    let rvt
    cy.get('[name="__RequestVerificationToken"]')
        .invoke('val')
        .then(value => {
            rvt = value;
            cy.log(rvt)
            cy.getCookies()
            let logonURL = url + 'Security/Authentication/LogOn'
            cy.request({
                method: 'POST',
                url: logonURL,
                form: true,
                body: {
                    Username: username,
                    Password: password,
                    __RequestVerificationToken: rvt
                }
            })
        });
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('create_patient_in_INRstar_under_the_hood', (url, username, password) => {
    //make sure session is logged out
    let logoutURL = url + 'Security/Authentication/LogOff'
    cy.visit({
        method: 'GET',
        url: logoutURL,
    })
    //Get session requestVerificationToken
    cy.request('GET', url)
    let rvt
    cy.get('[name="__RequestVerificationToken"]')
        .invoke('val')
        .then(value => {
            rvt = value;
            cy.log(rvt);
            cy.getCookies()
            let logonURL = url + 'Security/Authentication/LogOn'
            cy.request({
                method: 'POST',
                url: logonURL,
                form: true,
                body: {
                    Username: username,
                    Password: password,
                    __RequestVerificationToken: rvt
                }
            })
            //Get patient ID for new patient
            let newPatientURL = url + 'Patient/New'
            cy.request({
                method: 'GET',
                url: newPatientURL,
                form: true,
                body: {
                    Username: username,
                    Password: password,
                    __RequestVerificationToken: rvt
                }
            })
                //Get the patientId and requestVerificationToken from response body
                .its('body').then((body) => {
                    let newPatientGUID = body.match(/name="Id" type="hidden" value="([^"]*)/)[1];
                    let newRequestVerificationToken = body.match(/name="__RequestVerificationToken" type="hidden" value="([^"]*)/)[1];
                    //Add new patient using the above Id and requestVerificationToken
                    cy.generate_patient_data("Italian").as('patient').then((patient) => {

                        cy.log(newPatientGUID);
                        let insertURL = url + 'Patient/Insert'
                        cy.request({
                            method: 'POST',
                            url: insertURL,
                            form: true,
                            body: {
                                __RequestVerificationToken: newRequestVerificationToken,
                                ID: newPatientGUID,
                                Active: patient.active,
                                PatientNumber: patient.patientnumber,
                                Title: patient.title,
                                Surname: patient.familyname,
                                FirstName: patient.firstname,
                                Born: patient.dob_formatted_for_language,
                                Sex: patient.gender,
                                Gender: patient.gender,
                                FirstAddressLine: patient.address_line1,
                                FourthAddressLine: patient.address_line4,
                                FifthAddressLine: patient.address_line5,
                                Phone: patient.address_phone,
                                Email: patient.email,
                                externalResultId: ""
                            }
                        })
                            .then((resp) => {
                                expect(resp.status).to.eq(200)
                            })
                    })


                })
        })
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('add_new_patient', (language) => {
    //click the patient tab
    cy.get('#MainPatientLink').click();
    //click the add patient tab
    cy.get('#AddPatientDetailsTab').click();
    //enter patient data
    cy.generate_patient_data(language).as('patient').then((patient) => {
        cy.get('#PatientNumber').type(patient.patientnumber)
        let NHSNumber
        if (language == "Italian") {
            let gender_char = patient.gender.substring(0,1)
            
            cy.generate_fiscal_code(patient.firstname, patient.familyname, patient.dob, gender_char)
            .then(value => {
                NHSNumber = value
                cy.log("Fiscal Code to type: " + NHSNumber);
                cy.get('#NHSNumber').type(NHSNumber)
            })
        } else {
            cy.generate_NHS_Number()
            .then(value => {
                NHSNumber = value
                cy.log("NHSNumber to type: " + NHSNumber)
                cy.get('#NHSNumber').type(NHSNumber)
            })
        }
        cy.get('#Title').select(patient.title)
        cy.get('#Surname').type(patient.familyname)
        cy.get('#FirstName').type(patient.firstname)
        //click date picker
        cy.get('.ui-datepicker-trigger').click()
        //select year
        cy.get('.ui-datepicker-year').contains(patient.year_of_birth)
            .then(element => {
                var text = element.text();
                cy.get('.ui-datepicker-year').select(text);
            });
        //select month
        cy.get('.ui-datepicker-month').select(patient.month_of_birth_for_language)
        //select day of month
        cy.get('.ui-datepicker-calendar').contains(patient.day_of_birth.replace(/^0+/, '')).click()
        //check calendar has closed
        cy.get('#ui-datepicker-div', { timeout: 5000 }).should('not.be.visible')
        //
        cy.get('#Sex').select(patient.gender)
        cy.get('#Gender').select(patient.gender)
        cy.get('#FirstLineAddress').type(patient.address_line1)
        cy.get('#Town').type(patient.address_line4)
        cy.get('#County').type(patient.address_line5)
        cy.get('#Phone').type(patient.address_phone)
        cy.get('#Email').type(patient.email)
        //setup intecept for insert
        cy.intercept('POST', '**/Patient/Insert**')
            .as('patient_insert')
        //save the patient details
        cy.get('#AddPatientDetails').click()
        //wait for response from save
        cy.wait('@patient_insert').its('response.statusCode')
            .should('equal', 200)
        //wait for dialogue box to disappear
        cy.get('[aria-labelledby="ui-dialog-title-loading"]', { timeout: 10000 }).should('not.be.visible')
    })
})
//-------------------------------------------------------------------------------------------------------------------
Cypress.Commands.add('add_new_treatment_plan', (drug, algorithm, dosingMethod) => {
    //click the treatmentplan tab
    cy.intercept('GET', '**/TreatmentPlan/ViewRecord**')
        .as('view_tp')
    cy.get('#PatientTreatmentPlanTabSubMenus > .selected > #PatientTreatmentPlanTab').click();
    //click the new treatment plan button
    cy.wait('@view_tp').its('response.statusCode')
        .should('equal', 200)
    cy.get('#AddPatientTreatmentPlanLink').click()
    //select plan start date
    let today = new Date();
    let start_date = new Date(new Date().setDate(today.getDate() - 365));
    cy.log(start_date)
    let start_year = start_date.getFullYear()
    //click the date picker
    cy.get('.ui-datepicker-trigger').click()
    //select year
    cy.get('.ui-datepicker-year').contains(start_year)
        .then(element => {
            var text = element.text();
            cy.get('.ui-datepicker-year').select(text);
        });
    //get month
    let start_month
    cy.date_string_generator_month("Italian").then(value => {
        start_month = value
        cy.log("returned " + value)
        cy.log("Year: " + start_year + " Month: " + start_month + " Day: " + start_day)
        //select month
        cy.get('.ui-datepicker-month').select(start_month)
    })
    let start_day = faker.datatype.number({
        'min': 1,
        'max': 28
    });
    //select day of month
    cy.get('.ui-datepicker-calendar').contains(start_day).click()
    //check calendar has closed
    cy.get('#ui-datepicker-div', { timeout: 5000 }).should('not.be.visible')
    //intercept drug list call after selecting diagnosis
    cy.intercept('GET', '**/TreatmentPlan/GetDrugList**')
        .as('get_drug_list')
    //select Diagnosis. using atrial fibrilation guid
    cy.get('#DiagnosisSelected').select('09e47469-d231-41d4-a8bd-1a2d344941f7')
    //wait for drug selector to load
    cy.wait('@get_drug_list').its('response.statusCode')
        .should('equal', 200)
    //intercept drug change check after selecting
    cy.intercept('GET', '**/TreatmentPlan/ChangeDrug**')
        .as('change_drug')
    //select drug using value in file 
    cy.get(':nth-child(4) > #DrugId').select(drug)
    //wait for algorithm selector to load
    cy.wait('@change_drug').its('response.statusCode')
        .should('equal', 302)
    //intercept algorithm information call after selecting 
    cy.intercept('GET', '**/Dosing/ViewInformation**')
        .as('view_info')
    //select algorithm using value in file
    cy.get('#DosingMethod').select(algorithm)
    //wait for confirmation dialogue to load
    cy.wait('@view_info').its('response.statusCode')
        .should('equal', 200)
    //clear algorithm warning message
    cy.get('[aria-labelledby="ui-dialog-title-modalDialogBox"] > .ui-dialog-buttonpane > .ui-dialog-buttonset > .ui-button > .ui-button-text')
        .click()
    //wait for testing method
    cy.get('#TestingMethod', { timeout: 5000 }).should('be.enabled')
        .select(dosingMethod)
    //intercept call for adding tp
    cy.intercept('POST', '**/TreatmentPlan/Add**')
        .as('add_tp')
    //save tp
    cy.get('#AddPatientTreatmentPlan').click()
    //intercept call for loading patient view after saving tp
    cy.intercept('GET', '**/Patient/ViewRecord**')
        .as('view_p')
    //confirm save
    cy.wait('@add_tp').its('response.statusCode')
        .should('equal', 200)
    //back to the patient view after saving
    cy.wait('@view_p').its('response.statusCode')
        .should('equal', 200)
})
// //-------------------------------------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------------------------------------
// //ENGAGE
// //-------------------------------------------------------------------------------------------------------------------
// Cypress.Commands.add('getIframe', (iframe) => {
//     return cy.get(iframe)
//         .its('0.contentDocument.body')
//         .should('be.visible')
//         .then(cy.wrap);
// })
// //-------------------------------------------------------------------------------------------------------------------
// Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe, callback = () => { }) => {
//     // For more info on targeting inside iframes refer to this GitHub issue:
//     // https://github.com/cypress-io/cypress/issues/136
//     cy.log('Getting iframe body')

//     return cy
//         .wrap($iframe)
//         .should(iframe => expect(iframe.contents().find('body')).to.exist)
//         .then(iframe => cy.wrap(iframe.contents().find('body')))
//         .within({}, callback)
// })
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