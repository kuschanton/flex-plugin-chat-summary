import React from 'react'
import * as Flex from '@twilio/flex-ui'
import {FlexPlugin} from '@twilio/flex-plugin'
import {enableMapSet} from 'immer'

import {namespace, reducers} from './states'
import ChatSummaryDialog from './components/ChatSummaryDialog/ChatSummaryDialog'
import InteractionTimeline from './components/ChatSummaryDialog/InteractionsTimeline'

const PLUGIN_NAME = 'ContactSummaryPlugin'

export default class ContactSummaryPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME)
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {

    enableMapSet()

    manager.store.addReducer?.(namespace, reducers)

    const chatSummaryOptions: Flex.ContentFragmentProps = {
      sortOrder: 0,
      if: (props) => props.task.status === 'wrapping',
    }

    flex.TaskCanvas
      .Content
      .add(<ChatSummaryDialog key='AddSummaryOnWrapUpPlugin-component'/>, chatSummaryOptions)

    const timelineOptions: Flex.ContentFragmentProps = {
      sortOrder: 0,
      if: (props) => !!props.task,
    }

    flex.CRMContainer.Content.replace(
      <InteractionTimeline key='InteractionTimeline-component'/>, timelineOptions,
    )

    registerAlerts(flex, manager)
  }
}

const registerAlerts = (flex: typeof Flex, manager: Flex.Manager) => {
  (manager.strings as any).agentTimelineError = 'Chat Summary Plugin Error: {{msg}}'

  flex.Notifications.registerNotification({
    id: 'chatSummaryError',
    content: 'chatSummaryError',
    type: flex.NotificationType.error,
  })
}