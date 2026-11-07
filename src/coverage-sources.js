// Explicit source precedence. Raw snapshots remain separately available for audit.
export const COUNTY_SOURCES = Object.freeze([
  { name: "early-counties", priority: 40 },
  { name: "modern-counties", priority: 40 },
  { name: "county-elections", priority: 60 },
  { name: "offcycle-governors", priority: 80 },
  { name: "california-recall", priority: 90 },
  { name: "presidential-counties", priority: 100 },
  { name: "house-repairs", priority: 100 },
  { name: "state-official", priority: 110 },
  { name: "current-california", priority: 120 },
  { name: "current-governors", priority: 120 },
  { name: "research-house", priority: 130 },
  { name: "research-house-nm", priority: 130 },
  { name: "research-senate", priority: 130 },
]);
