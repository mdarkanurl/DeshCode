import { ProblemsRepo } from "../repo";
import { SubmissionsRepo } from "../repo/submissions-repo";
import { CustomError } from "../utils/errors/app-error";
import { sendData } from "../utils/RabbitMQ";

const problemsRepo = new ProblemsRepo();
const submissionsRepo = new SubmissionsRepo();


async function submissionsSolution(data: {
    problemsId: string,
    userId: string,
    language: string,
    code: string
}) {
    try {
        // Check if problem exists
        const problems = await problemsRepo.getByProblemsId(data.problemsId);

        if(!problems) {
            throw new CustomError('The problem does not exist', 404);
        }

        // check the language support or not
        for (let i = 0; i < problems.language.length; i++) {
            if(!problems.language.includes(data.language)) {
                throw new CustomError(`This problem does not support ${data.language} language`, 404);
            }
        }

        const submissions = await submissionsRepo.create({
            userId: data.userId,
            problemsId: problems.id,
            status: "PENDING",
            language: data.language,
            code: data.code,
        });

        // Send data to RabbitMQ
        const message = {
            submissionId: submissions.id,
            language: data.language,
            functionName: problems.functionName,
            testCases: problems.testCases,
            problemType: problems.problemsTypes,
            code: data.code
        };

        await sendData(problems.problemsTypes, message);
        
        return {
            submissionsId: submissions.id,
            status: submissions.status
        }
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getSubmissionById(data: { id: number }) {
    try {
        const submission = await submissionsRepo.getById(data.id);

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
    submissionsSolution,
    getSubmissionById
}