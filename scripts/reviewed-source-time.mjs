/** Two source-specific reviewed unknown-time receipts; never infer a clock. */
export function approvedUnknownSourceTime(row,data){
 const source=data.sources?.[row.sourceId];
 if(!source||data.year!==2026||row.sourceReviewDate!=='2026-11-07'||row.retrievedAt!==null||row.sourceUpdatedAt!==null||source.retrievedAt!==null||source.sourceReviewDate!==row.sourceReviewDate)return false;
 if(row.sourceId==='ky-house-current-state-controls')return row.geoLevel==='district'&&row.stateFips==='21'&&data.office==='house'&&source.evidenceSha256==='2b9107869a6bfaf28b009a300b9defeef08570a70f7ba01096f48b4f85385464'&&source.sourceFormat==='saved primary web-reader extraction, not downloaded HTML/PDF bytes'&&/Exact control-page request timestamp unavailable/.test(source.retrievedAtBasis||'');
 if(row.sourceId==='fl-senate-indexed-state-controls-2026')return row.geoLevel==='state'&&row.stateFips==='12'&&data.office==='senate'&&row.special===true&&row.electionDate==='2026-11-03'&&row.asOf===null&&row.retrievedDate==='2026-11-07'&&source.retrievedDate===row.retrievedDate&&source.sourceUpdatedAt===null&&source.evidenceSha256==='a7a722d47ccbdb2946cb8a342c3d53a889336a2d05ddf66c918f31fc989a2f38'&&source.approvalReceiptSha256==='a4270d7bc57cb3b6183f15115a6f0eb7ba6c6387926be881e9d415019e0a4e7d'&&source.sourceFormat==='saved primary indexed summary extraction; original summary body not retrieved'&&/Exact successful indexed-summary retrieval timestamp unavailable/.test(source.retrievedAtBasis||'');
 return false;
}
