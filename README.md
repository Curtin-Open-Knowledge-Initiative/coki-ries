# COKI Research Impact Evaluation System

A BigQuery based system for evaluating the impact of research publications. Based on Excellence in Research for Australia (ERA).

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![DOI_repo](https://zenodo.org/badge/DOI/10.5281/zenodo.7345347.svg)](https://doi.org/10.5281/zenodo.7345347)
[![DOI_doc](https://zenodo.org/badge/DOI/10.5281/zenodo.7084440.svg)](https://doi.org/10.5281/zenodo.7084439)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=flat-square&logo=google-cloud)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat-square&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat-square&logo=javascript)

Contact / Enquiries: [coki@curtin.edu.au][contact]

## Quickstart

For detailed documentation, see: [install] | [configure] | [usage].

```bash
# install and run with Docker
docker run --rm -it observatoryacademy/coki-ries:latest sh
node . ?

# or install and run locally
git clone https://github.com/Curtin-Open-Knowledge-Initiative/coki-ries.git && cd coki-ries
npm install -g pnpm && pnpm install && pnpm audit
node . ?
```

## Background

[Excellence in Research for Australia][ERA] (ERA) is a periodic assessment that is conducted by the [Australian Research Council][ARC] (ARC). The assessment focuses on the activity of 42 Australian higher education providers (HEPs) across [236 ANZSRC fields of research][ANZSRC] (FoR). Performance is assessed (per HEP and FoR) by comparing research outputs to local and world benchmarks. Analysis has a citation-focus and draws from publication metadata provided by the participating HEPs.

The [Curtin Open Knowledge Initiative][COKI] (COKI) aggregates bibliometric and bibliographic data from publicly available sources such as [Crossref], [Unpaywall], [OpenCitations], [Microsoft Academic Graph], and [OpenAlex]. The resultant [BigQuery] database contains metadata for over 120 million research publications and forms the foundation for further analysis by the [COKI] team.

This software project has been developed to demonstrate how the [COKI] database may be used to run an [ERA]-like analysis. The methodology is guided by published [ERA methods] and makes use of journal-level metadata from the [ERA 2023 Journal List]. The workflows are amenable to extension, outside of the ERA scope, to include any institution (with a [ROR] identifier) and any research-topic vocabulary that has been assigned to research articles (eg, via machine-learning classifiers).

## Demo System

This codebase is free and open source ([FOSS]), however access to the COKI database is limited. For evaluation purposes, a subset of the [COKI] dataset has been extracted and [made available][demodata] via [Google Cloud Storage][GCS]. The subset is limited to metadata for approximately two million journal-articles that:

- were published in 2016,
- could be linked to at least one research institution (via [ROR] identifier), and
- could be linked to a journal in the [ERA 2023 Journal List] (via [ISSN]).

To compile SQL scripts, you will need a workstation that has either [Docker] or [NodeJS]. If you wish to run the queries, to build a demo database, then you will need access to your own [BigQuery] instance. Follow the [installation instructions][install] to continue.

## Documentation

- [Installation][install] - system requirements and installation (Docker, OS X or Linux)
- [Configuration][configure] - description of configuration options
- [Usage][usage] - command line interface instructions
- [Roadmap][roadmap] - future development roadmap
- [Workflow][workflow] - detailed workflow diagram
- [Method][methods] - description of the methods used to build benchmarks & indicators

## Structure

Within this code repository, a `README.md` file in each directory provides context. At this level (the top level):

| directory | description |
| - | - |
| [./code](./code)   | Application code including libraries, SQL templates, ETL scripts and workflows. |
| [./data](./data)   | Scratch area for working data, caches and temp files. Not under version control. |
| [./docs](./docs)   | System and method documentation. |
| [./setup](./setup) | Installer scripts and configuration settings. |

## Full Access

The full COKI dataset is recompiled weekly by the [Academic Observatory Workflows], running on the [Academic Observatory Platform]. The underlying infrastructure requires significant resourcing and we do not currently make the data resource freely available (whereas the codebases are [FOSS]).

For sustainable development and continuation of this project, our medium-term goal is to establish an institutional membership model. We are [seeking expressions of interest][contact] from institutions that would benefit from further development of an on-demand ERA-like analytical system. The system will aim to provide value to institutions by simplifying curation of research-output metadata and facilitating exploration of alternative analytical methods. For example, reporting on how Australian HEPs perform against other institutions with a focus on [Open Access] publication.

We are also happy to [discuss][contact] possible collaboration opportunities, analysis services or access models with interested individuals and institutions.

Once the [ERA Transition Working Group] releases its findings and recommendations for the future of [ERA] assessments, we will have greater clarity on how best to proceed.

## License

[Apache 2.0](./LICENSE)

```text
Copyright 2022 Curtin University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Contributors

**Conceptualization**: Julian Tonti-Filippini and Cameron Neylon.  
**Data curation**: Julian Tonti-Filippini.  
**Formal analysis**: Julian Tonti-Filippini.  
**Funding acquisition**: Cameron Neylon.  
**Investigation**: Julian Tonti-Filippini.  
**Methodology**: Julian Tonti-Filippini and Cameron Neylon.  
**Project administration**: Kathryn Napier and Cameron Neylon.  
**Resources**: Cameron Neylon.  
**Software**: Julian Tonti-Filippini and Cameron Neylon.  
**Supervision**: Kathryn Napier and Cameron Neylon.  
**Validation**: Julian Tonti-Filippini.  
**Visualisation**: Julian Tonti-Filippini.  
**Writing - original draft**: Julian Tonti-Filippini and Cameron Neylon.  
**Writing - review & editing**: Julian Tonti-Filippini, Kathryn Napier, and Cameron Neylon.  

<!-- links -->
[ARC]: <https://www.arc.gov.au/>
[ERA]: <https://www.arc.gov.au/evaluating-research/excellence-research-australia>
[COKI]: <https://openknowledge.community/>
[ANZSRC]: <https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release>
[ROR]: <https://ror.org/about/>
[FOSS]: <https://en.wikipedia.org/wiki/Free_and_open-source_software>

[Crossref]: <https://www.crossref.org/>
[Unpaywall]: <https://unpaywall.org/>
[OpenCitations]: <https://opencitations.net/>
[Microsoft Academic Graph]: <https://www.microsoft.com/en-us/research/project/microsoft-academic-graph/>
[OpenAlex]: <https://openalex.org/>
[Open Access]: <https://en.wikipedia.org/wiki/Open_access>
[ISSN]: <https://www.issn.org/>

[ERA methods]: <https://web.archive.org.au/awa/20220302235108mp_/https://www.arc.gov.au/file/10668/download?token=V5AKd-29>
[ERA 2023 Journal List]: <https://www.arc.gov.au/sites/default/files/2022-07/ERA2023%20Submission%20Journal%20List.xlsx>
[ERA Transition Working Group]: <https://www.arc.gov.au/news-publications/media/media-releases/new-working-group-advise-era-transition>

[BigQuery]: <https://cloud.google.com/bigquery/>
[GCS]: <https://cloud.google.com/storage>
[NodeJS]: <https://nodejs.org/en/download/>
[Docker]: <https://www.docker.com/>

<!-- COKI -->
[Academic Observatory Workflows]: <https://github.com/The-Academic-Observatory/academic-observatory-workflows>
[Academic Observatory Platform]: <https://github.com/The-Academic-Observatory/observatory-platform>
[contact]: <mailto:coki@curtin.edu.au>
[install]: <docs/installation.md>
[configure]: <docs/configuration.md>
[usage]: <docs/usage.md>
[roadmap]: <docs/roadmap.md>
[methods]: <docs/methods.md>
[workflow]: <docs/workflow.md>
[demodata]: <https://storage.googleapis.com/rt-era-public/data/raw/coki_data_list.html>

<!-- unused 
[Git]: <https://github.com/git-guides/install-git>
[curl]: <https://curl.se/download.html>
[Google CLI]: <https://cloud.google.com/sdk/docs/install-sdk>
[GitHub CLI]: <https://github.com/cli/cli>
[Amazon CLI]: <https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>
[Electron]: <https://www.electronjs.org/>
[x11]: <https://en.wikipedia.org/wiki/X_Window_System>
[VNC]: <https://en.wikipedia.org/wiki/Virtual_Network_Computing>
[credentials]: <https://cloud.google.com/bigquery/docs/authentication/service-account-file>
-->
