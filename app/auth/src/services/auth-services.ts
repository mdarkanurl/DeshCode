import { sendVerificationCodeQueue } from "../RabbitMQ";
import { AuthRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
import bcrypt from "bcryptjs";

const authRepo = new AuthRepo();

const signUp = async (data: { email: string, password: string }) => {
    try {
        const isUsersAlreadyExist = await authRepo.getByEmail(data.email, true);

        if(isUsersAlreadyExist) {
            throw new CustomError('User already exist under this email', 400);
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(data.password, 10);

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Save the users to Database
        const users = await authRepo.create({
            email: data.email,
            password: hashPassword,
            verificationCode: verificationCode.toString()
        });

        // Send verification code to email
        await sendVerificationCodeQueue(users.email, users.verificationCode);
        return users;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

export {
    signUp
}