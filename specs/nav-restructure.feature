Feature: Nav group restructuring — Comedy Room, Little Misadventure, Play, 19th Hole, Thought Showers
  Comedy Room sub-features promoted to top-level nav items
  Souness's Cat moved from 19TH HOLE to Comedy Room, then to THOUGHT SHOWERS
  Quntum Leeks moved from PLAY to LITTLE MISADVENTURE
  Phil's-opoly moved from COMEDY ROOM to THOUGHT SHOWERS
  Ask Sun Tzu moved from LITTLE MISADVENTURE to THOUGHT SHOWERS
  Premise Interrogation moved from BOARDROOM to THOUGHT SHOWERS

  Background:
    Given the application is loaded

  Scenario Outline: LITTLE MISADVENTURE contains the correct tabs
    Then "<tab>" should be in the LITTLE MISADVENTURE nav group
    Examples:
      | tab                              |
      | Relive Golfing Greatness         |
      | Survive a Friday night at...     |
      | Quntum Leeks                     |

  Scenario Outline: COMEDY ROOM nav group contains only the comedy output panels
    Then "<tab>" should be in the COMEDY ROOM nav group
    Examples:
      | tab                   |
      | The Comedy Room       |
      | The House Name Oracle |
      | The Roast Room        |
      | The Writing Room      |

  Scenario Outline: THOUGHT SHOWERS nav group contains the ideas panels
    Then "<tab>" should be in the THOUGHT SHOWERS nav group
    Examples:
      | tab                    |
      | Souness's Cat          |
      | Phil's-opoly           |
      | Ask Sun Tzu            |
      | Premise Interrogation  |

  Scenario Outline: 19TH HOLE nav group contains only the four sports panels
    Then "<tab>" should be in the 19TH HOLE nav group
    Examples:
      | tab                |
      | Post Match Cunditry |
      | The 19th Hole      |
      | Watching the Oche  |
      | The Long Room      |

  Scenario Outline: PLAY nav group contains five items after Quntum Leeks moved
    Then "<tab>" should be in the PLAY nav group
    Examples:
      | tab             |
      | Roast Battle    |
      | Dinner Party    |
      | Rogues' Gallery |
      | Comedy Lab      |
      | Dimension Duel  |
