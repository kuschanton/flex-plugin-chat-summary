import * as Flex from '@twilio/flex-ui'
import {Manager} from '@twilio/flex-ui'

export const apiGetTimeline = async (): Promise<string> => {
  try {
    return Promise.resolve('')
  } catch (e: any) {
    console.log(e)
    Flex.Notifications.showNotification('agentTimelineError', {msg: `Error getting events ${e.message}`})
    return Promise.resolve('')
  }
}

export const apiWriteTimeline = async (): Promise<string> => {
  try {
    return Promise.resolve('')
  } catch (e: any) {
    console.log(e)
    Flex.Notifications.showNotification('agentTimelineError', {msg: `Error getting events ${e.message}`})
    return Promise.resolve('')
  }
}

type AddSummaryRequest = {
  taskSid: string
  attributeKey: 'summary'
  attributeValue: string
}

export const apiAddSummaryToTask = async (taskSid: string, summary: string): Promise<void> => {
  try {
    const requestParams: AddSummaryRequest = {
      taskSid: taskSid,
      attributeKey: 'summary',
      attributeValue: summary,
    }
    await request('/get-summary', requestParams)
  } catch (e: any) {
    console.log(e)
    Flex.Notifications.showNotification('agentTimelineError', {msg: `Error getting events ${e.message}`})
  }
}

type Summary = {
  summary: string
}

type SummaryRequest = {
  customerName: string,
  conversationSid: string
}

export const apiGetSummary = async (
  customerName: string,
  conversationSid: string,
): Promise<string> => {
  try {
    let requestParams: SummaryRequest = {customerName, conversationSid}
    const {summary} = <Summary>await request('/get-summary', requestParams)
    return summary
  } catch (e: any) {
    console.log(e)
    Flex.Notifications.showNotification('agentTimelineError', {msg: `Error getting events ${e.message}`})
    throw e
  }
}


const request = async (path: string, params = {}) => {
  const manager = Manager.getInstance()
  const token = manager.store.getState().flex.session.ssoTokenPayload.token
  const {REACT_APP_SERVICE_BASE_URL} = process.env

  const url = `${REACT_APP_SERVICE_BASE_URL}${path}`

  const body = {
    ...params,
    token,
  }

  const options = {
    method: 'POST',
    body: new URLSearchParams(body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }

  const respRaw = await fetch(url, options)
  const resp = await respRaw.json()

  if (resp.error) {
    throw new Error(resp.error)
  }

  return resp
}
