import { redis } from "../redis";
import dotenv from "dotenv";
import { CustomError } from "../utils/errors/app-error";
dotenv.config({
    path: "../.env"
});

async function getLeaderboardResultsByContestId(data: {
    contestId: string;
    skip: number;
    limit: number;
}) {
    try {
        const startIndex = data.skip;
        const endIndex = startIndex + data.limit - 1;

        const topUsers = await redis.zrevrange(`leaderboard:${data.contestId}`, startIndex, endIndex, "WITHSCORES");

        if(topUsers.length === 0) throw new CustomError('No records found for the given contestId', 404);

        const leaderboard: { userId: string; score: number }[] = [];

        for (let i = 0; i < topUsers.length; i += 2) {
            leaderboard.push({ userId: topUsers[i], score: Number(topUsers[i + 1]) });
        }
        return leaderboard;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    getLeaderboardResultsByContestId
}