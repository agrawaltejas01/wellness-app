# User Profile Page

This directory contains the user profile page implementation for the wellness app.

## Features

- **User Icon**: Displays a colorful gradient circular icon with the user's first initial
- **User Information**: Shows user's name and phone number
- **User Statistics**: Displays user's rating and games played count
- **Editable About Me**: Users can edit and save their "about me" section
- **Profile Details**: Shows additional user information like email, gender, and total bookings

## Components

### `user-profile.tsx`
The main user profile page component that includes:
- User avatar with gradient border
- User stats (rating and games played)
- Editable about me section
- Profile details section
- Navigation back to home

### `user-profile.css`
Styling for the user profile page components.

## Navigation

Users can access this page by clicking on their user icon in the homepage banner. The navigation is handled in `src/Pages/home/banner-v2.tsx`.

## Data Sources

- User details: Retrieved from `userDetailsAtom` (Jotai state)
- Rating: Fetched from `/rating` API endpoint
- Games played: Fetched from `/games/played-count` API endpoint
- About me: Stored in localStorage with key `aboutMe_${userId}`

## API Endpoints Used

- `getRatings(userId)`: Gets user's rating for activity ID 1
- `getGamesPlayed(userId)`: Gets user's games played count for activity ID 1

## Analytics

The page tracks the following Mixpanel events:
- `open_user_profile_page`: When the page is opened
- `updated_about_me`: When the user updates their about me section

## Routing

The page is accessible at `/user-profile` route, configured in `src/App.tsx`.
