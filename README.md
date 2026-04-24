# CloudMuse

A whimsical content alchemist that transforms your thoughts into heavenly scrolls, flying postcards, and crystals of essence.

## Project Structure
- `/app/backend`: FastAPI server with MongoDB integration.
- `/app/frontend`: React (Vite) application with Tailwind CSS and Framer Motion.

## Setup Instructions

### 1. MongoDB
Ensure you have MongoDB installed and running on your system.
The default connection string is `mongodb://localhost:27017`.

### 2. Backend
1. Navigate to the backend directory:
   ```bash
   cd app/backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
   ```
3. Update `.env` if necessary (especially `EMERGENT_LLM_KEY`).
4. Run the server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

### 3. Frontend
1. Navigate to the frontend directory:
   ```bash
   cd app/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Key Features
- **Sky Background**: Immersive shifting gradient with drifting clouds and shooting stars.
- **Topic Cloud**: Whimsical input area with morphing cloud shapes and floating particles.
- **Magical Loader**: Enchanting sequence that "gathers clouds" and "weaves constellations".
- **Dynamic Outputs**: 
  - **Blog Scroll**: A parchment-like container for long-form content.
  - **LinkedIn Postcard**: A paper bird that unfolds into a postcard.
  - **Summary Orb**: A glowing crystal containing the essence of your thought.
- **Sound Toggle**: Optional ambient wind chimes for a complete sensory experience.
- **Dream Archive**: Sidebar to revisit your past whispers.

Enjoy your journey through the clouds! ☁️✨
