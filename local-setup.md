## Local setup

**prerequisites:**
- Node.js (version 14 or later)
- Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   cd DeshCode
   ```

- Run `docker-compose -f docker-compose-external-services.yml up` to start the external services(e.g. PostgreSQL, RabbitMQ).
- Run `docker-compose up` to start the main application services.
- Run `docker exec -it problems-worker sh` to access the worker container.
- Run `dockerd-entrypoint.sh` inside worker container then `docker pull thearkan/node.js` to pull the Node.js Docker image.