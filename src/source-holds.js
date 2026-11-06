// Verified source defects. Raw research snapshots remain unchanged for audit.
export const SOURCE_HOLDS = Object.freeze([
  {
    office: "senate",
    year: 2016,
    geoLevel: "state",
    stateFips: "22",
    contestId: "senate-2016-22-state-general-False",
    reason:
      "This legacy state record combines Louisiana's first round with runoff candidate counts. The FEC reports November 8 Kennedy 482,591 / Campbell 337,833 (1,933,635 total) and December 10 Kennedy 536,191 / Campbell 347,816 (884,007 total) as separate rounds. No combined-round winner or margin is established.",
    sourceURLs: [
      "https://www.fec.gov/resources/cms-content/documents/federalelections2016.pdf",
    ],
    sourceLocation: "Federal Elections 2016, printed page 78",
  },
]);
