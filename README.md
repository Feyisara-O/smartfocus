# SmartFocus – Focus smarter. Achieve more.

## Project Overview
SmartFocus is a productivity dashboard designed to help users prioritize tasks, track focus time, and gain real-time insights. It uses a scoring algorithm to calculate task importance based on **urgency** and **impact**, displays a live pie chart of time spent per category, and includes a behavioral insight system that guides the user to focus on high-priority tasks.

## Key Features
- **Task Management**: Add, complete, pause, resume, and delete tasks.
- **Focus Timer**: Track time spent on each task, with pause and resume functionality.
- **Scoring System**: Tasks are scored (max 100) based on urgency and impact.
- **Real-Time Insights**: Alerts when focusing on low-priority tasks or completing high-priority tasks.
- **Pie Chart Visualization**: Shows category-wise time allocation with labels.
- **Celebration Feedback**: Confetti animation when a task is completed.
- **Sound Feedback**: Click and pop sounds, optionally enabled or disabled by the user.
- **Dark Glassmorphism UI**: Modern, high-contrast, responsive design with interactive micro-effects.

## How It Works
1. **Add a Task**: Enter a task name, select category, urgency, and impact. The task receives a score based on the urgency and impact values.
2. **Start Focus**: Select a task to focus on. Timer starts tracking focus time.
3. **Pause / Resume / Stop**: Control the timer while keeping track of cumulative time spent on each task.
4. **Complete Task**: Check the task as done. Confetti animation and optional sound provide feedback.
5. **Insights**: Dashboard displays live insights about task priorities and progress.
6. **Visualization**: Pie chart dynamically updates with time spent per category.

## Dashboard Metrics
- **Top**: Highest-scoring task
- **Avg**: Average score of all tasks
- **Tasks**: Total tasks
- **Done**: Completed tasks
- **Left**: Remaining tasks

## Setup Instructions
1. Clone or download the repository.
2. Open `index.html` in a browser.
3. Use the dashboard immediately. Data is persisted in **localStorage** — no backend required.

Optional: Place your sound files (`pop.mp3`, `click.mp3`) in the `assets` folder or update the HTML `<audio>` elements.

## Tech Stack
- HTML5 for structure and semantic markup
- CSS3 for styling, responsive layout, and Dark Glassmorphism
- Vanilla JavaScript (ES6+) for logic, DOM manipulation, state management, and real-time insights
- SVG for pie chart visualization

## Notes
- Fully responsive and works on mobile, tablet, and desktop.
- No external libraries or frameworks used.
- Designed as a portfolio-ready project to showcase front-end development skills.