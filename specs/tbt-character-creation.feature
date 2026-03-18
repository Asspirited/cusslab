Feature: TBT character creation screen

  Scenario: Dedication displays first
    Given the game loads
    Then the first thing displayed is "For Ollie. Who plays centre-half."
    And nothing else is on screen
    And a keypress moves to the next screen

  Scenario: Grandfather name field has visual weight
    Given the DOB has been selected
    Then the grandfather name field appears
    And no placeholder text is shown
    And the cursor blinks in the field

  Scenario: Game begins cleanly
    Given all three fields are complete
    Then the screen clears completely
    And the opening scene begins with the player name on the second line
    And the grandfather's name appears greyed in the relationships panel
