# The Round Head — Pipeline-visible spec marker
# Canonical feature lives at: features/round-head.feature
# This file exists so the pipeline registers the spec as @claude — manual-verification.
# When step definitions are added (Mode 1 stabilisation), this file can be expanded
# or replaced by importing the canonical features/ file.

@claude
Feature: The Round Head — Mode 1 (Karl channel chat) — pipeline marker

  See features/round-head.feature for the full Three Amigos behaviour spec.

  Scenario: Round Head HTML page exists
    Then a round-head.html file exists at the cusslab root

  Scenario: Round Head is linked from the index PLAY nav group
    Then index.html contains a tab linking to round-head.html
    And the link is inside the PLAY nav group

  Scenario: Round Head is Mode 1 only in this MVP
    Then round-head.html includes a "Mode 2: user as 4th guest — coming soon" note
    And the Mode 2 button is disabled
