// A precinct-reporting percentage and an official publisher do not establish
// that all ballots have been counted. Default/derived statuses are not proof.
const labels = {
  complete: ["Count complete", "The source explicitly identifies the count as final or certified."],
  counting: ["Counting reported", "The source explicitly reports that counting continues."],
  unconfirmed: ["Count not confirmed complete", "Available source evidence does not establish that counting is complete."],
  unavailable: ["Count status unavailable", "No contest records are available."],
};
function rowStatus(row) {
  if (!row || typeof row !== "object") return "unconfirmed";
  // Provisional signals take priority if source metadata conflicts.
  if (row.unofficial === true || row.provisional === true ||
      /^(F|SF|R|U)$/i.test(String(row.sourceReportType || "")) ||
      /^(F|SF|R|U)$/i.test(String(row.sourceReportTypeCode || "")) ||
      /^(unofficial|provisional|not certified)$/i.test(String(row.resultStatus || "")) ||
      /^(unofficial|provisional|not certified)$/i.test(String(row.certificationStatus || "")) ||
      /^(unofficial|provisional|not certified)$/i.test(String(row.electionStatus || "")))
    return "unconfirmed";
  if (/^(counting|counting continues)$/i.test(String(row.sourceCountingStatus || ""))) return "counting";
  if (row.certified === true || row.sourceIsOfficialResults === true ||
      row.final === true || /^(certified|final|complete|count complete)$/i.test(String(row.resultStatus || "")) ||
      /^(certified|final|complete|count complete)$/i.test(String(row.electionStatus || "")))
    return "complete";
  return "unconfirmed";
}
export function countingStatus(rows) {
  let status;
  if (!Array.isArray(rows) || !rows.length) status = "unavailable";
  else {
    const statuses = rows.map(rowStatus);
    status = statuses.every((value) => value === "complete") ? "complete" :
      statuses.includes("counting") ? "counting" : "unconfirmed";
  }
  const [label, reason] = labels[status];
  return { status, label, reason };
}
const palette = {
  Democrat: { complete: "#2862a1", pending: "#83acd9" },
  Republican: { complete: "#ae403c", pending: "#da928b" },
  Other: { complete: "#765b91", pending: "#b49bc8" },
};
export function countingColor(party, status, baseColor) {
  if (!party || !palette[party] || status === "unavailable") return baseColor;
  return palette[party][status === "complete" ? "complete" : "pending"];
}
