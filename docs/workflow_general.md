```mermaid

%%{ init: { "theme":"forest", "themeVariables": { "fontFamily" : "helvetica" }}}%%
graph TD 
classDef R fill:#FDD,stroke:#000;
classDef G fill:#DFD,stroke:#000;
classDef B fill:#DDF,stroke:#000;
classDef W fill:#FFF,stroke:#000;

A("BEGIN"):::W 
A       -- "<p>Collect all available research outputs</p>"        --> RAW[(Raw Outputs)]:::B
RAW     -- "<p>QC PASS</p>"                                       --> OK[(Valid outputs)]:::B
RAW     -- "<p>QC FAIL, eg: missing DOI</p>"                      --> KO(LOG,DROP):::R
OK      -- "<p>Define analysis dimensions, eg: (field,year)</p>"  --> DIMS(Schema Documents):::G
DIMS    -- "<p>Define a kernel function that transforms valid outputs and generates primary metrics that are compatible with the chosen dimensions</p>" --> KERNEL(Tranformation Kernel):::R
KERNEL  -- "<p>Apply the kernel to the outputs</p>"               --> READY[(Transformed Outputs)]:::B
READY   -- "<p>Select benchmark set</p>"                          --> B_SET[(Benchmark set)]:::B
READY   -- "<p>Select analysis set</p>"                           --> A_SET[(Analysis set)]:::B
B_SET   -- "<p>Arrange outputs into dimensional groupings</p>"    --> B_GROUP[(B Grouped)]:::B
A_SET   -- "<p>Arrange outputs into dimensional groupings</p>"    --> A_GROUP[(A Grouped)]:::B
B_GROUP -- "<p>Aggregate by groupings to build benchmarks</p>"    --> BMARK[(Benchmark Tables)]:::B
BMARK   -- "<p>QC FAIL: low statistical power</p>"                --> KO2(LOG,DROP):::R
BMARK   -- "<p>Define boundary values for categories</p>"         --> BOUNDS[(Category Boundaries)]:::B
A_GROUP -- "<p>Aggregate by groupings and compare to matching benchmarks</p>" --> OK3[(Relative Metrics)]:::B
BMARK   --> OK3
OK3     -- "<p>QC FAIL: low statistical power</p>"                --> KO4(LOG,DROP):::R
OK3     -- "<p>Assign primary scores</p>"                         --> OK5[(Scored)]:::B
OK5     -- "<p>Assign category labels based on scores</p>"        --> OK6[(Categories)]:::B
BOUNDS  --> OK6
OK6     -- "<p>Compute aggregate metrics based on labels</p>"     --> OK7[(Tallies)]:::B
OK7     -- "<p>Repeat process with a modified method</p>"         --> DIMS 
OK7     -- "<p>Report on changes between kernel methods</p>"      --> Z(END)

```
