@UI
Feature: Load INRstar for given locale and perform tests
    @login
    # Scenario Outline: Perform Successful Login
    #     Given the user opens the INRstar url supplied in "<file>" and the page has loaded 
    #     When the user enters their username supplied in "<file>"
    #     And the user enters the password supplied in "<file>" into the password section
    #     And the user clicks the Login button
    #     Then the home page has loaded
    #     Examples:
    #         | file |
    #         | INRstar_UKLogin.json |

    Scenario Outline: Login and create patient
        Given the user logs into INRstar with detais in "<file>"
        When the user adds a new patient for region from "<file>"
        Then the user adds a new treatment plan from detais in "<file>"
        #Then a new treatment plan can be added
        Examples:
            | file | 
            | INRstar_ITLogin.json |

    Scenario Outline: Login under the hood and create patient
        Given the user logs into INRstar UTD with detais in "<file>"
        Examples:
            | file | 
            | INRstar_ITLogin.json |
        
