import React from 'react'
import * as Flex from '@twilio/flex-ui'
import {FlexPlugin} from '@twilio/flex-plugin'
import {enableMapSet} from 'immer'

import { namespace, reducers } from './states'
import ChatSummaryDialog from './components/ChatSummaryDialog/ChatSummaryDialog'

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

    console.log('@@@init1')

    manager.store.addReducer?.(namespace, reducers);

    console.log('@@@init2')

    const options: Flex.ContentFragmentProps = {
      sortOrder: 0,
      if: (props) => props.task.status === "wrapping"
    };

    flex.TaskCanvas
      .Content
      .add(<ChatSummaryDialog key="AddSummaryOnWrapUpPlugin-component" />, options);

    console.log('@@@init3')

    registerAlerts(flex, manager)

    console.log('@@@init4')
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