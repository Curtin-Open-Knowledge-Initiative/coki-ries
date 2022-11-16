```mermaid
%%{ init: { "theme":"forest", "themeVariables": { "fontFamily" : "helvetica" }}}%%
graph LR
  classDef table   fill:#DDF,stroke:#000;
  classDef file    fill:#DFD,stroke:#000;
  classDef exec    fill:#FDD,stroke:#000;
  classDef default fill:#FFF,stroke:#000;
  root --> raw_topics.js(raw_topics.js):::exec
  root --> raw_rors.js(raw_rors.js):::exec
  root --> raw_papers.js(raw_papers.js):::exec
  root --> raw_journals.js(raw_journals.js):::exec
  root --> raw_issns.js(raw_issns.js):::exec
  root --> raw_history.js(raw_history.js):::exec
  root --> raw_heps.js(raw_heps.js):::exec
  root --> observatory.doi20220709[(observatory.doi20220709)]:::table
  root --> ror.org{{ror.org}}:::file
  root --> web.archive.org.au{{web.archive.org.au}}:::file
  root --> issn.org{{issn.org}}:::file
  root --> www.arc.gov.au{{www.arc.gov.au}}:::file
  root --> aria.stats.govt.nz{{aria.stats.govt.nz}}:::file
  root --> www.abs.gov.au{{www.abs.gov.au}}:::file
  root --> telescope_coki.js(telescope_coki.js):::exec
  root --> telescope.js(telescope.js):::exec
  telescope_coki.js(telescope_coki.js):::exec --> raw_outputs[(raw_outputs)]:::table
  telescope.js(telescope.js):::exec --> telescope_era_history.js(telescope_era_history.js):::exec
  telescope_era_history.js(telescope_era_history.js):::exec --> era_historical_ratings[(era_historical_ratings)]:::table
  telescope.js(telescope.js):::exec --> telescope_forcodes.js(telescope_forcodes.js):::exec
  www.abs.gov.au{{www.abs.gov.au}}:::file --> telescope_forcodes.js(telescope_forcodes.js):::exec
  aria.stats.govt.nz{{aria.stats.govt.nz}}:::file --> telescope_forcodes.js(telescope_forcodes.js):::exec
  telescope_forcodes.js(telescope_forcodes.js):::exec --> raw_forcodes[(raw_forcodes)]:::table
  telescope.js(telescope.js):::exec --> telescope_heps.js(telescope_heps.js):::exec
  www.arc.gov.au{{www.arc.gov.au}}:::file --> telescope_heps.js(telescope_heps.js):::exec
  telescope_heps.js(telescope_heps.js):::exec --> raw_heps[(raw_heps)]:::table
  telescope.js(telescope.js):::exec --> telescope_issns.js(telescope_issns.js):::exec
  issn.org{{issn.org}}:::file --> telescope_issns.js(telescope_issns.js):::exec
  telescope_issns.js(telescope_issns.js):::exec --> raw_issns[(raw_issns)]:::table
  telescope.js(telescope.js):::exec --> telescope_journals_2018.js(telescope_journals_2018.js):::exec
  web.archive.org.au{{web.archive.org.au}}:::file --> telescope_journals_2018.js(telescope_journals_2018.js):::exec
  telescope_journals_2018.js(telescope_journals_2018.js):::exec --> raw_journals_2018[(raw_journals_2018)]:::table
  telescope.js(telescope.js):::exec --> telescope_journals_2023.js(telescope_journals_2023.js):::exec
  www.arc.gov.au{{www.arc.gov.au}}:::file --> telescope_journals_2023.js(telescope_journals_2023.js):::exec
  telescope_journals_2023.js(telescope_journals_2023.js):::exec --> raw_journals_2023[(raw_journals_2023)]:::table
  telescope.js(telescope.js):::exec --> telescope_rors.js(telescope_rors.js):::exec
  ror.org{{ror.org}}:::file --> telescope_rors.js(telescope_rors.js):::exec
  telescope_rors.js(telescope_rors.js):::exec --> raw_rors[(raw_rors)]:::table
  core_papers[(core_papers)]:::table --> benchmark_centiles.js(benchmark_centiles.js):::exec
  benchmark_centiles.js(benchmark_centiles.js):::exec --> benchmarks_centiles_*[(benchmarks_centiles_*)]:::table
  benchmark_centiles.js(benchmark_centiles.js):::exec --> centiles_tallies_*[(centiles_tallies_*)]:::table
  core_papers[(core_papers)]:::table --> benchmark_cpp.js(benchmark_cpp.js):::exec
  benchmark_cpp.js(benchmark_cpp.js):::exec --> benchmarks_cpp_*[(benchmarks_cpp_*)]:::table
  research_outputs_*[(research_outputs_*)]:::table --> benchmark_hpi.js(benchmark_hpi.js):::exec
  benchmark_hpi.js(benchmark_hpi.js):::exec --> benchmarks_hpi_*[(benchmarks_hpi_*)]:::table
  research_outputs_base[(research_outputs_base)]:::table --> benchmark_outputs.js(benchmark_outputs.js):::exec
  benchmark_outputs.js(benchmark_outputs.js):::exec --> research_outputs_*[(research_outputs_*)]:::table
  rci_papers[(rci_papers)]:::table --> benchmark_rci.js(benchmark_rci.js):::exec
  benchmark_rci.js(benchmark_rci.js):::exec --> benchmarks_rci_*[(benchmarks_rci_*)]:::table
  core_papers[(core_papers)]:::table --> benchmark_rci_classes.js(benchmark_rci_classes.js):::exec
  rci_papers[(rci_papers)]:::table --> benchmark_rci_classes.js(benchmark_rci_classes.js):::exec
  rci_grouping_*[(rci_grouping_*)]:::table --> benchmark_rci_classes.js(benchmark_rci_classes.js):::exec
  benchmark_rci_classes.js(benchmark_rci_classes.js):::exec --> rci_classes_papers[(rci_classes_papers)]:::table
  benchmark_rci_classes.js(benchmark_rci_classes.js):::exec --> rci_classes_fields[(rci_classes_fields)]:::table
  benchmark_rci_classes.js(benchmark_rci_classes.js):::exec --> rci_classes_summary[(rci_classes_summary)]:::table
  core_papers[(core_papers)]:::table --> benchmark_rci_groups.js(benchmark_rci_groups.js):::exec
  rci_papers[(rci_papers)]:::table --> benchmark_rci_groups.js(benchmark_rci_groups.js):::exec
  benchmark_rci_groups.js(benchmark_rci_groups.js):::exec --> rci_grouping_*[(rci_grouping_*)]:::table
  core_papers[(core_papers)]:::table --> benchmark_rci_papers.js(benchmark_rci_papers.js):::exec
  benchmarks_cpp_*[(benchmarks_cpp_*)]:::table --> benchmark_rci_papers.js(benchmark_rci_papers.js):::exec
  benchmarks_hpi_*[(benchmarks_hpi_*)]:::table --> benchmark_rci_papers.js(benchmark_rci_papers.js):::exec
  benchmark_rci_papers.js(benchmark_rci_papers.js):::exec --> rci_papers[(rci_papers)]:::table
  benchmarks_cpp_*[(benchmarks_cpp_*)]:::table --> benchmark_summary.js(benchmark_summary.js):::exec
  benchmarks_hpi_*[(benchmarks_hpi_*)]:::table --> benchmark_summary.js(benchmark_summary.js):::exec
  benchmarks_centiles_*[(benchmarks_centiles_*)]:::table --> benchmark_summary.js(benchmark_summary.js):::exec
  benchmarks_rci_*[(benchmarks_rci_*)]:::table --> benchmark_summary.js(benchmark_summary.js):::exec
  benchmark_summary.js(benchmark_summary.js):::exec --> benchmarks_summary_*[(benchmarks_summary_*)]:::table
  raw_forcodes[(raw_forcodes)]:::table --> core_fors.js(core_fors.js):::exec
  core_fors.js(core_fors.js):::exec --> core_fors[(core_fors)]:::table
  raw_heps[(raw_heps)]:::table --> core_heps.js(core_heps.js):::exec
  core_rors[(core_rors)]:::table --> core_heps.js(core_heps.js):::exec
  core_heps.js(core_heps.js):::exec --> core_heps[(core_heps)]:::table
  core_heps.js(core_heps.js):::exec --> core_heps_auto[(core_heps_auto)]:::table
  raw_issns[(raw_issns)]:::table --> core_issnls.js(core_issnls.js):::exec
  core_issnls.js(core_issnls.js):::exec --> core_issnls[(core_issnls)]:::table
  core_issnls.js(core_issnls.js):::exec --> xref_issn_issnl[(xref_issn_issnl)]:::table
  raw_journals_2018[(raw_journals_2018)]:::table --> core_journals.js(core_journals.js):::exec
  raw_journals_2023[(raw_journals_2023)]:::table --> core_journals.js(core_journals.js):::exec
  xref_issn_issnl[(xref_issn_issnl)]:::table --> core_journals.js(core_journals.js):::exec
  core_fors[(core_fors)]:::table --> core_journals.js(core_journals.js):::exec
  core_journals.js(core_journals.js):::exec --> core_journals[(core_journals)]:::table
  core_journals.js(core_journals.js):::exec --> xref_for_journal[(xref_for_journal)]:::table
  core_papers[(core_papers)]:::table --> core_outputs.js(core_outputs.js):::exec
  core_heps[(core_heps)]:::table --> core_outputs.js(core_outputs.js):::exec
  core_outputs.js(core_outputs.js):::exec --> research_outputs_base[(research_outputs_base)]:::table
  observatory.doi20220709[(observatory.doi20220709)]:::table --> core_papers.js(core_papers.js):::exec
  xref_issn_issnl[(xref_issn_issnl)]:::table --> core_papers.js(core_papers.js):::exec
  core_heps[(core_heps)]:::table --> core_papers.js(core_papers.js):::exec
  core_rors[(core_rors)]:::table --> core_papers.js(core_papers.js):::exec
  core_journals[(core_journals)]:::table --> core_papers.js(core_papers.js):::exec
  core_papers.js(core_papers.js):::exec --> core_papers[(core_papers)]:::table
  raw_rors[(raw_rors)]:::table --> core_rors.js(core_rors.js):::exec
  core_rors.js(core_rors.js):::exec --> core_rors[(core_rors)]:::table
  core_papers[(core_papers)]:::table --> ind_interdisc.js(ind_interdisc.js):::exec
  core_fors[(core_fors)]:::table --> ind_interdisc.js(ind_interdisc.js):::exec
  ind_interdisc.js(ind_interdisc.js):::exec --> interdisc_*[(interdisc_*)]:::table
  research_outputs_*[(research_outputs_*)]:::table --> ind_low_volume.js(ind_low_volume.js):::exec
  ind_low_volume.js(ind_low_volume.js):::exec --> ind_ok_volume_*[(ind_ok_volume_*)]:::table
  research_outputs_base[(research_outputs_base)]:::table --> ind_publishing_profile.js(ind_publishing_profile.js):::exec
  ind_publishing_profile.js(ind_publishing_profile.js):::exec --> publishing_profile_*[(publishing_profile_*)]:::table
  core_papers[(core_papers)]:::table --> ind_ratings.js(ind_ratings.js):::exec
  core_heps[(core_heps)]:::table --> ind_ratings.js(ind_ratings.js):::exec
  core_fors[(core_fors)]:::table --> ind_ratings.js(ind_ratings.js):::exec
  benchmarks_hpi_*[(benchmarks_hpi_*)]:::table --> ind_ratings.js(ind_ratings.js):::exec
  benchmarks_rci_*[(benchmarks_rci_*)]:::table --> ind_ratings.js(ind_ratings.js):::exec
  ind_ratings.js(ind_ratings.js):::exec --> rci_scores_*[(rci_scores_*)]:::table
  ind_ratings.js(ind_ratings.js):::exec --> ratings_*[(ratings_*)]:::table
  raw_heps.js(raw_heps.js):::exec --> raw_heps[(raw_heps)]:::table
  raw_history.js(raw_history.js):::exec --> era_historical_ratings[(era_historical_ratings)]:::table
  raw_issns.js(raw_issns.js):::exec --> raw_issns[(raw_issns)]:::table
  raw_journals.js(raw_journals.js):::exec --> raw_journals[(raw_journals)]:::table
  raw_papers.js(raw_papers.js):::exec --> raw_papers[(raw_papers)]:::table
  raw_rors.js(raw_rors.js):::exec --> raw_rors[(raw_rors)]:::table
  raw_topics.js(raw_topics.js):::exec --> raw_forcodes[(raw_forcodes)]:::table
  observatory.doi20220709[(observatory.doi20220709)]:::table --> report_institution.js(report_institution.js):::exec
  core_papers[(core_papers)]:::table --> report_institution.js(report_institution.js):::exec
  core_journals[(core_journals)]:::table --> report_institution.js(report_institution.js):::exec
  research_outputs_*[(research_outputs_*)]:::table --> report_institution.js(report_institution.js):::exec
  benchmarks_summary_*[(benchmarks_summary_*)]:::table --> report_institution.js(report_institution.js):::exec
  report_institution.js(report_institution.js):::exec --> curtin_papers[(curtin_papers)]:::table
  report_institution.js(report_institution.js):::exec --> curtin_outputs[(curtin_outputs)]:::table
  report_institution.js(report_institution.js):::exec --> curtin_summary_by_field_year[(curtin_summary_by_field_year)]:::table
  report_institution.js(report_institution.js):::exec --> curtin_summary_by_field[(curtin_summary_by_field)]:::table
  report_institution.js(report_institution.js):::exec --> curtin_summary_by_year[(curtin_summary_by_year)]:::table
  report_institution.js(report_institution.js):::exec --> curtin_paper_classes[(curtin_paper_classes)]:::table
  report_institution.js(report_institution.js):::exec --> curtin_class_tallies_by_field_year[(curtin_class_tallies_by_field_year)]:::table
  report_institution.js(report_institution.js):::exec --> curtin_class_tallies_by_field[(curtin_class_tallies_by_field)]:::table
  report_institution.js(report_institution.js):::exec --> curtin_class_tallies_by_year[(curtin_class_tallies_by_year)]:::table
```