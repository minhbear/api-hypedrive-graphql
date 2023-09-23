import { Injectable } from '@nestjs/common'
import { ValidDepthSizePair } from '@solana/spl-account-compression'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { CreateTreeCommand } from './commands/createTree.command'

@Injectable()
export class NFTService {
  async createCollection(params: {
    connection: Connection,
    filmMakerPubKey: PublicKey,
    adminKeyPair: Keypair
  }) {
    const {adminKeyPair, connection, filmMakerPubKey} = params

    /* define tree size for save Compressed NFT */ 
    const maxDepthSizePair: ValidDepthSizePair = { // max=16,384 nodes
      maxDepth: 14,
      maxBufferSize: 64
    }
    const canopyDepth = maxDepthSizePair.maxDepth - 5

    /**
     * Allocate the tree on chain
     */
    // define the address (account) the tree will live
    const treeKeypair = Keypair.generate()

    // create and send transaction to create the tree on chain
    const tree = await CreateTreeCommand.createTree({
      connection, 
      canopyDepth,
      filmMakerPubKey,
      payer: adminKeyPair,
      maxDepthSizePair,
      treeKeypair
    })
  }
}
