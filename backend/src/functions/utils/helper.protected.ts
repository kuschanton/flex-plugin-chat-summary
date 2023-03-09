import {ServerlessCallback} from '@twilio-labs/serverless-runtime-types/types'
import {validator} from 'twilio-flex-token-validator'

export const ohNoCatch = (e: any, callback: ServerlessCallback) => {
  console.error('Exception: ', typeof e, e)
  const response = new Twilio.Response()
  response.setStatusCode(403)
  response.appendHeader('Access-Control-Allow-Origin', '*')
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET')
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.appendHeader('Content-Type', 'application/json')
  response.setBody({error: typeof e === 'string' ? e : e.message})
  callback(null, response)
}

export const ResponseOK = (obj: any, callback: ServerlessCallback) => {
  console.error('Response: ', typeof obj, obj)
  const response = new Twilio.Response()
  response.setStatusCode(200)
  response.appendHeader('Access-Control-Allow-Origin', '*')
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET')
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.appendHeader('Content-Type', 'application/json')
  response.setBody(typeof obj === 'string' ? {obj} : obj)
  callback(null, response)
}

type MyEvent = {
  token: string
};

type MyContext = {
  ACCOUNT_SID: string
  AUTH_TOKEN: string
};

export const validateToken = async (event: MyEvent, context: MyContext) => {
  const {valid} = <any>await validator(event.token, context.ACCOUNT_SID, context.AUTH_TOKEN)

  if (!valid) {
    throw new Error('Token not valid.')
  }

  return
}

export type TimelineEntry = {
  date: Date,
  channel: string,
  summary: string
}

export type Timeline = {
  entries: TimelineEntry[]
}