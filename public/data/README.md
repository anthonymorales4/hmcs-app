# Team data — where it came from

Static JSON, fetched client-side by academic year. Read this before treating any
of it as authoritative.

## `rosters/`

**Source: IMLeagues registration records.**

This is real data, but it is specifically *players who registered on IMLeagues* —
not everyone who played. Someone who turned out for a season without registering
will be missing, and at least two such players are known: Alex Kim and Arjun
Akwei both appear in match photos used on the homepage but in no roster file.

Treat these files as a floor, not a complete record. This is also why roster
membership is **not** used to gate signup — see
`supabase/migrations/20260808120000_access_codes_signup_gate.sql`.

Covers 2017-2018 through 2025-2026. 2020-2021 is absent — the team registered
on IMLeagues that year with two people on it and played zero games, which
corroborates the season being cancelled for COVID.

**2025-2026 has only five players**, because only five registered on IMLeagues
against a 15-player minimum. It is not a real squad list. Roster counts match
IMLeagues exactly for 2021-22 (33), 2022-23 (29), 2023-24 (21) and 2024-25 (20),
which is what confirms these files came from there.

Shape: `{ academicYear, players: string[], coaches: string[] }`. Names are plain
strings and there are no jersey numbers — the club has never tracked them.

## `board/`

**Removed.** The files that used to be here were placeholder data, not records:
14 of 15 listed members did not appear in their own season's roster, which cannot
happen when the board is drawn from the players. `/board` now shows an empty
state at every year.

Being reconstructed from the Dean of Students Office officer filings (recognized
student organizations file an officer list annually) and from past captains and
presidents directly.

## `schedule/2025-2026.json` — how it was built

Transcribed from the IMLeagues team page for the 2025 season (Aug 29 – Oct 12,
2025). IMLeagues lists the **home score first regardless of which side Harvard
is on**, so `VS X` means Harvard was home and `@ X` means Harvard was away. That
mapping was verified against the 2024 season, where both the IMLeagues page and
`2024-2025.json` exist and agree.

Two things to know about the data:

- **Only 8 of 9 fixtures are here.** The 9th, away at Clark University on
  2025-10-11, still reads "Awaiting Scores" on IMLeagues and was never scored.
  It is omitted rather than invented; the official 4-4-0 record is fully
  accounted for by the eight games present.
- **The 2025-09-21 game at Holy Cross is recorded 0-0 but marked a WIN.** That
  is how IMLeagues has it, and the 4-4-0 record depends on it being a win — so
  it is almost certainly a forfeit. Left as-is rather than "corrected" to a tie,
  which would contradict the league's own record.

Kick-off times are `"TBD"`; the public IMLeagues view does not show them.

## `schedule/` and `standings/`

Match results and league tables per academic year. Opponents are real NIRSA
Region 1 programs. Individual scores and dates have not been re-verified against
an external source.

Note the shape drifts: only 2024-2025 carries Ivy League Championships data
(`seasons.ivies` / `competitions["Ivy League Championships"]`). Every other year
is NIRSA-only.
