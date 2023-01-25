import React from 'react'

import {Box, Button, Flex, TextArea} from '@twilio-paste/core'
import {withTaskContext} from '@twilio/flex-ui'
import {apiAddSummaryToTask, apiGetSummary} from '../../api/Apis'
import {Theme} from '@twilio-paste/core/theme'
import {useSelector, useDispatch} from 'react-redux'
import {actions, AppState} from '../../states'
import {ComponentState, setEditing, State} from '../../states/ChatSummaryState'

export const ChatSummaryDialog = (
  props: {
    task: Task
  },
) => {

  const dispatch = useDispatch()
  const taskSid = props.task.sid

  const stateForSelectedTask: ComponentState | undefined = useSelector(
    (state: AppState) => {
      const taskSummary = props.task.attributes.summary
      if (!!taskSummary) return {state: State.SUBMITTED, summary: taskSummary}
      else return state.pluginState.chatSummary.taskToState.get(taskSid)
    },
  )

  console.log('@@@rendering', props.task.sid, props.task.attributes.summary)
  console.log('@@@stateForSelectedTask', stateForSelectedTask)


  React.useEffect(() => {
      console.log('@@@effect', stateForSelectedTask)
      if (!stateForSelectedTask) {
        dispatch(actions.chatSummary.setFetching(taskSid))
        apiGetSummary(props.task.attributes.customerName, props.task.attributes.conversationSid)
          .then(result => {
            dispatch(actions.chatSummary.setEditing({taskSid, summary: result}))
          }).catch(_ => {
            dispatch(actions.chatSummary.setEditing({taskSid, summary: summaryOnFetchingError}))
          },
        )
      }
    },
  )

  if (!stateForSelectedTask) {
    return null
  }

  // // const [isSubmitted, setIsSubmitted] = React.useState(false)
  // // const [fetchingSummary, setFetchingSummary] = React.useState(true)
  // const [componentState, setComponentState] = React.useState(ComponentState.FETCHING)
  // const initialFormData = Object.freeze({
  //   summary: 'Summary is being processed, hold on...',
  // })
  // const [formData, updateFormData] = React.useState(initialFormData)
  // console.log('@@@formData', formData)

  const handleChange = (e: any) =>
    dispatch(actions.chatSummary.setEditing({taskSid, summary: e.target.value}))

  const handleSubmit = () => {
    dispatch(actions.chatSummary.setSubmitting({taskSid}))
    apiAddSummaryToTask(props.task.sid, stateForSelectedTask.summary)
      .then(_ => {
        console.log('Successfully updated task ', props.task.sid)
        dispatch(actions.chatSummary.setSubmitted({taskSid}))
      })
      .catch(err => {
        console.log('Error updating task', err)
        dispatch(actions.chatSummary.setEditing({taskSid, summary: stateForSelectedTask.summary}))
      })

  }

  return (
    <Theme.Provider theme='default'>
      <Box margin='space60'>
        <TextArea
          id='summary'
          rows={3}
          value={stateForSelectedTask.summary}
          onChange={handleChange}
          disabled={stateForSelectedTask.state !== State.EDITING}
        />
        <Box margin='space60'>
          <Flex hAlignContent='right' vertical>
            <Button onClick={handleSubmit}
                    variant='primary'
                    loading={stateForSelectedTask.state === State.SUBMITTING}
                    disabled={
                      stateForSelectedTask.state === State.FETCHING ||
                      stateForSelectedTask.state === State.SUBMITTED
                    }
            >
              {stateForSelectedTask.state === State.SUBMITTED ? '✅ Submitted' : 'Submit'}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Theme.Provider>
  )
}

type Task = {
  attributes: TaskAttributes,
  sid: string
}

type TaskAttributes = {
  conversationSid: string,
  customerName: string,
  summary?: string
}

export default withTaskContext(ChatSummaryDialog)

const summaryOnFetchingError = 'Could not fetch summary, please write your own...'
