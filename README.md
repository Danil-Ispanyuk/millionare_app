# Millionaire App

## Overview
The **Millionaire App** is a web-based game inspired by the popular TV show *Who Wants to Be a Millionaire*. The game challenges players to answer **12 questions** correctly to progress. If a player answers a question incorrectly, they are directed to a game-over screen.

## Project Concept
- **Gameplay**: Players are presented with a series of 12 multiple-choice questions.
- **Objective**: Answer all questions correctly to win the game.
- **Failure Condition**: An incorrect answer ends the game, leading to a final screen displaying the result.

## Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (version 16 or higher recommended)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## Setup Instructions

### 1. Clone the Repository
Clone the project to your local machine using Git:
```bash
git clone <repository-url>
cd millionaire_app
```

### 2. Install Dependencies
Install the required Node.js modules by running:
```bash
npm install
```

### 3. Configure Environment Variables
The project requires a `.env` file for configuration. Follow these steps:

1. Locate the `.env.example` file in the project root.
2. Create a new file named `.env` in the project root.
3. Copy the contents of `.env.example` into `.env`.
4. Add the following required keys with appropriate values:

   - **NEXT_PUBLIC_BASE_URL**: Set this to the local URL where your project will run. For example:
     ```
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```
   - **SECRET_KEY**: Generate a secure key for encrypting session data. Use the following command to generate a 32-character hexadecimal key:
     ```bash
     openssl rand -hex 16
     ```
     Add the generated key to `.env`, for example:
     ```
     SECRET_KEY=your_generated_key_here
     ```

Example `.env` file:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SECRET_KEY=your_generated_key_here
```

### 4. Run the Project
Start the development server with:
```bash
npm run dev
```
The app will be available at `http://localhost:3000` (or the port specified in your configuration).

### 5. Format the Code
To format the codebase using Prettier, run:
```bash
npm run format
```
This ensures consistent code style across the project. Note that SVG files (images and icons) are ignored by Prettier, as configured in `.prettierignore`.

## Project Structure
- **`app/`**: Contains the Next.js App Router structure, including the `(homepage)` route for the main game page.
- **`.env.example`**: Template for environment variables.
- **`.prettierignore`**: Specifies files (e.g., `*.svg`) to ignore during formatting.
- **`next.config.ts`**: Configures Webpack for SVG handling with `@svgr/webpack`.
- **`package.json`**: Defines scripts (e.g., `dev`, `format`) and dependencies.

## Development Notes
- The project uses **Next.js** with **TypeScript** for a robust development experience.
- SVG files are processed as React components using `@svgr/webpack`.
- Prettier and ESLint are configured for code formatting and linting, with SVG files excluded from formatting.

## Troubleshooting
- **Environment Issues**: Ensure `.env` is correctly set up and not committed to version control (it should be in `.gitignore`).
- **Build Errors**: Clear the Next.js cache if you encounter issues:
  ```bash
  rm -rf .next
  npm run build
  ```
- **Port Conflicts**: If `http://localhost:3000` is unavailable, Next.js will prompt you to use a different port.
- **SVG Issues**: Ensure SVG imports are correctly typed (see `types/svg.d.ts` if TypeScript errors occur).

## Contributing
Feel free to submit issues or pull requests to improve the project. Ensure all code is formatted (`npm run format`) before submitting.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.