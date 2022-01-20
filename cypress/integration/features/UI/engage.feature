@UI
Feature: Load engage for given locale and perform tests
    @login
    Scenario Outline: Perform Successful Login
        Given the user opens the url supplied in "<file>" and the page has loaded 
        When the user enters their email supplied in "<file>"
        And the user enters the password supplied in "<file>" into the password section
        And the user clicks the Sign In button
        Then the landing page has loaded
        Examples:
            | file | 
            | UKLogin.json |

    @login
    Scenario Outline: Perform Unsuccessful Login
        Given the user opens the url supplied in "<file>" and the page has loaded
        When the user enters their email supplied in "<file>"
        And the user enters the password supplied in "<file>" into the password section
        And the user clicks the Sign In button
        Then the "<header>" popup is displayed
        Examples:
            | file | header |
            | UKInvalidEmailLogin.json | Login denied |
            | UKInvalidPasswordLogin.json | Login denied |
    
    @register    
    Scenario Outline: Register New User
        Given the user opens the url supplied in "<file>" and the page has loaded
        When the user clicks the "<tab>" tab
        And the user enters their email supplied in "<file>"
        And the user enters their DOB supplied in "<file>"
        And the user clicks the send me a code button
        Then the "<header>" popup is displayed
        Examples:
            | file | tab | header |
            | UKLogin.json | register | It's on its way | 
            | ITLogin.json | register | È in arrivo |
            

    @forgotpassword    
    Scenario Outline: Forgot password flow
        Given the user opens the url supplied in "<file>" and the page has loaded
        When the user clicks the "<hyperlink>" hyperlink
        And the user enters their email supplied in "<file>"
        And the user enters their DOB supplied in "<file>"
        And the user clicks the send me a code button
        Then the "<header>" popup is displayed
        Examples:
            | file | hyperlink | header |
            | UKLogin.json | forgotpassword | It's on its way |
            | ITLogin.json | forgotpassword | È in arrivo |

    @forgotpassword    
    Scenario Outline: Forgot password, reset flow and check email
        Given the user opens the url supplied in "<file>" and the page has loaded
        When the user clicks the "<hyperlink>" hyperlink
        And the user enters their email supplied in "<file>"
        And the user enters their DOB supplied in "<file>"
        And the user clicks the send me a code button
        Then the user resets the password from the email with the details in "<file>"
        And the user logs in with the new password supplied in "<file>"
        And the user resets the password back to the original one supplied in "<file>"
        Examples:
            | file | hyperlink |
            | UKLogin.json | forgotpassword |
            | ITLogin.json | forgotpassword |
         
    @menuitem    
    Scenario Outline: Login and Load a Menu Item
        Given the user has logged into the url using the details supplied in "<file>"
        When the user clicks the hamburger menu
        Then the user clicks the "<menuOption>"
        And the header of the web page is "<header>"
        And the iframe "<header>" has loaded
        Examples:
            | file | menuOption | header |
            | UKLogin.json | privacy policy | Privacy Policy |
            | ITLogin.json | privacy policy | Informativa sulla privacy |

    @submitINR
    Scenario Outline: Login and Submit new INR
        Given the user has logged into the url using the details supplied in "<file>"
        When the user clicks the "<tile>" tile
        And the user populates INR questionnaire answers
        Then submit the INR questionnaire
        Examples:
            | file | tile | 
            | UKLogin.json | Submit my INR |

    @smoke @test
    Scenario: Login using details from json file - hardcoded file name
        Given the user has logged into url using email and password from file
            