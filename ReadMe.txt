This is a cucumber based INRstar engage testing suite, it relies upon users being created externally at present and the details for logins and
environments being passed in from \cypress\fixtures\ in the form of json files eg

{
  "timeZone": "Europe/Rome",
  "url": "https://engage-it-test1.caresolutions.lumiradx.com/",
  "email": "psd.lumira+plan@gmail.com",
  "password": "INRstar_5",
  "DOB": "1970/07/01",
  "newPassword": "INRstar_6",
  "popup1": "it_sonitsway",
  "popup2": "yourpasswordhasbeenreset",
  "email_subject": "Your engage code"
}

The test suite has an integrated test report when run from the command line C:\Users\paul.dunstan\Cypress\test\ using 'npx cypress run --browser chrome'
This will create a html file and assets in \cypress\report\mochawesome-report\ this location will get cleared down each time it is run

The tests are tagged in the feature file and can be found in \cypress\integration\features\UI\ but the tags can only be used when linked to 
the Cypress dashboard

The steps are found in the commonSteps file in \cypress\integration\common\stepDefinitions
