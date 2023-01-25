import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'


export enum State {
  FETCHING = 'FETCHING',
  EDITING = 'EDITING',
  SUBMITTING = 'SUBMITTING',
  SUBMITTED = 'SUBMITTED'
}

export type ComponentState = {
  state: State,
  summary: string
}

const initialComponentState = {
  state: State.FETCHING,
  summary: 'Summary is being processed, hold on...',
}

// Define the type(s) for your reducer
export interface ChatSummaryState {
  taskToState: Map<string, ComponentState>
}

// Then, define your reducer's initial state
const initialState: ChatSummaryState = {
  taskToState: new Map<string, ComponentState>(),
}

export const chatSummarySlice = createSlice({
  name: 'chatSummary',
  initialState,
  reducers: {
    setFetching: (state, action: PayloadAction<string>) => {
      state.taskToState.set(action.payload, initialComponentState)
    },
    setEditing: (state, action: PayloadAction<UpdateSummaryPayload>) => {
      state.taskToState.set(action.payload.taskSid, {state: State.EDITING, summary: action.payload.summary})
    },
    setSubmitting: (state, action: PayloadAction<UpdateStatusPayload>) => {
      let oldState = state.taskToState.get(action.payload.taskSid)
      state.taskToState.set(action.payload.taskSid, {state: State.SUBMITTING, summary: oldState!.summary})
    },
    setSubmitted: (state, action: PayloadAction<UpdateStatusPayload>) => {
      let oldState = state.taskToState.get(action.payload.taskSid)
      state.taskToState.set(action.payload.taskSid, {state: State.SUBMITTED, summary: oldState!.summary})
    },
  },
})

export default chatSummarySlice.reducer
export const {
  setFetching,
  setEditing,
  setSubmitting,
  setSubmitted,
} = chatSummarySlice.actions

type UpdateSummaryPayload = {
  taskSid: string,
  summary: string
}

type UpdateStatusPayload = {
  taskSid: string,
}