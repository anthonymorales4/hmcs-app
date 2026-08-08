export const HOUSE_OPTIONS = [
  "Adams House",
  "Apley Court",
  "Cabot House",
  "Canaday Hall",
  "Currier House",
  "Dunster House",
  "Eliot House",
  "Grays Hall",
  "Greenough Hall",
  "Hollis Hall",
  "Holworthy Hall",
  "Hurlbut Hall",
  "Kirkland House",
  "Leverett House",
  "Lionel Hall",
  "Lowell House",
  "Massachussetts Hall",
  "Mather House",
  "Matthews Hall",
  "Mower Hall",
  "Pennypacker Hall",
  "Pforzheimer House",
  "Quincy House",
  "Stoughton Hall",
  "Straus Hall",
  "Thayer Hall",
  "Weld Hall",
  "Wigglesworth Hall",
  "Winthrop House",
];

export const FINAL_CLUB_OPTIONS = [
  "Fly Club",
  "Spee Club",
  "Porcellian Club",
  "A.D. Club",
  "Phoenix S.K. Club",
  "Owl Club",
  "Delphic Club",
  "Fox Club",
  "Sab Club",
];

export const POSITION_OPTIONS = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
];

export const BOARD_POSITION_OPTIONS = [
  "President",
  "Captain",
  "Treasurer",
  "Social Chair",
];

// The academic year ending in Y runs from August (Y-1) through July Y, so from
// August onward the current academic year ends in the next calendar year.
// getMonth() is 0-indexed, so 7 is August.
function currentAcademicYearEnd(now = new Date()) {
  return now.getMonth() >= 7 ? now.getFullYear() + 1 : now.getFullYear();
}

const FIRST_GRADUATION_YEAR = 2017;

// Derived rather than hard-coded: the previous literal list stopped at 2025 and
// had gone stale, so no current undergraduate could be represented. Runs four
// classes ahead of the current academic year, which covers every enrolled
// student (this year's seniors through the incoming first-years).
export const GRADUATION_YEAR_OPTIONS = Array.from(
  { length: currentAcademicYearEnd() + 3 - FIRST_GRADUATION_YEAR + 1 },
  (_, i) => FIRST_GRADUATION_YEAR + i
);

// Seasons we hold data for, newest first — this is also the dropdown's display
// order. Add a year here when its JSON files land in public/data/.
export const ACADEMIC_YEAR_OPTIONS = [
  "2025-2026",
  "2024-2025",
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2019-2020",
  "2018-2019",
  "2017-2018",
];

// Every data page defaults to this. Derived from the list above rather than
// repeated as a literal in four files, where it silently went two seasons out
// of date — adding a newer season to ACADEMIC_YEAR_OPTIONS now moves the
// default on its own. Sorted rather than trusting the array order, so the
// default stays correct even if the display order changes.
export const DEFAULT_ACADEMIC_YEAR = [...ACADEMIC_YEAR_OPTIONS]
  .sort()
  .at(-1);

export const PROFILE_COMPLETION = {
  COLORS: {
    LOW: "bg-red-500", // < 30%
    MEDIUM: "bg-yellow-500", // 30-69%
    HIGH: "bg-green-500", // >= 70%
  },
  PERCENTAGES: {
    LOW: 30,
    MEDIUM: 70,
  },
};

export const REQUIRED_FIELDS = {
  COMMON: [
    "full_name",
    "email",
    "graduation_year",
    "profile_image_url",
    "position",
    "bio",
    "house",
    "concentration",
    "hometown",
    "phone_number",
    "linkedin_url",
    "instagram_url",
  ],
  ALUMNI_ADDITIONAL: ["current_job", "current_company", "current_location"],
};
