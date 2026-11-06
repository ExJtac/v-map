# Presidential county recovery, 2008–2024

The offline importer `scripts/import-presidential-counties.py` produces a separate
supplement in `public/data/presidential-counties/`. It does not edit the MEDSL
baseline. Run it with Python 3 and Poppler `pdftotext`; all necessary raw sources
are already archived under `scripts/source-data/presidential-counties/`.
`provenance.json` pins raw-source SHA-256 values, while `baseline-sha256.json`
pins every original presidential browser JSON. The importer refuses changed
source bytes, validates integer counts, and verifies baseline preservation.

| Election | Added Kalawao candidate votes | Supplement records | Atlas matches after merge | Remaining atlas gaps |
| --- | ---: | ---: | ---: | ---: |
| 2008 | 31 | 3 | 3,113 / 3,142 | 29 Alaska county equivalents |
| 2012 | 27 | 3 | 3,113 / 3,142 | 29 Alaska county equivalents |
| 2016 | 20 | 2 | 3,113 / 3,142 | 29 Alaska county equivalents |
| 2020 | 24 | 2 | 3,113 / 3,142 | 29 Alaska county equivalents |
| 2024 | 18 | 2 | 3,113 / 3,142 | 29 Alaska county equivalents |

There are twelve supplement records: five newly separate Kalawao counties, five
corresponding corrected Maui records, and two name/code recoveries for Oglala
Lakota. Maui replacements and Kalawao additions must be loaded together.
Coverage is measured against the bundled `us-atlas/counties-albers-10m.json`,
which represents 2017 geography; it is not a claim of complete national coverage
or historical boundary equivalence. The manifest records exact missing FIPS for
every cycle before and after these repairs.

## Hawaii: actual official county precinct, no geographic allocation

The [Hawaii Office of Elections results index](https://elections.hawaii.gov/election-results/)
links certified text files and final reports for every imported cycle. Raw text
files are read with their original encoding (2024 UTF-16), preserving split
reporting units and each voting mode. The 2024 file has a `Format#1` preamble and
quoted multiline candidate tickets; the importer uses CSV logical records rather
than treating physical lines as independent records.

* [2008 certified precinct text](https://files.hawaii.gov/elections/files/results/2008/general/media.txt):
  precinct 13-12 has zero election-day votes; **AB-30 contains the county's actual
  absentee votes**, Obama 24, McCain 6, Nader 1. The
  [official statement of vote, page 5](https://files.hawaii.gov/elections/files/results/2008/general/SOV.pdf)
  explicitly identifies AB Mail 30 and AB Walk 30 as `(13:12)` and identifies
  the regular precinct as Kalaupapa Settlement. The
  [official election administration report](https://ags.hawaii.gov/wp-content/uploads/2012/09/oe_report_act_162_slh_2009_02-08-10.pdf)
  identifies Kalawao as Kalaupapa Settlement and documents its mail-only voting.
* [2012 certified precinct text](https://files.hawaii.gov/elections/files/results/2012/general/media.txt),
  [2016 text](https://files.hawaii.gov/elections/files/results/2016/general/media.txt),
  and [2020 text](https://files.hawaii.gov/elections/files/results/2020/general/media.txt):
  use precinct 13-09 with all absentee, early and election vote columns summed.
  The [official Molokai map](https://files.hawaii.gov/elections/files/maps/electionmaps/ISLAND_OF_MOLOKAI.pdf)
  identifies the precinct in Kalaupapa and covers the May 2012 through July 2019
  map editions. The [2016 precinct boundary descriptions, page 37](https://files.hawaii.gov/elections/files/maps/precincttext/Precinct-Boundary-Descriptions-Statewide.pdf)
  delineate 13-09 against the Maui–Kalawao county boundary.
* [2024 certified precinct text](https://files.hawaii.gov/elections/files/results/2024/General/media.txt):
  sum **both** 13-09 reporting splits (regular plus VSC), obtaining Harris 15 and
  Trump 3, not the incomplete regular-split count of 16. The
  [official 2024 House District 13 map](https://files.hawaii.gov/elections/files/maps/Election2024Maps/HD_13.pdf)
  explicitly states that precinct 13-09 is Kalawao County and does not vote in
  County of Maui contests. Both historic and current map pages were rendered
  and inspected during this recovery.

The official administrative County of Maui presidential summaries include this
separately identified Kalawao precinct. The importer parses each named candidate
from page 1 of the official final Maui summary for
[2008](https://files.hawaii.gov/elections/files/results/2008/general/com.pdf),
[2012](https://files.hawaii.gov/elections/files/results/2012/general/com.pdf),
[2016](https://files.hawaii.gov/elections/files/results/2016/general/com.pdf),
[2020](https://files.hawaii.gov/elections/files/results/2020/general/com.pdf), and
[2024](https://files.hawaii.gov/elections/files/results/2024/General/com.pdf).
For every cycle the complete candidate sum equals the original MEDSL Maui total,
and both major-party candidate totals independently equal the baseline. Exact
Kalawao candidate votes are subtracted from those official named-candidate
totals. Each corrected Maui record retains all original administrative candidate
totals, the subtraction source and its original page. County totals reconcile
exactly: corrected Maui plus Kalawao equals the original administrative Maui.

Candidates with zero reported votes remain zero. Blank and overvotes are not
turned into candidates. Hawaii `totalVotes` is the reported candidate sum, not
turnout. No missing vote count, precinct allocation, or county estimate is filled
from population, room labels, proportions or district totals.

## Shannon/Oglala Lakota name/code recovery

The [Census Bureau county change register](https://www.census.gov/programs-surveys/geography/technical-documentation/county-changes.2010.html)
classifies Shannon 46113 to Oglala Lakota 46102 as a name/code change effective
May 1, 2015. The archived
[official National Weather Service notice](https://www.weather.gov/media/notification/pdfs/scn15-44shannon_oglalacty_rem.pdf)
independently gives both old and new names/codes and credits the Census change.
The importer copies the actual 2008 and 2012 MEDSL counts to that identity,
retaining the original historical FIPS and SHA-pinned baseline source. It does
not change candidate counts; generic MEDSL OTHER votes become a separately
labeled reporting category instead of a named candidate.

## Unresolved source and geography limits

* Alaska's official election districts are not its boroughs/census areas. The
  [Alaska Division of Elections results archive](https://www.elections.alaska.gov/election-results/)
  does not justify assigning district totals to the 29 county-equivalent atlas
  polygons. Those areas remain unavailable, not zero-vote records.
* The Census change register documents Bedford independent city 51515 merging
  into Bedford County 51019 in 2013. Historical 2008/2012 city records remain in
  the immutable baseline but lack a separate current atlas polygon. No
  boundary-change estimate or automatic merger is performed. The older county
  record therefore does not establish votes for the entire later polygon.
  MEDSL's obsolete 2016 zero-vote Bedford city placeholder is also unmapped.
* The already downloaded Heideman v1.0.0 archive was inventoried for all five
  cycles before additional downloads. It contains no presidential county absent
  from the baseline, excludes Alaska/Hawaii/DC, and retains obsolete Shannon
  FIPS 46113 for 2024 Oglala Lakota. It was not used to import votes.
* The scope 2006–2026 contains five actual presidential general-election years.
  There is no 2026 presidential general election. This work does not invent a
  2026 presidential layer or borrow returns from another office.

The importer and archived validation demonstrate exact parsing/reconciliation,
source hashing, FIPS-to-atlas membership, nonnegative integer votes, five-cycle
gap inventories and unchanged baseline files. They do not certify the original
MEDSL dataset as a whole or resolve historical boundary mismatches elsewhere.
