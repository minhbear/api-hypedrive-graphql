import { Connection } from '@solana/web3.js'
import { APP_ENV } from 'src/common/constant'
import { config } from 'src/config'

export const isDevelopment = [APP_ENV.DEV].includes(config.api.nodeEnv)

export const explorerURL = (params: {
  address?: string
  txSignature?: string
  cluster?: 'devnet' | 'testnest' | 'mainnet' | 'mainnet-beta'
}) => {
  const { address, cluster, txSignature } = params

  let baseUrl: string

  if (address) baseUrl = `https://explorer.solana.com/address/${address}`
  else if (txSignature) baseUrl = `https://explorer.solana.com/tx/${txSignature}`
  else return '[unknown]'

  // auto append the desired search params
  const url = new URL(baseUrl)
  url.searchParams.append('cluster', cluster || 'devnet')
  return url.toString() + '\n'
}

/*
  Helper function to extract a transaction signature from a failed transaction's error message
*/
export const extractSignatureFromFailedTransaction = async (params: {
  connection: Connection
  err: any
  fetchLogs?: boolean
}) => {
  const { connection, err, fetchLogs } = params

  if (err?.signature) return err.signature

  // extract the failed transaction's signature
  const failedSig = new RegExp(/^((.*)?Error: )?(Transaction|Signature) ([A-Z0-9]{32,}) /gim).exec(
    err?.message?.toString()
  )?.[4]

  // ensure a signature was found
  if (failedSig) {
    // when desired, attempt to fetch the program logs from the cluster
    if (fetchLogs)
      await connection
        .getTransaction(failedSig, {
          maxSupportedTransactionVersion: 0
        })
        .then(tx => {
          console.log(`\n==== Transaction logs for ${failedSig} ====`)
          console.log(explorerURL({ txSignature: failedSig }), '')
          console.log(tx?.meta?.logMessages ?? 'No log messages provided by RPC')
          console.log(`==== END LOGS ====\n`)
        })
    else {
      console.log('\n========================================')
      console.log(explorerURL({ txSignature: failedSig }))
      console.log('========================================\n')
    }
  }

  // always return the failed signature value
  return failedSig
}
