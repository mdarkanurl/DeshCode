import { SubmitRepo } from "../repo";
import axios from "axios";
import { config } from "dotenv";
import { CustomError } from "../utils/errors/app-error";
import { sendData } from "../utils/RabbitMQ";
config();

const submitRepo = new SubmitRepo();

async function submitSolution(data: {
    participantId: string,
    contestId: string,
    problemId: string,
    language: string,
    code: string
}) {
    try {
        const problem = await axios.get(
            `${process.env.PROBLEM_SERVICE_URL}/api/v1/problems/${data.problemId}`,
        );

        if(!problem.data.Data) {
            throw new CustomError("Problem doesn't exist", 404);
        }

        // check the language support or not
        for (let i = 0; i < problem.data.Data.language.length; i++) {
            if(!problem.data.Data.language.includes(data.language)) {
                throw new CustomError(`This problem does not support ${data.language} language}`, 404);
            }
        }

        const submits = await submitRepo.create({
            participantId: data.participantId,
            problemId: problem.data.Data.id,
            status: "PENDING",
            language: data.language,
            code: data.code,
        });

        // Send data to RabbitMQ
        const message = {
            submissionId: submits.id,
            language: data.language,
            functionName: problem.data.Data.functionName,
            testCases: problem.data.Data.testCases,
            problemType: problem.data.Data.problemTypes,
            code: data.code
        };

        await sendData(problem.data.Data.problemTypes, message);
        
        return {
            submitId: submits.id,
            status: submits.status
        }
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    submitSolution
}