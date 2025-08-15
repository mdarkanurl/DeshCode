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
        const problems = await axios.get(
            `${process.env.PROBLEM_SERVICE_URL}/api/v1/problems/${data.problemId}`,
        );

        if(!problems.data.Data) {
            throw new CustomError("Problem doesn't exist", 404);
        }

        // check the language support or not
        for (let i = 0; i < problems.data.Data.language.length; i++) {
            if(!problems.data.Data.language.includes(data.language)) {
                throw new CustomError(`This problem does not support ${data.language} language}`, 404);
            }
        }

        const submits = await submitRepo.create({
            participantId: data.participantId,
            problemId: problems.data.Data.id,
            status: "PENDING",
            language: data.language,
            code: data.code,
        });

        // Send data to RabbitMQ
        const message = {
            submissionId: submits.id,
            language: data.language,
            functionName: problems.data.Data.functionName,
            testCases: problems.data.Data.testCases,
            problemType: problems.data.Data.problemTypes,
            code: data.code
        };

        await sendData(problems.data.Data.problemTypes, message);

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