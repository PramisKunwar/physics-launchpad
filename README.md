# Physics Launchpad

**Physics Launchpad** is an interactive, web-based **Projectile Motion Virtual Lab** built with **TypeScript + React**.

Designed for **Grade 11–12 physics students**, the project provides a clear, syllabus-aligned way to explore projectile motion concepts through prediction, simulation, and visual analysis.

---

## Purpose

Physics Launchpad aims to make kinematics concepts easier to understand:

- Beginner-friendly TypeScript + React architecture
- Transparent, syllabus-level physics logic
- No air resistance, no wind
- Constant gravitational acceleration
- 2D motion in the x–y plane
- All values expressed in SI units

---

## 🛠 Tech Stack

- **Vite**
- **TypeScript**
- **React**
- **shadcn/ui**
- **Tailwind CSS**

---

## 📂 Project Structure

```
physics-launchpad/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── AimSection.tsx         # Educational aim display
│   │   ├── ControlPanel.tsx       # Input controls & simulation buttons
│   │   ├── EquationsPanel.tsx     # Kinematic equations reference
│   │   ├── Graph.tsx              # Reusable graph component
│   │   ├── GraphPanel.tsx         # Displacement & velocity graphs
│   │   ├── NavLink.tsx            # Navigation component
│   │   ├── PredictionPanel.tsx    # Student prediction inputs
│   │   ├── ResultsPanel.tsx       # Results comparison display
│   │   └── SimulationCanvas.tsx   # 2D trajectory animation
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useSimulation.ts       # Simulation state & animation loop
│   │
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── Index.tsx              # Main application page
│   │   └── NotFound.tsx
│   │
│   ├── physics/
│   │   ├── constants.ts           # Physical constants (gravity, limits)
│   │   ├── equations.ts           # Kinematic equations
│   │   └── types.ts               # TypeScript interfaces
│   │
│   ├── App.css
│   ├── App.tsx
│   ├── index.css                  # Design system & theming
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### **Prerequisites**

- Install **Node.js** and **npm** (recommended via `nvm`)

### **Setup**

```bash
# 1. Clone the repository
git clone https://github.com/YourUsername/physics-launchpad

# 2. Navigate to the project
cd physics-launchpad

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

---

##  Learning Flow

### 1️⃣ Aim

Students explore projectile motion under uniform gravity and connect real-time simulations with theoretical kinematic equations.

### 2️⃣ Predict

Students input:

- Initial velocity (m/s)
- Launch angle (°)
- Gravitational acceleration (default: 9.8 m/s²)

They predict:

- Time of flight
- Maximum height
- Horizontal range

Predictions are stored for later comparison with actual results.

### 3️⃣ Simulate

A 2D animated simulation shows projectile motion using:

- Constant horizontal velocity
- Uniform vertical acceleration
- Standard kinematic equations

Controls:

- ▶️ Play
- ⏸ Pause
- 🔄 Reset

### 4️⃣ Observe

The system displays:

- Calculated (actual) values
- Student predictions
- Differences between prediction and outcome

Visual indicators highlight:

- Maximum height
- Landing point

---

##  Physics Calculations

The project uses clear, syllabus-friendly formulas for:

- Horizontal & vertical velocity components
- Time of flight
- Time to reach maximum height
- Maximum height
- Horizontal range
- Resultant velocity at any time

These are intentionally written to be transparent and classroom-friendly.

---

##  Visualizations

### Trajectory Animation

- 2D x–y motion path
- Real-time updates based on kinematic equations

### Graphs

- Displacement–time
- Velocity–time

These help reinforce physics concepts:

- Velocity = slope of displacement–time
- Acceleration = slope of velocity–time
- Area under velocity–time = displacement

Graphs include labels, units, axes, and legends.

---

##  UI / UX

- Clean, student-friendly layout
- Sliders or text-based input fields
- Tooltips and contextual explanations
- Logical four-step flow: **Aim → Predict → Simulate → Observe**

---

## License

This project is open source and available for educational use.
