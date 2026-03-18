Feature: TBT transport choices

  Background:
    Given the TBT attribute engine is initialised

  Scenario: Bus is classified from player input
    Given it is a Saturday morning
    When the player says "I'll get the bus"
    Then the transport is BUS

  Scenario: Bike is classified from player input
    Given it is a Saturday morning
    When the player says "I'll cycle over"
    Then the transport is BIKE

  Scenario: Run is classified from player input
    Given it is a Saturday morning
    When the player says "I'll run"
    Then the transport is RUN

  Scenario: Walk is classified from player input
    Given it is a Saturday morning
    When the player says "I'll walk"
    Then the transport is WALK

  Scenario: Bus costs 20p from the bank
    Given bank balance is £4.30
    When the player takes the bus to the ground
    Then bank decreases by £0.20
    And the transport note mentions the bus

  Scenario: Bike raises sharpness
    Given sharpness is 0
    When the player cycles to the ground
    Then sharpness delta is 1
    And the transport note mentions cycling

  Scenario: Run raises sharpness but costs physique
    Given physique is 5
    And sharpness is 0
    When the player runs to the ground
    Then sharpness delta is 1
    And physique delta is -1
    And the transport note mentions running

  Scenario: Walk reduces sharpness
    Given sharpness is 1
    When the player walks to the ground
    Then sharpness delta is -1
    And the transport note mentions walking

  Scenario: Bus does not affect physique or sharpness
    Given physique is 5
    And sharpness is 1
    When the player takes the bus to the ground
    Then physique delta is 0
    And sharpness delta is 0
