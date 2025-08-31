- Run `docker-compose -f docker-compose-external-services.yml up` to start the external services.
- Run `docker compose exec postgres sh` to go into the Postgres container.
- Run `psql -U postgres` to access the Postgres psql.
- Run `CREATE DATABASE contests_db;` to create the contests database.
- Run `\c contests_db` to connect to the contests database.
- Run `CREATE ROLE debezium WITH REPLICATION LOGIN PASSWORD 'debezium';`
- Run `GRANT SELECT ON TABLE contests_db.public."Submissions" TO debezium;`
- Run `CREATE PUBLICATION submissions_pub FOR TABLE public."Submissions";`
- Run `curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d '{
  "name": "submissions-updates-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "debezium",
    "database.dbname": "contests_db",
    "database.server.name": "contests",
    "table.include.list": "public.Submissions",
    "plugin.name": "pgoutput",
    "slot.name": "debezium_slot",
    "publication.name": "submissions_pub",
    "topic.prefix": "contests",
    
    "publication.autocreate.mode": "filtered",
    "tombstones.on.delete": "false",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.delete.handling.mode": "rewrite",
    
    "snapshot.mode": "initial" 
  }
}'`