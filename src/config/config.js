import dotenv from 'dotenv';

dotenv.config({path: "./src/config/.env.development"});

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    GHclientID: process.env.GHCLIENTID,
    GHClientSecret: process.env.GHCLIENTSECRET,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY
};