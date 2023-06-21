import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();

program
    .option('-d', 'Variable for debug', false)
    .option('-p <port>', 'Server port', 9090)
    .option('--mode <mode>', 'Option Mode', 'develop')
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path: environment==="production"?"./src/config/.env": environment === 'test'?'./src/config/.env': "./src/config/.env"
});


export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    environment: environment,
    GHclientID: process.env.GHCLIENTID,
    GHClientSecret: process.env.GHCLIENTSECRET,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD
};