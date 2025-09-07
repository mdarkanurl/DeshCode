import { generateJwtAccessToken } from "./jwt-access-token";
import { generateJwtRefreshToken } from "./jwt-refresh-token";

const jwtToken = {
    accessToken: generateJwtAccessToken,
    refreshToken: generateJwtRefreshToken
}

export {
    jwtToken
}