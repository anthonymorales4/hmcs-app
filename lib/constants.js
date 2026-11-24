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

export function currentAcademicYearEnd(now = new Date()) {
  return now.getMonth() >= 7 ? now.getFullYear() + 1 : now.getFullYear();
}

const FIRST_GRADUATION_YEAR = 2017;

export const GRADUATION_YEAR_OPTIONS = Array.from(
  { length: currentAcademicYearEnd() + 3 - FIRST_GRADUATION_YEAR + 1 },
  (_, i) => FIRST_GRADUATION_YEAR + i,
);

export const ACADEMIC_YEAR_OPTIONS = ["2026-2027"];

export const DEFAULT_ACADEMIC_YEAR = [...ACADEMIC_YEAR_OPTIONS].sort().at(-1);

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
