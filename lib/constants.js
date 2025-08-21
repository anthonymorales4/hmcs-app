export const HOUSE_OPTIONS = [
  "Adams House",
  "Cabot House",
  "Currier House",
  "Dunster House",
  "Eliot House",
  "Kirkland House",
  "Leverett House",
  "Lowell House",
  "Mather House",
  "Pforzheimer House",
  "Quincy House",
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
  "None",
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

// Image upload constants
export const IMAGE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"]
};

// Profile completion constants
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

// Required fields for profile completion calculation
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

// Form validation constants
export const VALIDATION = {
  GRADUATION_YEAR: {
    MIN: 2015,
    MAX: 2030,
  },
  BIO_MAX_LENGTH: 1000,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  URL_REGEX: /^https?:\/\/.+/,
  LINKEDIN_REGEX: /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/,
  INSTAGRAM_REGEX: /^https?:\/\/(www\.)?instagram\.com\/.+/,
};

// UI constants
export const UI = {
  SKELETON_LINES: 3,
  ANIMATION_DURATION: 300, // ms
  DEBOUNCE_DELAY: 500, // ms for auto-save
  TOAST_DURATION: 3000, // ms
};

// Error messages
export const ERROR_MESSAGES = {
  IMAGE_TOO_LARGE: `Image must be less than ${
    IMAGE_UPLOAD.MAX_SIZE / (1024 * 1024)
  }MB`,
  IMAGE_INVALID_TYPE: "Please upload a JPG, PNG, or WebP image",
  UPLOAD_FAILED: "Failed to upload image. Please try again.",
  SAVE_FAILED: "Failed to save changes. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  INVALID_URL: "Please enter a valid URL",
  INVALID_LINKEDIN: "Please enter a valid LinkedIn profile URL",
  INVALID_INSTAGRAM: "Please enter a valid Instagram profile URL",
  INVALID_PHONE: "Please enter a valid phone number",
};
