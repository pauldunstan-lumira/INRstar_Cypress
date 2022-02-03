//add faker so required data can be generated
const faker = require('@faker-js/faker');
const { wrap } = require('module');
//-------------------------------------------------------------------------------------------------------------------
//date generator (month)
Cypress.Commands.add('date_string_generator_month', (language) => {
    let months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    let shortmonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let todays_date = new Date();
    let month_selector = Math.floor(Math.random()* months.length);
    
    shortmonth = shortmonth[month_selector];

    //Regional DOB creator based on launguage
    let shortmonths = {}
    shortmonths["English"] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    shortmonths["Italian"]      = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
    shortmonths["Spanish (US)"] = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

    let return_month = shortmonths[language][parseInt(month_selector)]
    cy.wrap(return_month);
})
//-------------------------------------------------------------------------------------------------------------------
//Pulled from TestComplete need moving to new custom js file
//Misc functions 
//-------------------------------------------------------------------------------------------------------------------
//Generate NHS Number
Cypress.Commands.add("generate_NHS_Number", () => {
    let NHSNumber
    cy.request("http://danielbayley.co.uk/nhs-number/api/NhsNumbers/GetNhsNumbers") //URL returns an Array of NHSNumbers 
    .its('body')
    .then((body) => {
    NHSNumber = body[0]//.replace('\u00A0','').trim();
    cy.log(NHSNumber);
    cy.wrap(NHSNumber)//.as("NHSNumber")
    })
    // .then((body) => {
    //     const parser = new DOMParser();
    //     const xmlDOM = parser.parseFromString(body,"text/xml");
    //     NHSNumber = xmlDOM.getElementsByTagName("string")[0].childNodes[0].nodeValue;
    //     cy.wrap(NHSNumber)
    //     })
})
//-------------------------------------------------------------------------------------------------------------------
//Generate Fiscal Code for use with Patient creation using Faker data
Cypress.Commands.add("generate_fiscal_code", (firstname, familyname, dob, sex) => {

    let fiscal_code_api = "http://webservices.dotnethell.it/codicefiscale.asmx/CalcolaCodiceFiscale"
    cy.log("Details: " + firstname + " " + familyname + " " + dob + " " + sex);
    let fiscal_code
    cy.request({
        method: 'GET',
        url: fiscal_code_api,
        qs: {
            Nome: firstname,                     //firstname
            Cognome: familyname,                   //familyname
            ComuneNascita: "Roma",              //leave as ROMA as this does not matter (place of birth)
            DataNascita: dob,          //dob dd/mm/yyyy format 
            Sesso: sex                        //sex either "M" or "F"
        }
    })
    .its('body').then((body) => {
        // let fiscal_code = body.match(/(?<=\>)(.*?)(?=\<)/);
    const parser = new DOMParser();
    const xmlDOM = parser.parseFromString(body,"text/xml");
    fiscal_code = xmlDOM.getElementsByTagName("string")[0].childNodes[0].nodeValue;
    cy.wrap(fiscal_code)//.as("fiscal_code")
    })
})
//-------------------------------------------------------------------------------------------------------------------
