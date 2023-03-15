import { v2 } from '@google-cloud/tasks'
import dotenv from 'dotenv'
import { SOLANA_TRANSFER_QUEUE } from '@/index'
dotenv.config()

const { CloudTasksClient } = v2
const project = process.env.SKEET_GCP_PROJECT || 'skeet-framework'
const location = process.env.SKEET_GCP_TASK_REGION || 'europe-west1'
const SOLANA_TRANSFER_WORKER_URL = process.env.SOLANA_TRANSFER_WORKER_URL || ''
const ENDPOINT = '/run'

const createCloudTask = async (
  queue: string = SOLANA_TRANSFER_QUEUE,
  body: string
) => {
  const client = new CloudTasksClient()
  async function createTask() {
    const url = SOLANA_TRANSFER_WORKER_URL + ENDPOINT
    const parent = client.queuePath(project, location, queue)
    const task = {
      httpRequest: {
        headers: {
          'Content-Type': 'application/json',
        },
        httpMethod: 'POST',
        url,
        body,
      },
    }

    console.log(`Sending task: ${queue}`)

    // Send create task request.
    const request = { parent: parent, task: task }
    //@ts-ignore
    const [response] = await client.createTask(request)
    const name = response.name
    console.log(`Created task ${name}`)
  }

  createTask()
}

export default createCloudTask
