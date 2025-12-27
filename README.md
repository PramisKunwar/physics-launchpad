- Physics Launchpad
A simple, educational, web-based Projectile Motion Virtual Lab built with TypeScript.
Designed for Grade 11–12 physics students studying Kinematics, this project provides an interactive way to explore projectile motion concepts.

- Project Goals
Beginner-friendly codebase with clear TypeScript + React structure.
No advanced mathematics — physics logic is transparent and syllabus-aligned.

Helps students understand ideal projectile motion under assumptions:
Uniform gravitational acceleration
No air resistance or wind
Motion in two dimensions (x–y plane)
All values in SI units

- Tech Stack
This project is built with:
Vite
TypeScript
React
shadcn-ui
Tailwind CSS

📂 Repo Structure
Code
physics-launchpad/
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   └── Breadcrumbs/
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions & physics logic
│   ├── pages/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── app.css
│   └── physics/            # Core physics syllabus + motion logic
├── components.json
├── eslint.config.js
├── bun.lockb
└── README.md

- Getting Started
Prerequisites
Install Node.js  & npm (recommended via nvm).

Setup
bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev


📚 Learning Flow
1️⃣ Aim
Study projectile motion under uniform gravity and verify kinematic equations.

2️⃣ Predict
Students input:
Initial velocity (m/s)
Launch angle (degrees)
Gravitational acceleration (default: 9.8 m/s²)

They predict:
Time of flight
Maximum height
Horizontal range

Predictions are stored for later comparison.

3️⃣ Simulate
Interactive 2D canvas animation:
Constant horizontal velocity
Uniform vertical acceleration
Motion via standard equations

Controls:
▶️ Play
⏸ Pause
🔄 Reset
4️⃣ Observe

Displays:
Calculated (actual) values
Student predictions
Differences between predicted and actual results

Highlights:
Maximum height point
Landing point

- Physics Calculations
Explicit kinematic equations for:
Horizontal & vertical velocity components
Time of flight
Time to reach maximum height
Maximum height
Horizontal range
Resultant velocity at any time
Formulas are kept readable and syllabus-friendly.

- Visualizations
Trajectory: 2D animated projectile path (x–y plane)

- Graphs:
Displacement–time
Velocity–time

- Reinforce key concepts:
Velocity = gradient of displacement–time graph
Acceleration = gradient of velocity–time graph
Displacement = area under velocity–time graph
Graphs include axes, units, legends, and labels.

- User Interface
Clean, student-friendly layout
Input fields or sliders
Clear buttons
Tooltips & explanations
Logical flow: Aim → Predict → Simulate → Observe