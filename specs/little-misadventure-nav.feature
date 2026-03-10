Feature: Little Misadventure navigation group
  The Golf Adventure and Pub Navigator panels are grouped under LITTLE MISADVENTURE
  The LITTLE MISADVENTURE group replaces the standalone GOLF ADVENTURE group

  Scenario: Relive Golfing Greatness is in the LITTLE MISADVENTURE nav group
    Given the application is loaded
    Then "Relive Golfing Greatness" should be in the LITTLE MISADVENTURE nav group

  Scenario: Survive a Friday night at is in the LITTLE MISADVENTURE nav group
    Given the application is loaded
    Then "Survive a Friday night at..." should be in the LITTLE MISADVENTURE nav group
