import {combineReducers} from '@reduxjs/toolkit'
import chatSummaryReducer, {
  ChatSummaryState,
  setEditing,
  setFetching,
  setSubmitted,
  setSubmitting,
} from './ChatSummaryState'
import {AppState as FlexAppState} from '@twilio/flex-ui'

export const namespace = 'pluginState'

export const actions = {
  chatSummary: {
    setFetching,
    setEditing,
    setSubmitting,
    setSubmitted,
  },
}

export interface AppState {
  flex: FlexAppState
  pluginState: {
    chatSummary: ChatSummaryState
  }
}

export const reducers = combineReducers({
  chatSummary: chatSummaryReducer,
})