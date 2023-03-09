// Imports global types
import '@twilio-labs/serverless-runtime-types'
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'
import * as HelperType from './utils/helper.protected'
import {MessageInstance} from 'twilio/lib/rest/conversations/v1/conversation/message'

import {Configuration, OpenAIApi} from 'openai'

const {ResponseOK, ohNoCatch, validateToken} = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path)

type Env = {
  OPENAI_API_KEY: string
  ACCOUNT_SID: string
  AUTH_TOKEN: string
}

type Request = {
  customerName: string,
  conversationSid: string,
  token: string
}

export const handler: ServerlessFunctionSignature<Env, Request> = async function (
  context: Context<Env>,
  event: Request,
  callback: ServerlessCallback,
) {

  console.log(event)

  try {
    await validateToken(event, context)

    const messages = await context.getTwilioClient()
      .conversations
      .conversations(event.conversationSid)
      .messages
      .list()

    let transcript = messages.reduce(
      (acc, next) => acc + buildNewMessage(event, next),
      '',
    )

    const configuration = new Configuration({apiKey: context.OPENAI_API_KEY})
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Summarise for me this chat in one sentence: \n${transcript}`,
      max_tokens: 500,
    })

    return ResponseOK({summary: completion.data.choices[0].text}, callback)
  } catch (e) {
    return ohNoCatch(e, callback)
  }
}

const buildNewMessage = (event: Request, message: MessageInstance) =>
  getAuthorName(event.customerName, message) +
  message.body +
  '\n'

const getAuthorName = (customerName: string, message: MessageInstance) => {
  switch (message.author) {
    case customerName:
      return '[Customer]: '
    default:
      return '[Agent]: '
  }
}
