//add faker so required data can be generated
const faker = require('@faker-js/faker');
//import custom commands
import './misc'
//-------------------------------------------------------------------------------------------------------------------
//
// beforeEach(function () { 
//     cy.generate_fiscal_code();
//     cy.generate_NHS_Number();
// })
//-------------------------------------------------------------------------------------------------------------------
//Create Patient data
Cypress.Commands.add("generate_patient_data", (language) => {

    //Usefull variables - used in creation process 
    let patient = new Object();
    let genders = ["Male","Female"];//could add "Unknown"
    let days =   ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16",
    "17","18","19","20","21","22","23","24","25","26","27","28"];
    let months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    let shortmonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let todays_date = new Date();
    let current_year_minus_eighteen_years = (todays_date.getFullYear() -18);
    let current_year_minus_seventy_years = (todays_date.getFullYear() -70);
    let month_selector = Math.floor(Math.random()* months.length);

    //Id this needs to be a guid will be generated with the request to /Patient/New
    //patient.id 

    //SCSLHealthDbId - Not mandatory

    //Active
    patient.active = "True"

    //Patient number
    patient.patientnumber = (faker.datatype.uuid().substring(0,20));

    //NHSNumber - Not mandatory if Patient number is populated

    //Gender creator
    let chosen_gender = Math.floor(Math.random()*2);
    patient.gender = genders[chosen_gender];
    //patient.gender_id = gender_ids[chosen_gender];

    //title selection based on gender
    let gender_title = {}
    gender_title["Male"] = ["Mr","Dr","Prof"];
    gender_title["Female"] = ["Mrs","Dr","Prof"];

    //patient.title = (faker.name.prefix(patient.gender).slice(0,-1));
    let chosen_title = Math.floor(Math.random()*3)
    patient.title = (gender_title[patient.gender][chosen_title])
    cy.log(patient.title);

    //patient name
    patient.firstname = (faker.name.firstName(patient.gender));
    patient.familyname = (faker.name.lastName(patient.gender));

    //DOB creator 
    let day_of_birth   = days[Math.floor(Math.random()* days.length)];
    patient.day_of_birth = day_of_birth;

    patient.month_of_birth = months[month_selector];
    patient.shortmonth = shortmonth[month_selector];

    let year_of_birth  = Math.floor(Math.random() * (current_year_minus_eighteen_years - current_year_minus_seventy_years) + current_year_minus_seventy_years);
    patient.year_of_birth = year_of_birth;
    patient.date_of_birth = patient.year_of_birth + "-" + patient.month_of_birth + "-" + patient.day_of_birth;

    //Used for the generate fiscal code function - format dd/mm/yyyy
    let month
    if ( month_selector < 10 ) {
        month = ("0" + month_selector).slice(-2);
    } else { 
        month = month_selector
    }
    patient.dob = day_of_birth + '/' + month + '/' + year_of_birth;

    //Regional DOB creator based on launguage
    let shortmonths = {}
    shortmonths["English"] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    shortmonths["Italian"]      = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
    shortmonths["Spanish (US)"] = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

    let dobformat = {}
    dobformat["English"] =  day_of_birth + ' ' + shortmonths[language][parseInt(month_selector)] + ' ' + year_of_birth;
    dobformat["Italian"]      = day_of_birth + ' ' + shortmonths[language][parseInt(month_selector)] + ' ' + year_of_birth;
    dobformat["Spanish (US)"] = shortmonths[language][parseInt(month_selector)] + ' ' + day_of_birth + ' ' + year_of_birth;

    patient.month_of_birth_for_language = shortmonths[language][parseInt(month_selector)]

    patient.dob_formatted_for_language = dobformat[language];

    //Address creator
    patient.address_line1 = (faker.address.streetAddress());
    //City
    patient.address_line4 = (faker.address.city());
    //County
    patient.address_line5 = (faker.address.county());
    //Phone
    patient.address_phone = (faker.phone.phoneNumber());

    //Email creator
    let test_email = "automationlumira@gmail.com"
    let email_prefix = test_email.substring(0, test_email.length - 10)
    //email_prefix.substring(0, env.gmail_test_account.length - 15)
    patient.email = email_prefix + '+' + Math.floor(Date.now() / 1000) + '@gmail.com';

    cy.wrap(patient);
})
