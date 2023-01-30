import React from 'react'
import {Box, Table, TBody, Td, Text, Th, THead, Tr} from '@twilio-paste/core'
import {withTaskContext} from '@twilio/flex-ui'
import {apiGetTimeline, Timeline} from '../../api/Apis'
import {Theme} from '@twilio-paste/core/theme'
import {SMSCapableIcon} from '@twilio-paste/icons/esm/SMSCapableIcon'
import {FileIcon} from '@twilio-paste/icons/esm/FileIcon'

const InteractionTimeline = (
  props: {
    task: Task
  },
) => {

  const [timeline, setTimeline] = React.useState<Timeline>({entries: []})
  const [fetchingTimeline, setFetchingTimeline] = React.useState(true)

  React.useEffect(() => {
    if (fetchingTimeline) {
      setFetchingTimeline(true)
      apiGetTimeline(props.task.attributes.customers.phone)
        .then(result => {
          setTimeline(result)
          setFetchingTimeline(false)
        })
        .catch(err => {
          console.log('Error fetching timeline', err)
          setFetchingTimeline(false)
        })
    }
  }, [])

  if (fetchingTimeline) {
    return <Theme.Provider theme='default'><Loading/></Theme.Provider>
  } else if (timeline.entries.length === 0) {
    return <Theme.Provider theme='default'><EmptyTimeline/></Theme.Provider>
  } else {

    let sortedEntries = timeline.entries.sort(
      (a, b) => Date.parse(b.date.toString()) - Date.parse(a.date.toString()),
    )

    return <Theme.Provider theme='default'>
      <Box margin='space60'>
        <Table>
          <THead>
            <Tr>
              <Th>
                Channel
              </Th>
              <Th>
                Date
              </Th>
              <Th>
                Summary
              </Th>
            </Tr>
          </THead>
          <TBody>
            {sortedEntries.map(entry =>
              <Tr key={Date.parse(entry.date.toString())}>
                <Td align='center'>
                  <ChannelIcon channel={entry.channel}/>
                </Td>
                <Td>
                  <Text as='p'>{entry.date}</Text>
                </Td>
                <Td>
                  <Text as='p'>{entry.summary}</Text>
                </Td>
              </Tr>,
            )}
          </TBody>
        </Table>
      </Box>
    </Theme.Provider>
  }
}

type Task = {
  attributes: TaskAttributes,
  sid: string
}

type TaskAttributes = {
  customers: {
    phone: string
  }
}

const ChannelIcon = (props: { channel: string }) => {
  switch (props.channel) {
    case 'whatsapp':
      return <WhatsAppIcon/>
    case 'sms':
      return <SMSCapableIcon decorative={true}/>
    default:
      return <FileIcon decorative={true}/>
  }
}

const Loading = () => <Box top='50%' left='50%' position='fixed'>
  {/*<Spinner decorative={false} title="Loading" size="sizeIcon80" />*/}
  <Text as='span' fontStyle='italic'>
    Loading
  </Text>
</Box>

const EmptyTimeline = () => <Box top='50%' left='50%' position='fixed'>
  <Text as='span' fontStyle='italic'>
    No results found
  </Text>
</Box>

const WhatsAppIcon = () => <svg width='1.9em' height='1.9em' viewBox='0 0 24 24' className='Twilio-Icon-Content'>
  <path
    d='M20 11.794c0 4.304-3.516 7.794-7.855 7.794a7.868 7.868 0 01-3.796-.97L4 20l1.418-4.182a7.712 7.712 0 01-1.127-4.024C4.29 7.489 7.807 4 12.145 4 16.485 4 20 7.49 20 11.794zm-7.855-6.553c-3.641 0-6.603 2.94-6.603 6.553 0 1.434.467 2.762 1.258 3.842l-.825 2.433 2.537-.806a6.6 6.6 0 003.634 1.084c3.64 0 6.603-2.94 6.603-6.553s-2.962-6.553-6.604-6.553zm3.967 8.348c-.049-.08-.177-.127-.37-.223-.192-.095-1.139-.558-1.315-.621-.176-.064-.305-.096-.433.095s-.497.622-.61.749c-.112.128-.225.144-.417.048-.193-.095-.813-.297-1.548-.948a5.76 5.76 0 01-1.071-1.323c-.113-.19-.012-.294.084-.39.087-.085.193-.222.289-.334.096-.112.128-.191.192-.319.065-.127.033-.239-.016-.334-.048-.096-.433-1.036-.594-1.419-.16-.382-.53-.346-.659-.346-.128 0-.48.06-.656.25-.177.192-.674.654-.674 1.594 0 .94.69 1.849.786 1.976.096.127 1.44 2.24 3.29 2.884 1.849.644 2.037.53 2.31.478.272-.052 1.004-.37 1.232-.83.228-.46.228-.907.18-.987z'
    fill='currentColor' stroke='none'></path>
</svg>

export default withTaskContext(InteractionTimeline)

