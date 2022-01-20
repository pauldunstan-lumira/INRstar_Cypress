@UI
Feature: Load INRstar for given locale and perform tests
    @login
    Scenario Outline: Perform Successful Login
        Given the user opens the INRstar url supplied in "<file>" and the page has loaded 
        When the user enters their username supplied in "<file>"
        And the user enters the password supplied in "<file>" into the password section
        And the user clicks the Login button
        Then the home page has loaded
        Examples:
            | file | 
            | INRstar_UKLogin.json |