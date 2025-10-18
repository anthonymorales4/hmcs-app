// Available roster years - update this array when adding new roster files
const ROSTER_YEARS = [
  "2024-2025",
  "2023-2024",
  "2022-2023",
  "2021-2022",
  "2019-2020",
  "2018-2019",
  "2017-2018",
];

/**
 * Normalize name for comparison (remove extra spaces, convert to lowercase)
 */
function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Load roster data for a specific academic year
 */
async function loadRosterData(academicYear) {
  try {
    const response = await fetch(`/data/rosters/${academicYear}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load roster for ${academicYear}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading roster for ${academicYear}:`, error);
    return null;
  }
}

/**
 * Load all roster data
 */
async function loadAllRosterData() {
  const allRosters = [];

  for (const year of ROSTER_YEARS) {
    const rosterData = await loadRosterData(year);
    if (rosterData) {
      allRosters.push(rosterData);
    }
  }

  return allRosters;
}

/**
 * Validate if a name exists in any roster (players or coaches)
 */
export async function validatePlayerName(inputName) {
  const normalizedInput = normalizeName(inputName);
  const allRosters = await loadAllRosterData();

  for (const roster of allRosters) {
    // Check players
    const foundPlayer = roster.players.find(
      (player) => normalizeName(player) === normalizedInput
    );

    if (foundPlayer) {
      return {
        isValid: true,
        academicYear: roster.academicYear,
        exactMatch: foundPlayer,
        type: "player",
      };
    }

    // Check coaches
    if (roster.coaches && roster.coaches.length > 0) {
      const foundCoach = roster.coaches.find(
        (coach) => normalizeName(coach) === normalizedInput
      );

      if (foundCoach) {
        return {
          isValid: true,
          academicYear: roster.academicYear,
          exactMatch: foundCoach,
          type: "coach",
        };
      }
    }
  }

  return {
    isValid: false,
    academicYear: null,
    exactMatch: null,
    type: null,
  };
}

/**
 * Get all players from all rosters (useful for roster page)
 */
export async function getAllPlayers() {
  const allRosters = await loadAllRosterData();
  return allRosters;
}

/**
 * Get players by specific academic year
 */
export async function getPlayersByYear(academicYear) {
  return await loadRosterData(academicYear);
}

export function getBoardPositionOrder() {
  return ["President", "Captain", "Treasurer", "Social Chair"];
}

export function formatBoardPositionTitle(position, members) {
  return members.length > 1 ? `${position}s` : position;
}

export function validatePhoneNumber(phone) {
  if (!phone) return true;
  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length === 10) return true;
  return false;
}

export function validateLinkedInUrl(url) {
  if (!url) return true;

  const linkedinRegex =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_.%]+\/?(\?.*)?$/;
  return linkedinRegex.test(url);
}

export function validateInstagramUrl(url) {
  if (!url) return true;

  const instagramRegex =
    /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?(?:\?.*)?$/;
  return instagramRegex.test(url);
}

export function formatPhoneNumber(phone) {
  if (!phone) return "";

  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(
      3,
      6
    )}-${digitsOnly.slice(6)}`;
  } else if (digitsOnly.length === 11 && digitsOnly[0] === "1") {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(
      4,
      7
    )}-${digitsOnly.slice(7)}`;
  }
  return phone;
}

export function formatInstagramUrl(url) {
  if (!url) return null;

  const username = url.split("/").filter(Boolean).pop();
  const displayUsername = `@${username}`;
  return displayUsername;
}
