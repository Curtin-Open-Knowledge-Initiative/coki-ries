# ERA 2018 Method Notes

- [ERA 2018 Method Notes](#era-2018-method-notes)
  - [ERA 2023](#era-2023)
  - [ERA 2018](#era-2018)
    - [Field of Research (FoR)](#field-of-research-for)
    - [Higher Education Provider (HEP)](#higher-education-provider-hep)
    - [ERA Rating Scale](#era-rating-scale)
    - [Journals](#journals)
    - [Articles](#articles)
    - [Low Volume Threshold](#low-volume-threshold)
  - [Indicators](#indicators)
    - [Indicator: Interdisciplinary Profiles](#indicator-interdisciplinary-profiles)
    - [Indicator: Low Volume Thresholds](#indicator-low-volume-thresholds)
    - [Indicator: Research Outputs](#indicator-research-outputs)
    - [Indicator: Research Outputs by Year](#indicator-research-outputs-by-year)
    - [Indicator: Publishing Profile](#indicator-publishing-profile)
    - [Indicator: Relative Citation Impact (RCI)](#indicator-relative-citation-impact-rci)
      - [Benchmark: Global Citations Per Paper (CPP)](#benchmark-global-citations-per-paper-cpp)
      - [Benchmark: Local Citations Per Paper (CPP)](#benchmark-local-citations-per-paper-cpp)
      - [Weighting](#weighting)
    - [Indicator: Distribution of Papers Based on Global Centiles](#indicator-distribution-of-papers-based-on-global-centiles)
    - [Indicator: Distribution of Papers by RCI Classes](#indicator-distribution-of-papers-by-rci-classes)
  - [Data](#data)
    - [2018 HEPs](#2018-heps)
    - [2008 2-digit FoR codes](#2008-2-digit-for-codes)
    - [2008 4-digit FoR codes](#2008-4-digit-for-codes)
    - [2020 2-digit FoR codes](#2020-2-digit-for-codes)
    - [2020 4-digit FoR codes](#2020-4-digit-for-codes)

## ERA 2023

- Evaluation window: 2016-2021 inclusive.
- Official website: [ARC](https://www.arc.gov.au/excellence-research-australia/era-2023)
- Journal list: TBA in 2022.
- Uses 2020 FoR codes: [list below](#2020-4-digit-for-codes). Source: [ANZSRC 2020](https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release)
- Methodology: TBA
- **The rest of this document applies only to ERA 2018**

## ERA 2018

- Evaluation window: 2011-2016 inclusive.
- Official website [ARC](https://www.arc.gov.au/excellence-research-australia/key-documents)
- Journal list: [ARC](https://www.arc.gov.au/excellence-research-australia/era-2018-journal-list)
- Uses 2008 FoR codes: [list below](#2008-4-digit-for-codes). Source: [ANZSRC 2008](https://www.abs.gov.au/AUSSTATS/abs@.nsf/allprimarymainfeatures/1641059E192F00DFCA2585960012B86F?opendocument=)
- Methodology: [ERA 2018 Evaluation Handbook][ERA Handbook]

### Field of Research (FoR)

- See: [ERA Handbook], Section 1.4.
- Scientific disciplines are arranged in a hierarchy, three levels deep.
- Each discipline is referred to using a field-of-research code (FoR).
- FoR codes at level 1 have two digits.
- FoR codes at level 2 have four digits (adding two to the parent code).
- FoR codes at level 3 have six digits (adding two to the parent code).
- Leading zeros are used.
- The university submits data for ERA only at the 4-digit code level.
- ARC analyses data at the 2 and 4-digit level.

### Higher Education Provider (HEP)

- See: [ERA Handbook], Appendix M, or [list below](#2018-heps)
- Australian HEPs participate in ERA and are each assessed according to the impact of works produced by authors at the institution.
- Articles are assigned to fields of research, according to the percentage contribution specified by the institution, then metrics are calculated to compare the institution's performance to global averages and to the local averages from Australian HEPs.
- Each HEP is assessed for each field of research (FoR) and for each year in the ERA analysis period.
- The performance of an HEP (by FoR,year) is reported against global and local benchmarks.

### ERA Rating Scale

- See: [ERA Handbook], Section 3.2.
- For each institution, ERA reports an output rating for each FoR:
  - 5: well above world standard
  - 4: above world standard
  - 3: at world standard
  - 2: below world standard
  - 1: well below world standard
  - n/a: does not meet the low volume threshold
  - n/r: not rated due to quality control concerns in the data

### Journals

- The ARC publishes a list of approved journals that are used in the ERA process: [ERA 2018 Journal List](https://www.arc.gov.au/excellence-research-australia/era-2018-journal-list)
- ERA analysis is conducted at the whole journal level and at the article level.
- Only articles that are published within approved journals are considered for analysis.
- To qualify for the list, each journal must have at least one ISSN and be active during the evaluation window.
- At a minimum, each journal record has:
  | field           | description |
  | --------------- | ----------- |
  | `era_id`        | unique journal ID within the ERA database |
  | `title`         | journal title in English |
  | `foreign_title` | non-English title (if applicable) |
  | `for_codes`     | at least one and up to three FoR codes (2-digit or 4-digit) |
  | `issns`         | at least one ISSN or linking ISSN |
- Each journal may be assigned up to three FoR codes.
- If research cannot be encompassed by 4-digit codes, then 2-digit codes may be used.
- If research cannot be encompassed by 2-digit codes, then the journal will be assigned "MD" (multi-disciplinary).
- When calculating benchmarks for 4-digit FoR metrics, journals without any 4-digit assignment are excluded.
- One exception is that 2-digit coding may be reassigned to 4-digit codes if at least 25% of submitted articles belong to a specific 4-digit FoR (ARC decides this).

### Articles

- See: [ERA Handbook], Section 1.3, Section 1.6, Section 4.7, and Appendix I.
- A submitted research article (by an HEP) is only included in the ERA analysis if it:
  - is a valid scientific work according to the **ERA 2018 Submission Guidelines**;
  - is of the right type (journal article, review, conference paper, etc);
  - was published within the analysis period;
  - was significantly contributed to by authors from the HEP;
  - was published by a journal listed in the ERA 2018 Journal List (Section 4.7); and
  - has been assigned an index by the citation data provider (Clarivate), such as a DOI (digital object identifer).
- At a minimum, each journal article record has:
  | field         | description |
  | ------------- | ----------- |
  | `index`       | globally unique ID provided by Clarivate (typically a DOI) |
  | `title`       | article title in English
  | `year`        | year of publication |
  | `n_cited`     | number of times the article has been cited
  | `for_1`       | 1st 4-digit FoR code |
  | `for_2`       | 2nd 4-digit FoR code if appropriate |
  | `for_3`       | 3rd 4-digit FoR code if appropriate |
  | `weight_1`    | fractional weighting for `for_1` |
  | `weight_1`    | fractional weighting for `for_2` if appropriate |
  | `weight_1`    | fractional weighting for `for_3` if appropriate |
- Each article can be assigned up to three 4-digit FoR codes (Section 4.7).
- For a journal article, each 4-digit FoR that is chosen should not conflict with the parent journal's FoRs.
- If an article has at least 66% of its content that does not conform to the journal's code, then an exception may be made to assign the code to the article (reassigment exception rule).
- Each assigned FoR code must account for at least 20% of the article's work.
- If a journal has a 2-digit code then an article may use any 4-digit code encompassed by the 2-digit code.
- If a journal has the "MD" code (multidisciplinary) then an article may use any 4-digit code.
- Each 4-digit FoR code is given a percentage assignment, summing to 100%.
- When being analysed by citations, an article is only compared to peer-group articles from the same year of publication (year specific benchmarks). This is an attempt to reduce time-bias as older papers accumulate more citations.
- Multiple HEPs may submit the same article for analysis because there may be cross-institutional authorship. The ARC deduplicates as required and averages out FoR fractions where they conflict.
- the ERA process does not average out data across all the years of the analysis window. Instead it converts to year-normalised measures, that can then be compared directly or aggregated across the ERA analysis time window.

### Low Volume Threshold

- See: [ERA Handbook], Section 1.5.1 and Appendix I.1.2.
- For each (HEP, 4-digit FoR) the sum of all the articles' fractional assignments to the FoR is calculated.
- This sum is across all years of the analysis period and is not rounded. (TODO: double check that it's not yearly).
- When aggregating scores, journal articles count for a maximum of 1.0, whereas books count for a maximum of 5.0.
- If the sum falls below 50 (low volume threshold) then the 4-digit FoR is not evaluated / reported on for that institution.
- However, for the purposes of 2-digit FoR analysis (aggregation), these tallies are included.
- Low volume tallies are also included when computing local or global benchmarks.

## Indicators

ERA reports a number of indicators, not all of which are related to this work. The following table shows which ERA indicators are included here:

| Indicator Title | Handbook Section | Included | Notes |
| --------------- | ---------------- | -------- | ----- |
| [Interdisciplinary profiles]      | 5.1.1 | Yes | |
| [Low volume thresholds]           | 5.1.2 | Yes | |
| [Research outputs]                | 5.3.1 | Yes | |
| FTE profile by academic level     | 5.3.2 | No  | |
| [Research output by year]         | 5.3.3 | Yes | journal articles only |
| [Publishing profile]              | 5.4   | Yes | journal articles only |
| [Relative citation impact]        | 5.5.1 | Yes | |
| [Distribution by world centile]   | 5.5.2 | Yes | |
| [Distribution by RCI classes]     | 5.5.3 | Yes | |
| Peer review                       | 5.6   | No  | |
| Research income                   | 5.7   | No  | |
| Patents                           | 5.8.1 | No  | |
| Research commercialisation income | 5.8.2 | No  | |
| Registered designs                | 5.8.3 | No  | |
| Plant breeder's rights            | 5.8.4 | No  | |
| NHMRC endorsed guidelines         | 5.8.5 | No  | |

### Indicator: Interdisciplinary Profiles

- See: [ERA Handbook], Section 5.1.1
- For each (HEP, 4-digit FoR) and each (HEP, 2-digit FoR), this summary shows the total apportioned outputs for the FoR, alongside a list of other FoRs that it is co-reported with (sorted by frequency descending).
- This is useful for highlighting interdisciplinary activity / crossover.
- Example for 0903, showing co-listing with other fields (by frequency):
  | Code | Name | Num Articles | Sum Portions | Percentage |
  | --- | --- | --- | --- | --- |
  | 0903 | Biomedical Engineering              | 473 | 257.7 | 54% |
  | 0906 | Electrical & Electronic Engineering | 105 |  55.8 | 12% |
  | 1103 | Clinical Sciences                   |  78 |  35.9 |  8% |
  | 1106 | Human Movement and Sports Science   |  65 |  28.6 |  6% |
  | ...  | ...                                 | ... |   ... | 20% |
- Where:
  | field          | description |
  | -------------- | ----------- |
  | `code`         | four digit field of research code, eg: 0903 |
  | `name`         | the title of the research field, eg: Biomedical Engineering |
  | `num_articles` | the total number of articles that contributes to the tally |
  | `sum_portions` | the sum of fractional assigments to the FoR code by these articles |
  | `percentage`   | net_portions / net_articles |

### Indicator: Low Volume Thresholds

- See: [ERA Handbook], Section 5.1.2
- For each (HEP, 2-digit FoR), this shows a list of all sub-disciplines (4-digit FoRs) with their apportioned counts.
- The aim is to quickly indicate which 4-digit FoRs are not meeting the low volume threshold.
- Numbers are tallied across all years of the ERA time period (TODO: double check that it's not by year)
- For a given HEP:
  | field          | description |
  | -------------- | ----------- |
  | `code_2`       | the encompasing 2-digit field of research |
  | `code_4`       | the 4-digit field of research |
  | `name`         | name of the field of research |
  | `sum_portions` | the sum of fractional assignments to the FoR code by all submitted articles |
  | `low_vol_flag` | true if the count is below 50 (the low volume threshold) |

### Indicator: Research Outputs

- See: [ERA Handbook], Section 5.3.1
- For each (HEP, 4-digit FoR) this metric provides a tally of total outputs, broken down by output type (book, book chapter, journal article, etc).
- Numbers are tallied across all years of the ERA period.
- Tallies use fractional assignments (work portions) to FoR codes and are not rounded.
  | field         | description |
  | ------------- | ----------- |
  | `output_type` | book, book chapter, journal article, conference pubication, etc |
  | `output_net`  | tally of all work-portions assigned to this FoR for this type |
  | `output_pct`  | percentage of all output. Ie: net(one_type) / net(all_types) |
  | `hep_pct`     | the percentage contribution that this record makes to the total Australian benchmark for this output type and FoR code. Ie: net(one_type,one HEP) / net(one_type,all HEPs) |

### Indicator: Research Outputs by Year

- See: [ERA Handbook], Section 5.3.3
- For each (HEP, 4-digit FoR) this metric shows the tally of outputs, broken down by output type, for each year of the analysis period.
- Tallies use the fractional FoR assignments and are not rounded.
- There is no comparison to other HEPs.
  | type | 2011 | 2012 | 2013 | ... |
  | ---- | ---- | ---- | ---- | --- |
  | book            | 105.6 | 121.9 | 136.1 | |
  | book chapter    | 201.4 | 264.1 | 273.4 | |
  | journal article | 511.3 | 621.4 | 703.2 | |
  | ... | | | | |

### Indicator: Publishing Profile

- See: [ERA Handbook], Section 5.4
- For each 4-digit FoR, this metric shows which journals are publishing the most in this area.
- It uses global outputs and is not limited to HEP outputs.
- Rows are sorted by publishing frequency (highest to lowest).
- A different table is published for each output type (books, articles, etc). In this analysis, only the journal table is considered.
  | field            | description |
  | ---------------- | ----------- |
  | `id`             | the ERA id of the journal |
  | `title`          | the English title of the journal |
  | `articles_net`   | tally of apportioned counts for the FoR (sorted descending) |
  | `articles_pct`   | percentage of total apportioned counts |
  | `cumulative_pct` | cumulative percentage of apportioned counts |

### Indicator: Relative Citation Impact (RCI)

- See: [ERA Handbook], Section 5.5.1 and Appendix I.4.3
- Citation data, used to compute citation metrics, is provided by [Clarivate](https://www.arc.gov.au/news-publications/media/media-releases/clarivate-selected-citation-provider-era-2018)
- Citation analysis is only done for FoRs that satisfy requirements (shown in the ERA 2018 Discipline Matrix)
- The number of non-indexed (by Clarivate) articles is recorded.
- For each paper, and for each FoR assignment, two RCIs are calculated, one against the relevant Global Benchmark(year, FoR) and the other against the Local Benchmark(year, FoR). This is because ERA's primary analysis is at the FoR level, so a paper can contribute to several separate FoR analyses (apportionment/weighting is applied).
- An RCI score is computed by comparing the number of citations a paper has received to a benchmark of expected citations per paper, given the field of research and publication year.
- For each FoR, a pair of benchmarks (world,local) is calculated separately for each year of the ERA analysis period.
- The article's year of publication is used to choose the appropriate benchmarks. This helps to reduce time-bias (older papers accumulate more citations).
- The local benchmark includes only papers associated with Australian HEPs.
- If a paper has an RCI of >= 8 (800% of average), then a warning is triggered. Percentile analysis may be more appropriate.
- When calculating the RCI for an entire FoR, the RCI is the weighted average of all papers' RCIs within that FoR. This can be yearly or combined as paper RCIs are time-normalised. (Weighting is determined by fractional FoR assignment).
- If a FoR has less than 75 indexed papers, then a warning is shown to look at centiles and RCI class analysis.
- Where a 4-digit FoR has < 250 articles, between all HEPs combined, then a low-volume warning is triggered.
- Benchmarks include all journal articles, even if they were in groups that failed to meet the low volume threshold.
- If a benchmark value is zero, the paper's RCI will not be included in the calculation.
- For each (HEP, FoR) the following summary statistics are computed:
  | field            | description |
  | ---------------- | ----------- |
  | `net_portions`   | the sum of apportioned counts for indexed papers |
  | `rci_global`     | weighted average CPP / global average CPP) |
  | `rci_local`      | weighted average CPP / Australian HEP average CPP) |
  | `pct_indexed`    | the percentage of papers indexed by Clarivate |
  | `hep_pct_papers` | net_portions / sum of all HEPs' net_portions |
  | `hep_pct_cites`  | net_citations / sum of all HEPs' net_citations |

#### Benchmark: Global Citations Per Paper (CPP)

- See: [ERA Handbook], Appendix I.2.1, I.3.1 and I.4.1
- The global dataset contains all articles published by journals listed in the ERA Journal List, within the ERA evaluation period.
- Unlike articles that have been submitted to ERA by HEPs, the exact FoR assignments and fractions, for individual papers, are not known. Instead, each article inherits the FoRs that have been assigned (by ERA) to the encompassing journal.
- The paper counts as +1 to each FoR it inherits (there is no fractional assignment). (Appendix I.3.1).
- The citations for the paper are also fully counted in each FoR code. They are not divided up between different codes, or weighted. (Appendix I.3.1).
- Papers are grouped by (year, FoR) to produce a citation benchmark for each group.
- The metric only includes journal articles, reviews and conference papers.
- The formula for each global benchmark is:

  ```js
  Global CPP Benchmark(year,FoR) = SUM(num_citations(year,FoR)) / SUM(num_articles(year,FoR))
  ```

#### Benchmark: Local Citations Per Paper (CPP)

- See: [ERA Handbook], Appendix I.2.2, I.3.1 and I.4.2
- The local dataset contains all articles published by journals listed in the ERA Journal List, that are associated with Australian HEPs.
- This dataset must undergo de-duplication because cross-institutional authorship can result in the same paper being submitted multiple times.
- During deduplication, when the percentages assigned to FoR codes are different between institutions, then the average of each code is taken to produce a hybrid result. The hybrid is then used for the local benchmark.
- Because papers are typically limited to assigning FoR codes that are inherited from the journal, it should be a relatively rare occurrence that duplicated papers result in an FoR set with more than three codes. It is the ARC's job to resolve this if it occurs.
- The formula for each local benchmark is:

  ```js
  Local CPP Benchmark(year,FoR) = SUM(num_citations(year,FoR)) / SUM(num_articles(year,FoR))
  ```

#### Weighting

1. For each (HEP, year, FoR), the RCI for each individual paper is calculated. Note that this does not take into account apportionment. All citations are counted fully into each FoR to which the paper is assigned. The RCI is computed against the global and local benchmarks:

   ```js
     article_rci_world = article_num_citations / benchmark_cpp_world(year,FoR);
     article_rci_local = article_num_citations / benchmark_cpp_local(year,FoR);
   ```

2. Weighting is applied when calculating the RCI for an entire FoR. For each article in the (year, FoR) group, the papers' RCI scores are weighted according to their FoR apportionment:

   ```js
     article_rci_world_weighted = article_rci_world * article_FoR_fraction;
     article_rci_local_weighted = article_rci_local * article_FoR_fraction;
   ```

3. The final RCI score for the (year, FoR) is then the average of these weighted paper RCIs:

   ```js
     FoR_rci_world = AVERAGE([article_rci_world_weighted]);
     FoR_rci_local = AVERAGE([article_rci_local_weighted]);
   ```

### Indicator: Distribution of Papers Based on Global Centiles

- See: [ERA Handbook], Section 5.5.2, Appendix I.4.5
- For each (HEP, year, FoR) grouping, analysis is conducted against a Global Benchmark, and a Local Benchmark.
- The global analysis considers all acceptable papers within the ERA analysis period.
- The local analysis filters papers to only include works produced by Australian HEPs.
- Articles are grouped by (year, FoR) then sorted by the number of times each article has been cited (descending), according to Clarivate.
- Centiles are defined as the top: 1%, 5%, 10%, 25%, 50% (median) and 100% (total) of papers, sorted by citation count.
- **NOTE:** this analysis does not use weightings to adjust citation counts. If a paper has multiple FoRs, then the full citation count is used for each separate FoR analysis. Weighting is only involved when tallying paper counts.
- **NOTE:** when tallying paper counts, the contribution made by a specific paper is adjusted by the FoR weighting for that paper. For example, if a paper has been assigned to FoR:4904 at 80% and FoR:4905 at 20%, then the paper will contribute +0.8 to the centile tally of FoR:4904 and +0.2 to the centile tallly of FoR:4905.
- if a centile band lower bound cannot be assigned for a paper, then it will not be included in a centile band.
- if a centile band lower threshold is 0, then uncited papers will be included in the band and also displayed in the 'uncited' row.
- the count of uncited papers is always shown.
- Example (not all fields shown):
  | `centile` | `papers_net` | `papers_pct` | `local_pct` |
  | --- | --- | --- | --- |
  | `top_1`   | float | float | float |
  | `top_5`   | float | float | float |
  | `top_10`  | float | float | float |
  | `top_25`  | float | float | float |
  | `median`  | float | float | float |
  | `total`   | float | float | float |
  | `uncited` | float | float | float |
- Where:  
  | field        | description |
  | ------------ | ----------- |
  | `top_1`      | first percentile (top 1%), sorted by number of citations descending |
  | `top_5`      | ...top 5% |
  | `top_10`     | ...top 10% |
  | `top_25`     | ...top 25% |
  | `median`     | ...median (ie, top 50%) |
  | `total`      | ...total (ie, top 100%) |
  | `uncited`    | a count of all the papers with zero citations |
  | `papers_net` | tally of FoR fractions for the HEP's papers in this FoR and centile |
  | `papers_pct` | cumulative percentage of the above |
  | `local_pct`  | cumulative percentage for all HEPs combined |
  | `indexed_pct`| the percentage of papers that are indexed by Clarivate |

### Indicator: Distribution of Papers by RCI Classes

- See: [ERA Handbook], Section 5.5.3 and Appendix I.4.6
- After each paper has been assigned a set of RCI scores (a global:local pair for each FoR), then it is assigned a matching set of RCI classes.
- Scores are binned into 7 RCI classes
  - class 0: no citations
  - class 1: RCI 0.01 - 0.79
  - class 2: RCI 0.80 - 1.19
  - class 3: RCI 1.20 - 1.99
  - class 4: RCI 2.00 - 3.99
  - class 5: RCI 4.00 - 7.99
  - class 6: RCI 8.00 - above
- After all RCI classes have been assigned to papers, tallies for each class are aggregated using the FoR fractions for each paper.
- Tallies combine all years. This is acceptable because RCIs are year-normalised by comparing to year-specific benchmarks.
- For each (HEP, FoR), assessed against the world benchmark, these metrics are reported:
  | field         | description |
  | ------------- | ----------- |
  | `rci_class`   | the RCI(world) class, 0-6 |
  | `rci_range`   | the range of RCI(world) values that constitute this class |
  | `papers_net`  | tally of papers in the class, using FoR fractions |
  | `papers_pct`  | the percentage of papers (from the HEP) in this class |
  | `hep_for_avg` | the percentage of papers (from all HEPs) in this class |
  | `hep_for_pct` | the percentage of papers (from the HEP) of all HEPs' papers in this class |
  | `rci_low`     | tally of papers in classes 0,1 using FoR fractions |
  | `rci_high`    | tally of papers in classes 4,5,6 using FoR fractions |
  | `hl_ratio`    | ratio of `rci_high` to `rci_low` |

## Data

### 2018 HEPs

Note: ROR codes were obtained manually from the [Research Organisation Registry](https://ror.org/)

```csv
"ACU", "https://ror.org/04cxm4j25", "Australian Catholic University"
"BAT", "https://ror.org/03n0gvg35", "Batchelor Institute of Indigenous Tertiary Education"
"BON", "https://ror.org/006jxzx88", "Bond University"
"CQU", "https://ror.org/023q4bk22", "Central Queensland University"
"CDU", "https://ror.org/048zcaj52", "Charles Darwin University"
"CSU", "https://ror.org/00wfvh315", "Charles Sturt University"
"CUT", "https://ror.org/02n415q13", "Curtin University of Technology"
"DKN", "https://ror.org/02czsnj07", "Deakin University"
"ECU", "https://ror.org/05jhnwe22", "Edith Cowan University"
"FED", "https://ror.org/05qbzwv83", "Federation University Australia"
"GRF", "https://ror.org/02sc3r913", "Griffith University"
"JCU", "https://ror.org/04gsp2c11", "James Cook University"
"LTU", "https://ror.org/01rxfrp27", "La Trobe University"
"MQU", "https://ror.org/01sf06y89", "Macquarie University"
"DIV", "https://ror.org/02xn8bh65", "MCD University of Divinity"
"MON", "https://ror.org/02bfwt286", "Monash University"
"MUR", "https://ror.org/00r4sry34", "Murdoch University"
"QUT", "https://ror.org/03pnv4752", "Queensland University of Technology"
"RMT", "https://ror.org/04ttjf776", "Royal Melbourne Institute of Technology"
"SCU", "https://ror.org/001xkv632", "Southern Cross University"
"SWN", "https://ror.org/031rekg67", "Swinburne University of Technology"
"ANU", "https://ror.org/019wvm592", "The Australian National University"
"FLN", "https://ror.org/01kpzv902", "The Flinders University of South Australia"
"ADE", "https://ror.org/00892tw58", "The University of Adelaide"
"MEL", "https://ror.org/01ej9dk98", "The University of Melbourne"
"NDA", "https://ror.org/02stey378", "The University of Notre Dame Australia"
"QLD", "https://ror.org/00rqy9422", "The University of Queensland"
"SYD", "https://ror.org/0384j8v12", "The University of Sydney"
"UWA", "https://ror.org/047272k79", "The University of Western Australia"
"TOR", "https://ror.org/0351xae06", "Torrens University Australia"
"CAN", "https://ror.org/04s1nv328", "University of Canberra"
"UNE", "https://ror.org/04r659a56", "University of New England"
"NSW", "https://ror.org/03r8z3t63", "University of New South Wales"
"NEW", "https://ror.org/00eae9z71", "University of Newcastle"
"USA", "https://ror.org/01p93h210", "University of South Australia"
"USQ", "https://ror.org/04sjbnx57", "University of Southern Queensland"
"TAS", "https://ror.org/01nfmeh72", "University of Tasmania"
"UTS", "https://ror.org/03f0f6041", "University of Technology, Sydney"
"USC", "https://ror.org/016gb9e15", "University of the Sunshine Coast"
"WSU", "https://ror.org/03t52dk35", "University Western Sydney"
"WOL", "https://ror.org/00jtmb277", "University of Wollongong"
"VIC", "https://ror.org/04j757h98", "Victoria University"
```

[top]

### 2008 2-digit FoR codes

```csv
"01","MATHEMATICAL SCIENCES"
"02","PHYSICAL SCIENCES"
"03","CHEMICAL SCIENCES"
"04","EARTH SCIENCES"
"05","ENVIRONMENTAL SCIENCES"
"06","BIOLOGICAL SCIENCES"
"07","AGRICULTURAL AND VETERINARY SCIENCES"
"08","INFORMATION AND COMPUTING SCIENCES"
"09","ENGINEERING"
"10","TECHNOLOGY"
"11","MEDICAL AND HEALTH SCIENCES"
"12","BUILT ENVIRONMENT AND DESIGN"
"13","EDUCATION"
"14","ECONOMICS"
"15","COMMERCE, MANAGEMENT, TOURISM AND SERVICES"
"16","STUDIES IN HUMAN SOCIETY"
"17","PSYCHOLOGY AND COGNITIVE SCIENCES"
"18","LAW AND LEGAL STUDIES"
"19","STUDIES IN CREATIVE ARTS AND WRITING"
"20","LANGUAGE, COMMUNICATION AND CULTURE"
"21","HISTORY AND ARCHAEOLOGY"
"22","PHILOSOPHY AND RELIGIOUS STUDIES"
"MD","MULTIDISCIPLINARY"
```

[top]

### 2008 4-digit FoR codes

```csv
"0101","Pure Mathematics"
"0102","Applied Mathematics"
"0103","Numerical and Computational Mathematics"
"0104","Statistics"
"0105","Mathematical Physics"
"0199","Other Mathematical Sciences"
"0201","Astronomical and Space Sciences"
"0202","Atomic, Molecular, Nuclear, Particle and Plasma Physics"
"0203","Classical Physics (P)"
"0204","Condensed Matter Physics"
"0205","Optical Physics"
"0206","Quantum Physics"
"0299","Other Physical Sciences (P)"
"0301","Analytical Chemistry"
"0302","Inorganic Chemistry"
"0303","Macromolecular and Materials Chemistry"
"0304","Medicinal and Biomolecular Chemistry (P)"
"0305","Organic Chemistry"
"0306","Physical Chemistry (incl. Structural)"
"0307","Theoretical and Computational Chemistry"
"0399","Other Chemical Sciences (P)"
"0401","Atmospheric Sciences"
"0402","Geochemistry"
"0403","Geology"
"0404","Geophysics"
"0405","Oceanography"
"0406","Physical Geography and Environmental Geoscience"
"0499","Other Earth Sciences"
"0501","Ecological Applications"
"0502","Environmental Science and Management (P)"
"0503","Soil Sciences"
"0599","Other Environmental Sciences"
"0601","Biochemistry and Cell Biology (P)"
"0602","Ecology"
"0603","Evolutionary Biology"
"0604","Genetics"
"0605","Microbiology"
"0606","Physiology"
"0607","Plant Biology"
"0608","Zoology"
"0699","Other Biological Sciences (P)"
"0701","Agriculture, Land,and Farm Management"
"0702","Animal Production"
"0703","Crop and Pasture Production"
"0704","Fisheries Sciences"
"0705","Forestry Sciences"
"0706","Horticultural Production"
"0707","Veterinary Sciences"
"0799","Other Agricultural and Veterinary Sciences"
"0801","Artificial Intelligence and Image Processing"
"0802","Computation Theory and Mathematics"
"0803","Computer Software"
"0804","Data Format"
"0805","Distributed Computing"
"0806","Information Systems (P)"
"0807","Library and Information Studies"
"0899","Other Information and Computing Sciences"
"0901","Aerospace Engineering"
"0902","Automotive Engineering (P)"
"0903","Biomedical Engineering"
"0904","Chemical Engineering (P)"
"0905","Civil Engineering"
"0906","Electrical and Electronic Engineering"
"0907","Environmental Engineering"
"0908","Food Sciences"
"0909","Geomatic Engineering"
"0910","Manufacturing Engineering (P)"
"0911","Maritime Engineering"
"0912","Materials Engineering"
"0913","Mechanical Engineering (P)"
"0914","Resources Engineering and Extractive Metallurgy"
"0915","Interdisciplinary Engineering"
"0999","Other Engineering"
"1001","Agricultural Biotechnology"
"1002","Environmental Biotechnology"
"1003","Industrial Biotechnology"
"1004","Medical Biotechnology"
"1005","Communication Technologies"
"1006","Computer Hardware"
"1007","Nanotechnology"
"1099","Other Technology"
"1101","Medical Biochemistry and Metabolomics (P)"
"1102","Cardiorespiratory Medicine and Haematology"
"1103","Clinical Sciences (P)"
"1104","Complementary and Alternative Medicine"
"1105","Dentistry"
"1106","Human Movement and Sports Science"
"1107","Immunology (P)"
"1108","Medical Microbiology (P)"
"1109","Neurosciences (P)"
"1110","Nursing"
"1111","Nutrition and Dietetics"
"1112","Oncology and Carcinogenesis"
"1113","Ophthalmology and Optometry"
"1114","Paediatrics and Reproductive Medicine (P)"
"1115","Pharmacology and Pharmaceutical Sciences (P)"
"1116","Medical Physiology"
"1117","Public Health and Health Services"
"1199","Other Medical and Health Sciences"
"1201","Architecture (P)"
"1202","Building"
"1203","Design Practice and Management"
"1204","Engineering Design"
"1205","Urban and Regional Planning"
"1299","Other Built Environment and Design"
"1301","Education Systems"
"1302","Curriculum and Pedagogy"
"1303","Specialist Studies in Education"
"1399","Other Education"
"1401","Economic Theory"
"1402","Applied Economics"
"1403","Econometrics"
"1499","Other Economics"
"1501","Accounting, Auditing and Accountability"
"1502","Banking, Finance and Investment"
"1503","Business and Management"
"1504","Commercial Services"
"1505","Marketing"
"1506","Tourism"
"1507","Transportation and Freight Services"
"1599","Other Commerce, Management, Tourism and Services"
"1601","Anthropology"
"1602","Criminology"
"1603","Demography"
"1604","Human Geography"
"1605","Policy and Administration"
"1606","Political Science"
"1607","Social Work"
"1608","Sociology"
"1699","Other Studies in Human Society"
"1701","Psychology (P)"
"1702","Cognitive Sciences"
"1799","Other Psychology and Cognitive Sciences"
"1801","Law"
"1802","Maori Law"
"1899","Other Law and Legal Studies"
"1901","Art Theory and Criticism"
"1902","Film, Television and Digital Media"
"1903","Journalism and Professional Writing"
"1904","Performing Arts and Creative Writing"
"1905","Visual Arts and Crafts"
"1999","Other Studies in Creative Arts and Writing"
"2001","Communication and Media Studies"
"2002","Cultural Studies"
"2003","Language Studies"
"2004","Linguistics"
"2005","Literary Studies"
"2099","Other Language, Communication and Culture"
"2101","Archaelogy"
"2102","Curatorial and Related Studies"
"2103","Historical Studies"
"2199","Other History and Archaelogy"
"2201","Applied Ethics (P)"
"2202","History and Philosophy of Specific Fields (P)"
"2203","Philosophy"
"2204","Religion and Religious Studies"
"2299","Other Philosophy and Religious Studies"
```

[top]

### 2020 2-digit FoR codes

```csv
"30", "AGRICULTURAL, VETERINARY AND FOOD SCIENCES"
"31", "BIOLOGICAL SCIENCES"
"32", "BIOMEDICAL AND CLINICAL SCIENCES"
"33", "BUILT ENVIRONMENT AND DESIGN"
"34", "CHEMICAL SCIENCES"
"35", "COMMERCE, MANAGEMENT, TOURISM AND SERVICES"
"36", "CREATIVE ARTS AND WRITING"
"37", "EARTH SCIENCES"
"38", "ECONOMICS"
"39", "EDUCATION"
"40", "ENGINEERING"
"41", "ENVIRONMENTAL SCIENCES"
"42", "HEALTH SCIENCES"
"43", "HISTORY, HERITAGE AND ARCHAEOLOGY"
"44", "HUMAN SOCIETY"
"45", "INDIGENOUS STUDIES"
"46", "INFORMATION AND COMPUTING SCIENCES"
"47", "LANGUAGE, COMMUNICATION AND CULTURE"
"48", "LAW AND LEGAL STUDIES"
"49", "MATHEMATICAL SCIENCES"
"50", "PHILOSOPHY AND RELIGIOUS STUDIES"
"51", "PHYSICAL SCIENCES"
"52", "PSYCHOLOGY"
```

[top]

### 2020 4-digit FoR codes

```csv
"3001", "Agricultural biotechnology"
"3002", "Agriculture, land and farm management"
"3003", "Animal production"
"3004", "Crop and pasture production"
"3005", "Fisheries sciences"
"3006", "Food sciences"
"3007", "Forestry sciences"
"3008", "Horticultural production"
"3009", "Veterinary sciences"
"3099", "Other agricultural, veterinary and food sciences"
"3101", "Biochemistry and cell biology"
"3102", "Bioinformatics and computational biology"
"3103", "Ecology"
"3104", "Evolutionary biology"
"3105", "Genetics"
"3106", "Industrial biotechnology"
"3107", "Microbiology"
"3108", "Plant biology"
"3109", "Zoology"
"3199", "Other biological sciences"
"3201", "Cardiovascular medicine and haematology"
"3202", "Clinical sciences"
"3203", "Dentistry"
"3204", "Immunology"
"3205", "Medical biochemistry and metabolomics"
"3206", "Medical biotechnology"
"3207", "Medical microbiology"
"3208", "Medical physiology"
"3209", "Neurosciences"
"3210", "Nutrition and dietetics"
"3211", "Oncology and carcinogenesis"
"3212", "Ophthalmology and optometry"
"3213", "Paediatrics"
"3214", "Pharmacology and pharmaceutical sciences"
"3215", "Reproductive medicine"
"3299", "Other biomedical and clinical sciences"
"3301", "Architecture"
"3302", "Building"
"3303", "Design"
"3304", "Urban and regional planning"
"3399", "Other built environment and design"
"3401", "Analytical chemistry"
"3402", "Inorganic chemistry"
"3403", "Macromolecular and materials chemistry"
"3404", "Medicinal and biomolecular chemistry"
"3405", "Organic chemistry"
"3406", "Physical chemistry"
"3407", "Theoretical and computational chemistry"
"3499", "Other chemical sciences"
"3501", "Accounting, auditing and accountability"
"3502", "Banking, finance and investment"
"3503", "Business systems in context"
"3504", "Commercial services"
"3505", "Human resources and industrial relations"
"3506", "Marketing"
"3507", "Strategy, management and organisational behaviour"
"3508", "Tourism"
"3509", "Transportation, logistics and supply chains"
"3599", "Other commerce, management, tourism and services"
"3601", "Art history, theory and criticism"
"3602", "Creative and professional writing"
"3603", "Music"
"3604", "Performing arts"
"3605", "Screen and digital media"
"3606", "Visual arts"
"3699", "Other creative arts and writing"
"3701", "Atmospheric sciences"
"3702", "Climate change science"
"3703", "Geochemistry"
"3704", "Geoinformatics"
"3705", "Geology"
"3706", "Geophysics"
"3707", "Hydrology"
"3708", "Oceanography"
"3709", "Physical geography and environmental geoscience"
"3799", "Other earth sciences"
"3801", "Applied economics"
"3802", "Econometrics"
"3803", "Economic theory"
"3899", "Other economics"
"3901", "Curriculum and pedagogy"
"3902", "Education policy, sociology and philosophy"
"3903", "Education systems"
"3904", "Specialist studies in education"
"3999", "Other education"
"4001", "Aerospace engineering"
"4002", "Automotive engineering"
"4003", "Biomedical engineering"
"4004", "Chemical engineering"
"4005", "Civil engineering"
"4006", "Communications engineering"
"4007", "Control engineering, mechatronics and robotics"
"4008", "Electrical engineering"
"4009", "Electronics, sensors and digital hardware"
"4010", "Engineering practice and education"
"4011", "Environmental engineering"
"4012", "Fluid mechanics and thermal engineering"
"4013", "Geomatic engineering"
"4014", "Manufacturing engineering"
"4015", "Maritime engineering"
"4016", "Materials engineering"
"4017", "Mechanical engineering"
"4018", "Nanotechnology"
"4019", "Resources engineering and extractive metallurgy"
"4099", "Other engineering"
"4101", "Climate change impacts and adaptation"
"4102", "Ecological applications"
"4103", "Environmental biotechnology"
"4104", "Environmental management"
"4105", "Pollution and contamination"
"4106", "Soil sciences"
"4199", "Other environmental sciences"
"4201", "Allied health and rehabilitation science"
"4202", "Epidemiology"
"4203", "Health services and systems"
"4204", "Midwifery"
"4205", "Nursing"
"4206", "Public health"
"4207", "Sports science and exercise"
"4208", "Traditional, complementary and integrative medicine"
"4299", "Other health sciences"
"4301", "Archaeology"
"4302", "Heritage, archive and museum studies"
"4303", "Historical studies"
"4399", "Other history, heritage and archaeology"
"4401", "Anthropology"
"4402", "Criminology"
"4403", "Demography"
"4404", "Development studies"
"4405", "Gender studies"
"4406", "Human geography"
"4407", "Policy and administration"
"4408", "Political science"
"4409", "Social work"
"4410", "Sociology"
"4499", "Other human society"
"4501", "Aboriginal and Torres Strait Islander culture, language and history"
"4502", "Aboriginal and Torres Strait Islander education"
"4503", "Aboriginal and Torres Strait Islander environmental knowledges and management"
"4504", "Aboriginal and Torres Strait Islander health and wellbeing"
"4505", "Aboriginal and Torres Strait Islander peoples, society and community"
"4506", "Aboriginal and Torres Strait Islander sciences"
"4507", "Te ahurea, reo me te hītori o te Māori (Māori culture, language and history)"
"4508", "Mātauranga Māori (Māori education)"
"4509", "Ngā mātauranga taiao o te Māori (Māori environmental knowledges)"
"4510", "Te hauora me te oranga o te Māori (Māori health and wellbeing)"
"4511", "Ngā tāngata, te porihanga me ngā hapori o te Māori (Māori peoples, society and community)"
"4512", "Ngā pūtaiao Māori (Māori sciences)"
"4513", "Pacific Peoples culture, language and history"
"4514", "Pacific Peoples education"
"4515", "Pacific Peoples environmental knowledges"
"4516", "Pacific Peoples health and wellbeing"
"4517", "Pacific Peoples sciences"
"4518", "Pacific Peoples society and community"
"4519", "Other Indigenous data, methodologies and global Indigenous studies"
"4599", "Other Indigenous studies"
"4601", "Applied computing"
"4602", "Artificial intelligence"
"4603", "Computer vision and multimedia computation"
"4604", "Cybersecurity and privacy"
"4605", "Data management and data science"
"4606", "Distributed computing and systems software"
"4607", "Graphics, augmented reality and games"
"4608", "Human-centred computing"
"4609", "Information systems"
"4610", "Library and information studies"
"4611", "Machine learning"
"4612", "Software engineering"
"4613", "Theory of computation"
"4699", "Other information and computing sciences"
"4701", "Communication and media studies"
"4702", "Cultural studies"
"4703", "Language studies"
"4704", "Linguistics"
"4705", "Literary studies"
"4799", "Other language, communication and culture"
"4801", "Commercial law"
"4802", "Environmental and resources law"
"4803", "International and comparative law"
"4804", "Law in context"
"4805", "Legal systems"
"4806", "Private law and civil obligations"
"4807", "Public law"
"4899", "Other law and legal studies"
"4901", "Applied mathematics"
"4902", "Mathematical physics"
"4903", "Numerical and computational mathematics"
"4904", "Pure mathematics"
"4905", "Statistics"
"4999", "Other mathematical sciences"
"5001", "Applied ethics"
"5002", "History and philosophy of specific fields"
"5003", "Philosophy"
"5004", "Religious studies"
"5005", "Theology"
"5099", "Other philosophy and religious studies"
"5101", "Astronomical sciences"
"5102", "Atomic, molecular and optical physics"
"5103", "Classical physics"
"5104", "Condensed matter physics"
"5105", "Medical and biological physics"
"5106", "Nuclear and plasma physics"
"5107", "Particle and high energy physics"
"5108", "Quantum physics"
"5109", "Space sciences"
"5110", "Synchrotrons and accelerators"
"5199", "Other physical sciences"
"5201", "Applied and developmental psychology"
"5202", "Biological psychology"
"5203", "Clinical and health psychology"
"5204", "Cognitive and computational psychology"
"5205", "Social and personality psychology"
"5299", "Other psychology"
```

[top]

<!-- links -->
[ERA Handbook]: <https://www.arc.gov.au/file/10668/download?token=V5AKd-29>
[Interdisciplinary profiles]: <#indicator-interdisciplinary-profiles>
[Low volume thresholds]: <#indicator-low-volume-thresholds>
[Research outputs]: <#indicator-research-outputs>
[Research output by year]: <#indicator-research-outputs-by-year>
[Publishing profile]: <#indicator-publishing-profile>
[Relative citation impact]: <#indicator-relative-citation-impact-rci>
[Distribution by world centile]: <#indicator-distribution-of-papers-based-on-global-centiles>
[Distribution by RCI classes]: <#indicator-distribution-of-papers-by-rci-classes>
[top]: <#era-2018>
