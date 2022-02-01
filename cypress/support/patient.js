//add faker so required data can be generated
const faker = require('@faker-js/faker');
//import custom commands
//import './misc'
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
    //cy.log(month_selector);

    //Id this needs to be a guid will be generated with the request to /Patient/New
    //patient.id 

    //SCSLHealthDbId - Not mandatory

    //Active
    patient.active = "True"

    //Patient number
    patient.patientnumber = (faker.datatype.uuid().substring(0,20));

    //NHSNumber - Not mandatory if Patient number is populated
    //NHSNumberFormat["English (US)"] = cy.generate_NHS_Number();
    //NHSNumberFormat["Italian"] = cy.generate_fiscal_code();

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

    //Regional DOB creator based on launguage
    let shortmonths = {}
    shortmonths["English (US)"] = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    shortmonths["Italian"]      = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
    shortmonths["Spanish (US)"] = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

    let dobformat = {}
    dobformat["English (US)"] = shortmonths[language][parseInt(month_selector)] + ' ' + day_of_birth + ' ' + year_of_birth;
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
//Pulled from TestComplete need moving to new custom js file
//Misc functions 
//-------------------------------------------------------------------------------------------------------------------
//Generate NHS Number
// Cypress.Commands.add("generate_NHS_Number", () => {
//     cy.request("http://danielbayley.co.uk/nhs-number/api/NhsNumbers/GetNhsNumbers")
//     .its('body').then((body) => {
//     let NHSNumber = body[0].replace('\u00A0','').trim();
//     cy.log(NHSNumber);
//     return NHSNumber;
//     })
// })
// //-------------------------------------------------------------------------------------------------------------------
// //Generate Fiscal Code
// Cypress.Commands.add("generate_fiscal_code", () => {

//       var fourteen_digit_value = get_unique_number();                                               //get a unique code (14 digit epoc value)                 
//       var fifteenth_digit = get_random_letter() ;                                                   //get a random letter
//       var position = get_random_num_inrange(0, 14);                                                 //select random insert location                 
      
//       var fifteen_digit_fiscal = aqString.Insert(fourteen_digit_value, fifteenth_digit, position);  //insert random letter into unique 14 digit code
//       var check_character = get_check_digit(fifteen_digit_fiscal);                                  //get a valid check character
//       var fiscal = fifteen_digit_fiscal + check_character;                                          //fiscal needs 15 alphanumeric + validated check character
      
//       cy.log(fiscal);
//       return fiscal;
// })
// //-------------------------------------------------------------------------------------------------------------------
// function get_check_digit(fifteen_digit_fiscal)
// {
//   fifteen_digit_fiscal = aqString.ToUpper(fifteen_digit_fiscal);
//   var error_message = "Value invalid. Please enter 15 digits only with values 0-9 A-Z.";
  
//   if(aqString.GetLength(fifteen_digit_fiscal) < 15 || aqString.GetLength(fifteen_digit_fiscal) > 15)
//   {
//     Log.Message(error_message);
//     return error_message;
//   }
  
//   var sum_of_values = 0; 
  
//   var potential_values = new Array();                   //all possible values that can be accepted/calculated on in this field
//   potential_values.push("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
  
//   var odd_character_code_values = new Array();          //converted values for characters in ODD positions in original
//   odd_character_code_values.push(1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23);
  
//   var even_character_code_values = new Array();         //converted values for characters in EVEN positions in original
//   even_character_code_values.push(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25);
  
//   var check_digit_values = new Array();                 //values used for the check digit
//   check_digit_values.push("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
  
//   for(var i = 1; i <= aqString.GetLength(fifteen_digit_fiscal); i++) //check every value in entry code
//   {
//     var character_at_current_position = aqString.SubString(fifteen_digit_fiscal, i - 1, 1); //split values by character
//     var position_in_array = null;
//     var character_code_value;
    
//     for(var j = 0; j < potential_values.length; j++) //find character in list of potential values
//     {
//       if(potential_values[j] == character_at_current_position)
//       {
//         position_in_array = j; //get the position the character appears
//         break;
//       }
//     }
    
//     if(position_in_array == null) //if a character is not found in the list of potential values then error
//     {
//       Log.Message(error_message)
//       return error_message;
//     }
    
//     if(i % 2 != 0) //is the value odd
//     {
//       character_code_value = odd_character_code_values[position_in_array]; //if it is odd get the values at the matching position from the odd array
//     }
//     else
//     {
//       character_code_value = even_character_code_values[position_in_array]; //else get the values at the matching position from the even array
//     }
    
//     sum_of_values = sum_of_values + character_code_value; //sum each value that is generated
//   }
  
//   var remainder = sum_of_values % 26; //divide by number of letters in alphabet
//   var check_digit = check_digit_values[remainder]; //remainder should be a number between 0 - 25 select the relevant value from the check_digit array
  
//   Log.Message(check_digit);
//   return check_digit;
// }
// //-------------------------------------------------------------------------------------------------------------------
// function get_unique_number()
// {
//   WaitSeconds(1);
//   var date_now = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%Y %H:%M:%S");
  
//   var split_1 = date_now.split(" ");
//   var split_2 = split_1[0].split("/");
//   var split_3 = split_1[1].split(":");
  
//   var temp = "";
//   temp = aqString.Concat(split_2[0], split_2[1]);
//   temp = aqString.Concat(temp, split_2[2]);
//   temp = aqString.Concat(temp, split_3[0]);
//   temp = aqString.Concat(temp, split_3[1]);
//   temp = aqString.Concat(temp, split_3[2]);
//   return temp;
// }
// //-------------------------------------------------------------------------------------------------------------------
// function get_random_letter() 
// {
//   const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  
//   return alphabet[Math.floor(Math.random() * alphabet.length)]
// }
// //-------------------------------------------------------------------------------------------------------------------
// function get_random_num_inrange(min, max) 
// {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
// }
// //-------------------------------------------------------------------------------------------------------------------