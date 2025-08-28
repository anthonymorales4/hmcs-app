# Claude.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Next.js development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Overview

I played on the Harvard Men's Club Soccer team from 2021-2024. I loved being a part of the team and making new friends and memories along the way. However, I quickly realized that we had no way of showcasing our experiences to future prospects and alumni. Given this, my goal is to create a website where players and alumni can connect and learn about each other. I want to showcase each season with its respective roster, schedule, and standings. Specifically, I want to have a primary navbar with the following pages: About Us, Roster, Board, Schedule, Standings, and Alumni. The secondary navbar contains: Alumni Directory, Announcements, Donations, and Profile. Altogether, this project creates an environment where players feel like they're part of something bigger than themselves, they're leaving a legacy behind. Most importantly, it also gives players the ability to network with alumni in their desired field of work. Similarly, alumni will be able to stay updated on who's currently on the team and how the team has been performing. Some other key features include the Alumni Directory, Donations, Announcements, and Profile: Players will be able to search and filter through hundreds on alumni, alumni will be able to donate to the team, players and alumni will be able to post announcements and organize events and meetups, and users who use this platform will need to create a profile.

### Key Technologies

- **Frontend** - Next.js 15, React 19, Tailwind CSS 4, Material UI components
- **Backend** - Supabase (Database + Authentication)

### Core Architecture

**Authentication System**:

- `contexts/AuthContext.js` - Global auth state management with user and profile data
- `components/ProtectedRoute.js` - Route protection and wrapper component
- Authentication persists across sessions and handles profile fetching
- Uses Supabase `profiles` table for user data beyond basic auth

**Layout Structure**:

- `app/layout.js` - Root layout with AuthProvider and LayoutWrapper
- `components/LayoutWrapper.js` - Main layout wrapper
- `components/Navbar.js` - Navbar component

**Profile System**:

- Profile cards in `components/ui/` - AboutMeCard, PersonalInfoCard, ContactInfoCard, CareerInfoCard
- `hooks/useProfileCompletion.js` - Custom hook for profile completion tracking
- `components/ui/ProfileCompletionBar.js` - Visual progress indicator
- `components/ui/ProfileHeader.js` - Profile header

**Roster Management**:

- `lib/rosterValidation.js` - Validates player names against historical rosters
- Roster data stored in `public/data/rosters/` as JSON files by academic year
- Available years: 2024-2025, 2023-2024, 2022-2023, 2021-2022, 2019-2020, 2018-2019, 2017-2018

### File Organization

**Pages (App Router)**:

- `/` - Homepage that serves as an About Us page (`designs/IMG_3688.png`)
- `/login`, `/signup` - Authentication pages (`designs/IMG_3703.png`, `designs/IMG_3706.png`)
- `/profile` - User profile management (`designs/IMG_3755.png`)
- `/alumni/*` - Protected pages (Alumni Directory, Announcements, Donations) (`designs/IMG_3693.png`)
  - `/alumni/alumnidirectory` - Allow players to search and filter through alumni
  - `/alumni/announcements` - Allow players and alumni to communicate via posts
  - `/alumni/donations` - Allow alumni to support and donate to the team via Stripe API
- `/roster` - Team rosters by year (`designs/IMG_3689.png`)
- `/schedule`, `/standings`, `/board` - Team information (`designs/IMG_3691.png`, `designs/IMG_3692.png`, `designs/IMG_3690.png`)

**Components**:

- `components/ui/` - Reusable UI components
- `components/` - Layout and routing components

**Utilities**:

- `lib/supabase.js` - Supabase client configuration
- `lib/constants.js` - App constants
- `lib/rosterValidation.js` - Roster validation functions

## Environment Variables Required

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Design System

- Primary color: Harvard Crimson (#A51C30)

## User Roles

- Regular users: Access to main pages (About Us, Roster, Schedule, Standings)
- Players + Alumni: Additional access to protected `/alumni/*` routes (Alumni Directory, Announcements, Donations, Profile)
- Role determined during signup with roster validation

## Technical Implementation

- For all asynchronous functions, please use function declarations rather than arrow functions
