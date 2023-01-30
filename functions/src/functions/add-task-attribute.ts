// Imports global types
import '@twilio-labs/serverless-runtime-types'
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'
import * as HelperType from './utils/helper.protected'

const {ResponseOK, ohNoCatch, validateToken} = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path)

type Request = {
  token: string,
  taskSid: string,
  attributeKey: string,
  attributeValue: any
}

type Env = {
  ACCOUNT_SID: string
  AUTH_TOKEN: string
  TASKROUTER_WORKSPACE_SID: string
}

export const handler: ServerlessFunctionSignature<Env, Request> = async function (
  context: Context<Env>,
  event: Request,
  callback: ServerlessCallback,
) {
  try {
    await validateToken(event, context)

    // parse data form the incoming http request
    const taskSid = event.taskSid
    const attributeKey = event.attributeKey
    const attributeValue = event.attributeValue

    // retrieve attributes of the original task
    let task = await context.getTwilioClient().taskrouter
      .workspaces(context.TASKROUTER_WORKSPACE_SID)
      .tasks(taskSid)
      .fetch()

    let newAttributes = JSON.parse(task.attributes)

    // Will blindly override the attribute, if it is an object and you want to do deep merge
    // some more work here is needed
    newAttributes = Object.assign(newAttributes, {
      [attributeKey]: attributeValue
    })

    // update task
    await context.getTwilioClient().taskrouter
      .workspaces(context.TASKROUTER_WORKSPACE_SID)
      .tasks(taskSid)
      .update({
        attributes: JSON.stringify(newAttributes),
      })

    return ResponseOK({}, callback)
  } catch (e) {
    return ohNoCatch(e, callback)
  }
}