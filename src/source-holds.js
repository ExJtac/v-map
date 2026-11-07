// Verified source defects. Raw research snapshots remain unchanged for audit.
export const SOURCE_HOLDS = Object.freeze([
  ...['state','district','county'].map(geoLevel=>({
    office:'house',year:2026,stateFips:'22',geoLevel,
    reason:'Louisiana November3,2026 U.S.House voting is an open primary; these imported rows are labeled general without a verified general-election date. Raw source counts are retained, but no qualified general-election leader or historical-general comparison is established. Actual December general records require separate source/round qualification before this hold can be revised.',
    sourceURLs:['https://www.sos.la.gov/elections-voting/types-of-elections','https://www.fec.gov/resources/cms-content/documents/2026pdates.pdf'],
    sourceLocation:'Louisiana Secretary of State Types of Elections: Congressional elections, 2026 U.S.Representative open primary November3/open general December12 if necessary; FEC2026calendar LouisianaHouse row.'
  })),
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
