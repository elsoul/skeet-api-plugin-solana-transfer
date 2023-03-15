import createCloudTask from '@/lib/createCloudTask'
import { sendPost } from '@/lib/http'

export type SolanaSplTransferParam = {
  toAddressPubkey: string
  transferAmountLamport: number
  tokenMintAddress: string
  encodedFromSecretKeyString: string
  iv: string
  rpcUrl: string
  decimal: number
  returnQueryName?: string
}

export type SolanaSolTransferParam = {
  toAddressPubkey: string
  transferAmountLamport: number
  encodedFromSecretKeyString: string
  iv: string
  rpcUrl: string
  returnQueryName?: string
}

export const SOLANA_TRANSFER_QUEUE = 'skeet-solana-token-transfer'
export const SOLANA_TRANSFER_WORKER_DEV_URL = 'http://localhost:1112/run'
export const SOLANA_TOKEN_MINT_ADDRESS =
  'So11111111111111111111111111111111111111112'
export const DEFAULT_RETURN_MUTATION_NAME = 'solanaTransferReturn'

export const skeetSplTransfer = async (
  solanaSplTransferParam: SolanaSplTransferParam
) => {
  try {
    if (!solanaSplTransferParam.returnQueryName) {
      solanaSplTransferParam.returnQueryName = DEFAULT_RETURN_MUTATION_NAME
    }
    if (process.env.NODE_ENV === 'production') {
      const payload = await encodeBase64(solanaSplTransferParam)
      await createCloudTask(SOLANA_TRANSFER_QUEUE, payload)
    } else {
      const res = await sendPost(
        SOLANA_TRANSFER_WORKER_DEV_URL,
        JSON.stringify(solanaSplTransferParam)
      )
      const result = await res.json()
      console.log(`API POST result: ${result.status}`)
    }
  } catch (error) {
    const errorLog = `skeetSplTransfer: ${error}`
    console.log(errorLog)
    throw new Error(errorLog)
  }
}
export const skeetSolTransfer = async (
  solanaSolTransferParam: SolanaSolTransferParam
) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const solBody = {
        tokenMintAddress: SOLANA_TOKEN_MINT_ADDRESS,
        decimal: 8,
      }
      const transferBody: SolanaSplTransferParam = Object.assign(
        {},
        solanaSolTransferParam,
        solBody
      )
      const payload = await encodeBase64(transferBody)
      await createCloudTask(SOLANA_TRANSFER_QUEUE, payload)
    } else {
      const res = await sendPost(
        SOLANA_TRANSFER_WORKER_DEV_URL,
        JSON.stringify(solanaSolTransferParam)
      )
      const result = await res.json()
      console.log(`API POST result: ${result.status}`)
    }
  } catch (error) {
    const errorLog = `skeetSolTransfer: ${error}`
    console.log(errorLog)
    throw new Error(errorLog)
  }
}

const encodeBase64 = async (payload: SolanaSplTransferParam) => {
  const json = JSON.stringify(payload)
  return Buffer.from(json).toString('base64')
}
