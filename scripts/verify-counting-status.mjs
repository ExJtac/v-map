import assert from "node:assert/strict";
import { countingStatus, countingColor } from "../src/counting-status.js";
const status = (rows) => countingStatus(rows).status;
assert.equal(status([]), "unavailable");
assert.equal(status([{ certified: true }]), "complete");
assert.equal(status([{ sourceIsOfficialResults: true }]), "complete");
assert.equal(status([{ resultStatus: "final" }]), "complete");
assert.equal(status([{ precinctReportingPercent: 100, isAllPrecinctsReported: true, unofficial: false }]), "unconfirmed");
assert.equal(status([{ countingStatus: "counting", sourceReportType: "F" }]), "unconfirmed");
assert.equal(status([{ certified: true, sourceReportType: "F" }]), "unconfirmed");
assert.equal(status([{ certified: true, sourceReportType: "SF" }]), "unconfirmed");
assert.equal(status([{ certified: true, sourceReportTypeCode: "F" }]), "unconfirmed");
assert.equal(status([{ certified: true, electionStatus: "unofficial" }]), "unconfirmed");
assert.equal(status([{ certified: true, sourceCountingStatus: "counting" }]), "counting");
assert.equal(status([{ sourceIsOfficial: true, unofficial: true, provisional: true }]), "unconfirmed");
assert.equal(status([{ certified: true }, { provisional: true }]), "unconfirmed");
assert.equal(status([{ sourceCountingStatus: "counting" }]), "counting");
assert.equal(status([{ certified: true, provisional: true }]), "unconfirmed");
for (const party of ["Democrat", "Republican", "Other"]) {
  assert.notEqual(countingColor(party, "complete", "gray"), countingColor(party, "unconfirmed", "gray"));
  assert.equal(countingColor(party, "counting", "gray"), countingColor(party, "unconfirmed", "gray"));
  assert.equal(countingColor(party, "unavailable", "gray"), "gray");
}
assert.equal(countingColor(null, "complete", "gray"), "gray");
assert.equal(countingColor("Unknown", "complete", "gray"), "gray");
console.log("Counting status and color checks passed.");
