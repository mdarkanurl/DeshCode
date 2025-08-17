import { config } from "dotenv";
config();

const PROBLEMS_PORT = process.env.PROBLEMS_PORT || 3000;
const DISCUSSIONS_PORT = process.env.DISCUSSIONS_PORT || 3001;
const CONTESTS_PORT = process.env.CONTESTS_PORT || 3002;
const LEADERBOARDS_PORT = process.env.LEADERBOARDS_PORT || 3003;
const PROBLEMS_WORKER_PORT = process.env.PROBLEMS_WORKER_PORT || 3004;
const CONTESTS_WORKER_PORT = process.env.CONTESTS_WORKER_PORT || 3005;


const PROBLEMS_DATABASE_URL = process.env.PROBLEMS_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/problems_db?schema=public";
const DISCUSSIONS_DATABASE_URL = process.env.DISCUSSIONS_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/discussions_db?schema=public";
const CONTESTS_DATABASE_URL = process.env.CONTESTS_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/contests_db?schema=public";
const LEADERBOARDS_DATABASE_URL = process.env.LEADERBOARDS_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/leaderboards_db?schema=public";

const PROBLEM_SERVICE_URL = process.env.PROBLEM_SERVICE_URL || "http://localhost:3000";
const NODE_ENV = process.env.NODE_ENV || "development";

const PORTS = {
    PROBLEMS_PORT,
    DISCUSSIONS_PORT,
    CONTESTS_PORT,
    LEADERBOARDS_PORT,
    PROBLEMS_WORKER_PORT,
    CONTESTS_WORKER_PORT
};

const DATABASE_URLS = {
    PROBLEMS_DATABASE_URL,
    DISCUSSIONS_DATABASE_URL,
    CONTESTS_DATABASE_URL,
    LEADERBOARDS_DATABASE_URL
};

export {
    PORTS,
    DATABASE_URLS,
    PROBLEM_SERVICE_URL,
    NODE_ENV
};