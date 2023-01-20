// Imports global types
import '@twilio-labs/serverless-runtime-types'
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'
import * as HelperType from './utils/helper.protected'
import {Timeline, TimelineEntry} from './utils/helper.protected'


const {ResponseOK, ohNoCatch, validateToken} = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path)

type Env = {
  SYNC_SERVICE_SID: string
  SYNC_MAP_SID: string
  ACCOUNT_SID: string
  AUTH_TOKEN: string
}

type Request = {
  customer: string,
  channel: string,
  summary: string,
  token: string
}

export const handler: ServerlessFunctionSignature<Env, Request> = async function (
  context: Context<Env>,
  event: Request,
  callback: ServerlessCallback,
) {

  try {
    //await validateToken(event, context)
  } catch (e) {
    return ohNoCatch(e, callback)
  }

  const mapContext = context.getTwilioClient().sync
    .services(context.SYNC_SERVICE_SID)
    .syncMaps(context.SYNC_MAP_SID)

  const newEntry: TimelineEntry = {
    date: new Date(),
    channel: event.channel,
    summary: event.summary,
  }

  try {
    let response = await mapContext
      .syncMapItems(event.customer)
      .fetch()

    // Timeline for this contact already exists
    const timeline = response.data as Timeline

    const updatedTimeline: Timeline = {
      entries: [...timeline.entries, newEntry],
    }

    mapContext
      .syncMapItems(event.customer)
      .update({
        data: updatedTimeline,
      })
      .then(_ => ResponseOK({}, callback))
      .catch(err => ohNoCatch(err, callback))
  } catch (_) {
    // Timeline for this contact does not exist yet
    const newTimeline: Timeline = {
      entries: [newEntry],
    }

    mapContext
      .syncMapItems
      .create({
        key: event.customer,
        data: newTimeline,
      })
      .then(_ => ResponseOK({}, callback))
      .catch(err => ohNoCatch(err, callback))
  }
}