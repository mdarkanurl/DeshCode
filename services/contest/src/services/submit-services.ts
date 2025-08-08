import { SubmitRepo } from "../repo";
import axios from "axios";
import { config } from "dotenv";
config();

async function createSubmit(data: {
    userId: string
    problemId: string
    language: string
    code: string
}) {
    try {
        // Call the submit service
        const submit = await axios.post(
            process.env.PROBLEM_SERVICE_URL || "http://localhost:3000",
            {
                userId: data.userId,
                problemId: data.problemId,
                language: data.language,
                code: data.code
            }
        );

        // 
    } catch (error) {
        
    }
}