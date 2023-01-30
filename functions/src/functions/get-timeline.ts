// Imports global types
import '@twilio-labs/serverless-runtime-types'
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'
import * as HelperType from './utils/helper.protected'
import {Timeline} from './utils/helper.protected'


const {ResponseOK, ohNoCatch, validateToken} = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path)

type Env = {
  SYNC_SERVICE_SID: string
  SYNC_MAP_SID: string
  ACCOUNT_SID: string
  AUTH_TOKEN: string
}

type Request = {
  customer: string,
  token: string
}

export const handler: ServerlessFunctionSignature<Env, Request> = async function (
  context: Context<Env>,
  event: Request,
  callback: ServerlessCallback,
) {

  try {
    await validateToken(event, context)
  } catch (e) {
    return ohNoCatch(e, callback)
  }

  context.getTwilioClient().sync
    .services(context.SYNC_SERVICE_SID)
    .syncMaps(context.SYNC_MAP_SID)
    .syncMapItems(event.customer)
    .fetch()
    .then(res => ResponseOK(res.data, callback))
    .catch(_ => ResponseOK(emptyTimeline, callback))
}

const emptyTimeline: Timeline = {entries: []}