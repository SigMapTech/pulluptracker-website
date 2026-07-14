const routes = {
  home: {
    title: "Home",
    description: "View today's progress and your recent pull-up entries.",
  },
  stats: {
    title: "Statistics",
    description: "Review your pull-up trends, totals, and progress.",
  },
  history: {
    title: "History",
    description: "Browse your complete pull-up workout history.",
  },
  records: {
    title: "Records",
    description: "See your streaks and personal pull-up records.",
  },
  add: {
    title: "Add an entry",
    description: "Open Pull-Up Tracker and log a pull-up set.",
  },
  "weekly-report": {
    title: "Weekly report",
    description: "Open your latest weekly pull-up report.",
  },
  "monthly-report": {
    title: "Monthly report",
    description: "Open the requested monthly pull-up report.",
  },
};

const route = window.location.pathname.split("/").filter(Boolean).at(-1);
const destination = routes[route];

if (destination) {
  document.title = `${destination.title} — Pull-Up Tracker`;
  document.querySelector("[data-app-link-title]").textContent = destination.title;
  document.querySelector("[data-app-link-description]").textContent = destination.description;
}
