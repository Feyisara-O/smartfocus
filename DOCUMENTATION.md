SmartFocus Documentation

Project Overview

SmartFocus is a productivity dashboard that helps users prioritize tasks, track focus time, and manage cognitive load. Tasks are scored based on urgency and impact, and users receive real-time insights to work smarter.

Key Features:

Task list with urgency and impact scoring (0–100)

Timer with start, pause, resume, and stop functionality

Pie chart visualization showing time spent by category

Real-time behavioral insights

Confetti animation for task completion

Sound effects with toggle on/off


Folder Structure

SmartFocus/
│
├─ index.html       # Main interface
├─ css/
│   └─ style.css    # Styling with Dark Glassmorphism aesthetic
├─ js/
│   └─ script.js    # Task management, timer, insights, chart, confetti
├─ sounds/
│   ├─ pop.mp3      # Task completion sound
│   └─ click.mp3    # Button click sound
├─ README.md        # Project overview for GitHub
└─ DOCUMENTATION.md # This detailed documentation

HTML Structure

Semantic elements (header, main, section, footer)

Task input form: title, urgency, impact, category, add button

Task list container with checkboxes and delete buttons

Timer panel with start, pause, resume, stop controls

Pie chart using SVG to visualize time per category

Insight panel for real-time suggestions


CSS Design

Dark Glassmorphism: semi-transparent cards with backdrop blur

Primary accents: Neon Teal for buttons, sliders, and highlights

Typography: Serif headers for scores, Sans-Serif for labels and body

Responsive layout: mobile-first with Flexbox and CSS Grid

Micro-interactions: hover effects, glowing sliders, confetti animation


JavaScript Logic

Task Management

Tasks stored in localStorage for persistence

Each task has: id, title, urgency, impact, category, score, completed, timeSpent

Task score formula:


score = (urgency / 10 * 50) + (impact / 10 * 50)

Tasks sorted by completed status and score for rendering


Timer System

Supports start, pause, resume, and stop

Time tracked per task and stored in timeSpent

Updates pie chart and task list in real-time


Insights Engine

Provides behavioral feedback based on active task and high-scoring tasks

Warns when a high-priority task is ignored

Confirms focus on high-value tasks


Pie Chart

Uses SVG arcs to represent category-wise time allocation

Labels inside chart segments indicate the category

Updates dynamically as tasks are completed


Confetti & Sound

Confetti triggers when a task is completed

Sound effects for task completion and button clicks

Toggle option to enable/disable sounds


Event Delegation

taskList uses event listeners for checkboxes and delete buttons

Dynamic updates ensure all new tasks respond to clicks without additional listeners


Accessibility & Performance

Keyboard-friendly input and buttons

Minimal DOM manipulation for efficiency

Vanilla JavaScript ensures no external dependencies


Future Improvements

Offline functionality using Service Workers

Multi-user support with backend integration

Deep Work mode analytics and focus streak tracking.