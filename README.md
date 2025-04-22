# Millionaire App

The Millionaire App is a web-based game inspired by "Who Wants to Be a Millionaire." The game consists of 12 questions that players must answer correctly to progress. An incorrect answer leads to the game-over screen.

## Prerequisites

- Node.js (v16 or higher)
- npm
- Git

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd millionaire-app
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root of the project by copying the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with the following keys:

   - `NEXT_PUBLIC_BASE_URL`: Set this to your local project URL (e.g., `http://localhost:3000`).
   - `SECRET_KEY`: Generate a secure key for session encryption using:
     ```bash
     openssl rand -hex 16
     ```
     Copy the generated key to the `SECRET_KEY` field.
   - `UPSTASH_REDIS_REST_URL`: Obtain this from your Upstash Redis account for session storage.
   - `UPSTASH_REDIS_REST_TOKEN`: Obtain this from your Upstash Redis account for session storage.

## Running the Project

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the URL specified in `NEXT_PUBLIC_BASE_URL`).

## Formatting

To format the codebase, run:
```bash
npm run format
```

## Project Structure

- `.env.example`: Template for environment variables.
- `.env`: Local environment variables (not tracked by Git).
- `src/`: Source code for the application.

## Game Concept

- Players answer 12 questions in sequence.
- A correct answer advances to the next question.
- An incorrect answer ends the game and directs the player to the game-over screen.

## Technologies Used

- Next.js
- Upstash Redis (for session storage)
- Node.js

## Contributing

Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License.