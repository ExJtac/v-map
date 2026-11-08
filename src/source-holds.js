// Verified source defects. Raw research snapshots remain unchanged for audit.
export const SOURCE_HOLDS = Object.freeze([
  ...['house','governor'].flatMap(office=>['state','district','county'].map(geoLevel=>({office,geoLevel,...{"year": 2026, "stateFips": "42", "sourceId": "modern-current-2026-pa", "reason": "The saved Pennsylvania 2026 source is under review. Current official feeds are labeled “Unofficial, Testing,” and the saved import’s production status has not been verified. Counts are retained as source evidence and withheld from comparisons and reported-leader listings pending a verified ordinary-results source.", "sourceQualityNote": "The saved Pennsylvania 2026 source is under review. Current official feeds are labeled “Unofficial, Testing,” and the saved import’s production status has not been verified. Counts are retained as source evidence and withheld from comparisons and reported-leader listings pending a verified ordinary-results source.", "reviewReceiptSha256": "73a0db8f44e330c5f5f74c1711a2bc7078cecf23f4378cd5ee09f90b47db9f14", "reviewedAt": "2026-11-07T23:54:32.944178+00:00", "sourceURLs": ["https://www.electionreturns.pa.gov/electionFeed.aspx?ID=82&FeedName=2026+General+Election+-+Results+by+County", "https://www.electionreturns.pa.gov/electionFeed.aspx?ID=83&FeedName=2026+General+Election+-+Results+by+Office", "https://voteranomaly.com/data/source-reviews/pa-2026.json"], "sourceLocation": "Independently reviewed original browser-rendered 2026 county and office RSS channels; both explicitly Unofficial, Testing. Original earlier snapshot lineage remains unresolved."}}))),
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
