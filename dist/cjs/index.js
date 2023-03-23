"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skeetSolTransfer = exports.skeetSplTransfer = exports.DEFAULT_RETURN_MUTATION_NAME = exports.SOLANA_TOKEN_MINT_ADDRESS = exports.SOLANA_TRANSFER_WORKER_DEV_URL = exports.SOLANA_TRANSFER_QUEUE = void 0;
const tasks_1 = require("@google-cloud/tasks");
const dotenv = __importStar(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const { CloudTasksClient } = tasks_1.v2;
const ENDPOINT = '/run';
dotenv.config();
exports.SOLANA_TRANSFER_QUEUE = 'skeet-solana-token-transfer';
exports.SOLANA_TRANSFER_WORKER_DEV_URL = 'http://localhost:1112/run';
exports.SOLANA_TOKEN_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';
exports.DEFAULT_RETURN_MUTATION_NAME = 'saveSkeetSolanaTransfer';
const skeetSplTransfer = async (solanaSplTransferParam) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const payload = await encodeBase64(solanaSplTransferParam);
            await createCloudTask(solanaSplTransferParam.workerUrl, solanaSplTransferParam.projectId, solanaSplTransferParam.taskLocation, exports.SOLANA_TRANSFER_QUEUE, payload);
        }
        else {
            const res = await sendPost(exports.SOLANA_TRANSFER_WORKER_DEV_URL, JSON.stringify(solanaSplTransferParam));
            const result = await res.json();
            console.log(`Solana Transfer POST result: ${result.status}`);
        }
    }
    catch (error) {
        const errorLog = `skeetSplTransfer: ${error}`;
        console.log(errorLog);
        throw new Error(errorLog);
    }
};
exports.skeetSplTransfer = skeetSplTransfer;
const skeetSolTransfer = async (solanaSolTransferParam) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const solBody = {
                tokenMintAddress: exports.SOLANA_TOKEN_MINT_ADDRESS,
                decimal: 9,
            };
            const transferBody = Object.assign({}, solanaSolTransferParam, solBody);
            const payload = await encodeBase64(transferBody);
            await createCloudTask(solanaSolTransferParam.workerUrl, solanaSolTransferParam.projectId, solanaSolTransferParam.taskLocation, exports.SOLANA_TRANSFER_QUEUE, payload);
        }
        else {
            const res = await sendPost(exports.SOLANA_TRANSFER_WORKER_DEV_URL, JSON.stringify(solanaSolTransferParam));
            const result = await res.json();
            console.log(`Solana Transfer POST result: ${result.status}`);
        }
    }
    catch (error) {
        const errorLog = `skeetSolTransfer: ${error}`;
        console.log(errorLog);
        throw new Error(errorLog);
    }
};
exports.skeetSolTransfer = skeetSolTransfer;
const encodeBase64 = async (payload) => {
    const json = JSON.stringify(payload);
    return Buffer.from(json).toString('base64');
};
const createCloudTask = async (workerUrl, projectId, taskLocation, queue = exports.SOLANA_TRANSFER_QUEUE, body) => {
    const client = new CloudTasksClient();
    async function createTask() {
        const url = workerUrl + ENDPOINT;
        const parent = client.queuePath(projectId, taskLocation, queue);
        const task = {
            httpRequest: {
                headers: {
                    'Content-Type': 'application/json',
                },
                httpMethod: 'POST',
                url,
                body,
            },
        };
        console.log(`Sending task: ${queue}`);
        // Send create task request.
        const request = { parent: parent, task: task };
        //@ts-ignore
        const [response] = await client.createTask(request);
        const name = response.name;
        console.log(`Created task ${name}`);
    }
    createTask();
};
const sendPost = async (url, body) => {
    try {
        const response = await (0, node_fetch_1.default)(url, {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/json' },
        });
        return response;
    }
    catch (e) {
        console.log({ e });
        throw new Error(`Skeet Plugin - sendPost: ${e}`);
    }
};
