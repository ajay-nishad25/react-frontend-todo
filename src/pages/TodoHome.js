// import React from "react";
// import "styles/todoHome.css";

// export default function TodoHome() {
//   return (
//     <div className="todo-main-container">
//       <div className="todo-app-container">Todo Cards</div>
//     </div>
//   );
// }

import React, { useState } from "react";
import TaskCard from "components/TaskCard";
import "styles/todoHome.css";

const initialTasks = [
  {
    id: 1,
    title: "Learn Django",
    description:
      "Don't try to remember everything, instead use TODO react app.",
    status: "pending",
    createdAt: "29/12/25",
  },
  {
    id: 2,
    title: "Build Todo UI",
    description: "Convert sketch into real world UI using clean components.",
    status: "completed",
    createdAt: "28/12/25",
  },
  {
    id: 3,
    title: "Plan Weekend Trip",
    description: "Shortlist destinations and finalize bookings.",
    status: "pending",
    createdAt: "27/12/25",
  },
  {
    id: 4,
    title: "Review PRs",
    description: "Review open pull requests and add feedback.",
    status: "pending",
    createdAt: "26/12/25",
  },
  {
    id: 5,
    title: "Read Zustand Docs",
    description: "Understand state management using Zustand.",
    status: "completed",
    createdAt: "25/12/25",
  },
  {
    id: 6,
    title: "Update Resume",
    description: "Add recent projects and polish resume content.",
    status: "pending",
    createdAt: "24/12/25",
  },
  {
    id: 7,
    title: "Fix UI Bugs",
    description: "Resolve alignment and spacing issues in UI.",
    status: "pending",
    createdAt: "23/12/25",
  },
  {
    id: 8,
    title: "Optimize API Calls",
    description: "Reduce unnecessary API calls on initial load.",
    status: "completed",
    createdAt: "22/12/25",
  },
  {
    id: 9,
    title: "Write API Docs",
    description: "Document all endpoints with request and response.",
    status: "pending",
    createdAt: "21/12/25",
  },
  {
    id: 10,
    title: "Prepare Demo",
    description: "Create demo data and walkthrough flow.",
    status: "completed",
    createdAt: "20/12/25",
  },
  {
    id: 11,
    title: "Team Sync Meeting",
    description: "Discuss sprint goals and blockers.",
    status: "pending",
    createdAt: "19/12/25",
  },
  {
    id: 12,
    title: "Refactor Components",
    description: "Break large components into reusable ones.",
    status: "completed",
    createdAt: "18/12/25",
  },
  {
    id: 13,
    title: "Design Dark Mode",
    description: "Explore dark mode color palette for app.",
    status: "pending",
    createdAt: "17/12/25",
  },
  {
    id: 14,
    title: "Write Unit Tests",
    description: "Add unit tests for core business logic.",
    status: "pending",
    createdAt: "16/12/25",
  },
  {
    id: 15,
    title: "Deploy to Staging",
    description: "Deploy latest build to staging environment.",
    status: "completed",
    createdAt: "15/12/25",
  },
  {
    id: 16,
    title: "Code Cleanup",
    description: "Remove unused files and console logs.",
    status: "pending",
    createdAt: "14/12/25",
  },
  {
    id: 17,
    title: "Improve Accessibility",
    description: "Add aria labels and keyboard navigation.",
    status: "pending",
    createdAt: "13/12/25",
  },
  {
    id: 18,
    title: "Add Pagination",
    description: "Implement pagination for task list.",
    status: "completed",
    createdAt: "12/12/25",
  },
  {
    id: 19,
    title: "Setup CI Pipeline",
    description: "Configure CI for linting and tests.",
    status: "pending",
    createdAt: "11/12/25",
  },
  {
    id: 20,
    title: "Production Deployment",
    description: "Deploy application to production server.",
    status: "completed",
    createdAt: "10/12/25",
  },
];

export default function TodoHome() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="todo-main-container">
      <div className="todo-app-container">
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
