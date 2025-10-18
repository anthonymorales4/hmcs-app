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

export const GRADUATION_YEAR_OPTIONS = [
  2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
];

export const ACADEMIC_YEAR_OPTIONS = [
  "2024-2025",
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2019-2020",
  "2018-2019",
  "2017-2018",
];

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
