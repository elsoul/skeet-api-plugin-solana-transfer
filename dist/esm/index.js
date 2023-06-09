import { v2 } from '@google-cloud/tasks';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
const { CloudTasksClient } = v2;
const ENDPOINT = '/run';
dotenv.config();
export const SOLANA_TRANSFER_QUEUE = 'skeet-solana-token-transfer';
export const SOLANA_TRANSFER_WORKER_DEV_URL = 'http://localhost:1112/run';
export const SOLANA_TOKEN_MINT_ADDRESS = 'So11111111111111111111111111111111111111112';
export const DEFAULT_RETURN_MUTATION_NAME = 'saveSkeetSolanaTransfer';
export const skeetSplTransfer = async (solanaSplTransferParam) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const payload = await encodeBase64(solanaSplTransferParam);
            await createCloudTask(solanaSplTransferParam.workerUrl, solanaSplTransferParam.projectId, solanaSplTransferParam.taskLocation, SOLANA_TRANSFER_QUEUE, payload);
        }
        else {
            const res = await sendPost(SOLANA_TRANSFER_WORKER_DEV_URL, JSON.stringify(solanaSplTransferParam));
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
export const skeetSolTransfer = async (solanaSolTransferParam) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const solBody = {
                tokenMintAddress: SOLANA_TOKEN_MINT_ADDRESS,
                decimal: 9,
            };
            const transferBody = Object.assign({}, solanaSolTransferParam, solBody);
            const payload = await encodeBase64(transferBody);
            await createCloudTask(solanaSolTransferParam.workerUrl, solanaSolTransferParam.projectId, solanaSolTransferParam.taskLocation, SOLANA_TRANSFER_QUEUE, payload);
        }
        else {
            const res = await sendPost(SOLANA_TRANSFER_WORKER_DEV_URL, JSON.stringify(solanaSolTransferParam));
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
const encodeBase64 = async (payload) => {
    const json = JSON.stringify(payload);
    return Buffer.from(json).toString('base64');
};
const createCloudTask = async (workerUrl, projectId, taskLocation, queue = SOLANA_TRANSFER_QUEUE, body) => {
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
        const response = await fetch(url, {
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
