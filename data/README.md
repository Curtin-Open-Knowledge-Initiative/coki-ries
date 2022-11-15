# ./data

The application uses this directory for data files.

- The directory should not be under version control (verify with ../.gitignore).
- You may safely delete the content of this directory without corrupting the application.
- Temporary files will accumulate here, such as caches and ETL staging.
- If using Docker, you may want to bind mount a directory to this location to persist data and avoid container bloat.
