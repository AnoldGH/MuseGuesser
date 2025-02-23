# MuseGuesser

MuseGuesser is an interactive multiplayer trivia game that challenges players' music knowledge through an engaging, competitive format. Players compete in real-time to answer questions about songs played through Spotify, testing both their music expertise and quick-thinking abilities.

## Features

- **Multiplayer Music Trivia**: Compete with friends in real-time to identify and answer questions about songs
- **Spotify Integration**: Seamless integration with Spotify's vast music library to source songs and audio
- **Dynamic Scoring System**: Points awarded based on:
  - Speed of response
  - Answer accuracy
  - Consistent performance
- **User Accounts**: Create personal profiles to:
  - Track game history
  - Create custom game sessions
  - Share games with friends
- **Daily Challenges**: Special daily competitions with ranked leaderboards for music enthusiasts

## Prerequisites

- Node.js version 20.10 or higher
- npm (comes with Node.js)

## Installation

1. Clone the repository to your local machine
2. Navigate to the project root directory

### Install Dependencies

Run the following commands in order:

```bash
# Install project dependencies
npm ci

# Install frontend dependencies
npm --prefix ./frontend install ./frontend

# Install additional project dependencies
npm install

# Install backend dependencies
npm --prefix ./backend install ./backend

# Build the project
npm run build
```

## Testing

To run the test suite, execute the following commands:

```bash
# Run individual test files
npx jest ./backend/__test__/dumbProxy.test.js
npx jest ./backend/__test__/questionSet.test.js
npx jest ./backend/__test__/room.test.js

# Alternatively, to run all tests in the backend directory
npx jest ./backend/__test__
```

## Running the Application

### Start the Backend Server

From the project root directory:

```bash
cd backend
npm start
```

The backend server will start and listen on its configured port (typically 3000 or 8000).

### Start the Frontend Server

Open a new terminal window, navigate to the project root directory, and run:

```bash
cd frontend
npm start
```

The frontend development server will start and automatically open your default browser to the application (typically at http://localhost:3000).

## Project Structure

```
.
├── frontend/         # Frontend application
├── backend/         # Backend server
│   └── __test__/   # Backend tests
└── ...
```

## Troubleshooting

If you encounter any issues:

1. Make sure you're using Node.js version 20.10 or higher
2. Clear your node_modules and try reinstalling:
   ```bash
   rm -rf node_modules
   rm -rf frontend/node_modules
   rm -rf backend/node_modules
   ```
   Then follow the installation steps again

## Contributing

Please make sure all tests pass before submitting any pull requests:
```bash
npx jest ./backend/__test__
```