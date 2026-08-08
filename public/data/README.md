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

Covers 2017-2018 through 2024-2025. 2020-2021 is absent (COVID).

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

## `schedule/` and `standings/`

Match results and league tables per academic year. Opponents are real NIRSA
Region 1 programs. Individual scores and dates have not been re-verified against
an external source.

Note the shape drifts: only 2024-2025 carries Ivy League Championships data
(`seasons.ivies` / `competitions["Ivy League Championships"]`). Every other year
is NIRSA-only.
