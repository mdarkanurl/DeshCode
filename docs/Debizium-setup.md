You should run the following commands to set up Debezium for capturing changes from the Postgres database used by the Contests Service.

## Debezium Setup commands
- Run `docker-compose -f docker-compose-external-services.yml up` to start the external services.
- Run `docker compose exec postgres sh` to go into the Postgres container.
- Run `psql -U postgres` to access the Postgres psql.
- Run `\c contests_db` to connect to the contests database.
- Run `CREATE ROLE debezium WITH REPLICATION LOGIN PASSWORD 'debezium';`
- Run `GRANT SELECT ON TABLE contests_db.public."submissions" TO debezium;`
- Run `CREATE PUBLICATION submissions_pub FOR TABLE public."submissions";`