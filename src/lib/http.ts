import fetch from 'node-fetch'

export const sendPost = async (url: string, body: string) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    return response
  } catch (e) {
    console.log({ e })
    throw new Error(`Skeet Plugin - sendPost: ${e}`)
  }
}
