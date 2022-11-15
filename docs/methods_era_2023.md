# ERA 2023 Method Notes

Summary of *ERA 2023 Benchmarking and Rating Scale - Consultation Paper* focusing on suggested changes between the ERA 2023 method and [ERA 2018 Method Notes](./era_2018.md).

- [ERA 2023 Method Notes](#era-2023-method-notes)
  - [ERA 2018](#era-2018)
  - [ERA 2023](#era-2023)
  - [Ratings](#ratings)
    - [ERA 2018 Ratings](#era-2018-ratings)
    - [ERA 2023 Option A Ratings](#era-2023-option-a-ratings)
    - [ERA 2023 Option B Ratings](#era-2023-option-b-ratings)
  - [World Benchmark](#world-benchmark)
  - [High Performance Indicator (HPI)](#high-performance-indicator-hpi)
    - [Calculation of the HPI benchmark](#calculation-of-the-hpi-benchmark)
  - [Dynamic Relative Citation Impact (RCI) classes](#dynamic-relative-citation-impact-rci-classes)
    - [Calculation of the Dynamic RCI](#calculation-of-the-dynamic-rci)
  - [Data](#data)
    - [2020 2-digit FoR codes](#2020-2-digit-for-codes)
    - [2020 4-digit FoR codes](#2020-4-digit-for-codes)
  - [Footnotes](#footnotes)

## ERA 2018

- Evaluation window: 2011-2016 inclusive.
- Official website [ARC](https://www.arc.gov.au/excellence-research-australia/key-documents)
- Journal list: [ARC](https://www.arc.gov.au/excellence-research-australia/era-2018-journal-list)
- Uses 2008 FoR codes, source: [ANZSRC 2008](https://www.abs.gov.au/AUSSTATS/abs@.nsf/allprimarymainfeatures/1641059E192F00DFCA2585960012B86F?opendocument=)
- Methodology: [ERA 2018 Evaluation Handbook][ERA 2018 Handbook]

## ERA 2023

- Evaluation window: 2016-2021 inclusive.
- Official website: [ARC](https://www.arc.gov.au/excellence-research-australia/era-2023)
- Journal list: TBA in 2022.
- Uses 2020 FoR codes: [list below](#2020-4-digit-for-codes). Source: [ANZSRC 2020](https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release)
- Method changes from 2018:
  - addition of a **high performer benchmark (HPB)**.
  - modification to the **world benchmark** process.
  - discussion between two possible options:
  - Option A: 5-point rating using both of the new benchmarks.
  - Option B: 6-point rating using the HPB alone for the top 3 ratings, then uses both for the lower 3.
  - addition of a **high-performance indicator (HPI)** that compares against the top 10% of insitutions (globally)
  - modification of the RCI method to use a **dynamic relative citation impact**.

## Ratings

A key change between ERA 2018 and ERA 2023 is the assignment of ratings to units of evaluation. Due to changes in the methodology, ERA 2023 ratings will not be directly comparable with ratings from ERA 2018, but a rough comparison between methods is shown below.

### ERA 2018 Ratings

The ERA 2018 method used only a world benchmark for determining ratings

| rating | assessment | approximate equivalents |
| --- | --- | --- |
| 5 | WB >> standard | A:5,4 B:6,5,4 |
| 4 | WB  > standard | A:3 B:3 |
| 3 | WB ~= standard | A:2 B:2 |
| 2 | WB  < standard | A:1 B:1 |
| 1 | WB << standard | A:1 B:1 |

### ERA 2023 Option A Ratings

The high performer and the world benchmarks are used for the top three ratings groups. Only the world benchmark is used for the lower ratings. The rating represents a comparison of an Australian higher education provider (HEP) to other HEPs.

| rating | assessment | approximate equivalents |
| --- | --- | --- |
| world leading             | HPB >> standard & WB >> standard | 2018:5 |
| well above world standard | HPB ~= standard & WB >> standard | 2018:5 |
| above world standard      | HPB  < standard & WB  > standard | 2018:4 |
| world standard            |                   WB ~= standard | 2018:3 |
| not at world standard     |                   WB  < standard | 2018:2,1 |

### ERA 2023 Option B Ratings

| rating | assessment | approximate equivalents |
| --- | --- | --- |
| AAA | HPB >> standard | 2018:5 |
| AA  | HPB  > standard | 2018:5 |
| A   | HPB ~= standard | 2018:5 |
| B   |  WB  > standard | 2018:4 |
| C   |  WB ~= standard | 2018:3 |
| D   |  WB  < standard | 2018:2,1 |

## World Benchmark

- See: [ERA 2023 Consultation], Section 2.1

## High Performance Indicator (HPI)

- See: [ERA 2023 Consultation], Sections 2.1, 3.1 & Appendix B
- added as a new indicator in ERA 2023
- allows comparison of an institution's outputs (by field and year) to a benchmark set by the leading institutions in the field,year group.
- uses the same ERA world dataset & journal list as used for citation calculations
- all global institutions are included (not just universities)
- **the HPI indicator replaces the Australian HEP analysis**. The local (Australian) benchmark is replaced by the HPI benchmark.
- the *Australian HEP FoR Average* and the *% Contribution to Australian HEP FoR Total* are deprecated. These are replaced by the *% Distribution of World Papers* and the *% Distribution of HPI Papers*
- the *RCI Class Comparison Indicator* has been removed (ie, the proportion of high RCI : low RCI).

### Calculation of the HPI benchmark

- the benchmark is the average citations per paper (CPP) for the top 10% of institutions (globally) for each FoR code and year.
- restricted to journal articles, conference publications and review articles
- restricted to outputs published in journal articles in the *ERA 2023 Journal List*
- restricted to organisations that meet the low volume threshold, for a given FoR code, in the ERA period (>= 50 output units)
- not calculated for an FoR if there are less than 10 institutions that pass the low volume threshold filter
- after all of the filters have been applied, the CPP is then calculated for each (RoR, FoR, year)

```bash
CPP (RoR, FoR, year) = sum citations(RoR,FoR,year) / num papers(RoR,FoR,year)
# where papers are per institution (RoR)
```

- CPPs are then sorted in (For,year) groupings and the top 10% of institutions in the group are flagged as high-performing
- as the minimum number of institutions required per grouping is 10, this means that it's possible for the HPI benchmark to be calculated from only one institution's outputs
- outputs from the high-performing institutions are then pooled
- the HPI benchmark is calculated as the average CPP for papers in this pool:

```bash
HPI_CPP (FoR, year) = sum citations(FoR,year) / num papers(FoR,year)
# where papers is the top 10% subset
```

- this HPI benchmark (by FoR,year) is then used as the denominator for assigning RCI ratings under the new OptionA and B methods.
- Questions:
  - should the calculation use fractional (apportioned) citation assignment?
  - how statistically robust is the method when the HPI might be calculated from the outputs of only one institution?

## Dynamic Relative Citation Impact (RCI) classes

- See: [ERA 2023 Consultation], Section 3.2 & Appendix C
- the existing method assigns 7 RCI classes with the same fixed boundaries used for all FoRs
- the new method computes class boundaries individually for each FoR
- the new method has 6 RCI classes (0-5) with 0 indicating uncited
- 2-digit FoR statistics will be determined from the 4-digit data
- the former *RCI Class Comparison* is deprecated

### Calculation of the Dynamic RCI

- as before (ERA 2018), papers are assigned RCI scores against the global benchmarks (per FoR,year)
- for each (FoR,year) a series of RCI class boundaries are then recursively calculated as:

| class | metric |
| --- | --- |
| 0 | uncited papers (RCI 0) |
| 1 | RCI > 0, <= 1.00 (ie, at or below average RCI) |
| 2 | RCI(rank 1) to <= mean RCI(rank > 1) |
| 3 | RCI(rank 2) to <= mean RCI(rank > 2) |
| 4 | RCI(rank 3) to <= mean RCI(rank > 3) |
| 5 | RCI(rank 4) to <= mean RCI(rank > 4) |

## Data

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

## Footnotes

[ERA 2018 Handbook]:https://www.arc.gov.au/file/10668/download?token=V5AKd-29
[ERA 2023 Consultation]:https://www.arc.gov.au/sites/default/files/2022-07/era_2023_brs_consultation.pdf
[top]:#era-2023-method-notes
