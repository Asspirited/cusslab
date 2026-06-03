# The Round Head — Pipeline-visible spec marker
# Canonical feature lives at: features/round-head.feature
# This file exists so the pipeline registers the spec as @claude — manual-verification.
# When step definitions are added (Mode 1 + Mode 2 stabilisation), this file can be expanded
# or replaced by importing the canonical features/ file.

@claude
Feature: The Round Head — Mode 1 + Mode 2 — pipeline marker

  See features/round-head.feature for the full Three Amigos behaviour spec.

  Scenario: Round Head HTML page exists
    Then a round-head.html file exists at the cusslab root

  Scenario: Round Head is linked from the index PLAY nav group
    Then index.html contains a tab linking to round-head.html
    And the link is inside the PLAY nav group

  Scenario: Round Head ships both Mode 1 and Mode 2
    Then round-head.html includes a mode selector with a "Mode 1" button (15 Minutes of Fame)
    And round-head.html includes a mode selector with a "Mode 2" button (4th Guest)
    And both buttons are enabled
