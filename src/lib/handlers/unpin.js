import { logger } from '@libp2p/logger'

const log = logger('voyager:orbiter:unpin')

export default async ({ orbitdb, pins, dbs, pubkey, addresses }) => {
  for (const address of addresses) {
    log('unpin   ', address)
    const pubkeys = await pins.get(address)

    if (pubkeys && pubkeys.length > 1) {
      const index = pubkeys.indexOf(pubkey)

      if (index > -1) {
        pubkeys.splice(index, 1)
      }

      await pins.set(address, pubkeys)
    } else {
      await pins.del(address)
    }

    if (!await pins.get(address)) {
      await dbs[address].close()
      delete dbs[address]
    }

    log('unpinned', address)
  }
}
