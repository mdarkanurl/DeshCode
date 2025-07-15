import { ProblemRepo } from "../repo";
import { SubmitRepo } from "../repo/submit-repo";
import { CustomError } from "../utils/errors/app-error";
import { sendData } from "../utils/RabbitMQ";

const problemRepo = new ProblemRepo();
const submitRepo = new SubmitRepo();


async function submitSolution(data: {
    problemId: string,
    userId: number,
    language: string,
    code: string
}) {
    try {
        // Check if problem exists
        const problem = await problemRepo.getByProblemId(data.problemId);

        if(!problem) {
            throw new CustomError('The problem does not exist', 404);
        }

        // check the language support or not
        for (let i = 0; i < problem.language.length; i++) {
            if(!problem.language.includes(data.language)) {
                throw new CustomError(`This problem does not support ${data.language} language}`, 404);
            }
        }

        const submits = await submitRepo.create({
            userId: data.userId,
            problemId: problem.id,
            status: "PENDING",
            language: data.language,
            code: data.code,
        });

        // Send data to RabbitMQ
        const message = {
            submissionId: submits.id,
            language: data.language,
            functionName: problem.functionName,
            testCases: problem.testCases,
            code: data.code
        };

        await sendData(message);
        
        return {
            submitId: submits.id,
            status: submits.status
        }
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getSubmission(data: { id: number }) {
    try {
        const submission = await submitRepo.getById(data.id);

        if(!submission) {
            throw new CustomError('The submit ID you provided it doesn\'t exist', 404);
        }

        return submission;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    submitSolution,
    getSubmission
}