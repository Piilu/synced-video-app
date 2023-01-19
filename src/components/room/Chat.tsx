import React, { FunctionComponent, useState } from 'react'
import { Paper, Text, Box, Textarea, Flex, ScrollArea, Divider, Button, ActionIcon } from '@mantine/core'
import { IconArrowBarRight } from '@tabler/icons'
import { SendMessage, SendMessageTest } from '../../constants/schema';
import MessageChip from './MessageChip';

type ChatProps = {
    messages: [SendMessageTest];
}

const Chat: FunctionComponent<ChatProps> = (props: ChatProps) => {
    const {messages} = props;
    const [chatOpen, setChatOpen] = useState<string>("flex")
    return (
        <Paper style={{ display: chatOpen, height: "100%", gap: "", flexDirection: "column", alignItems: "flex-start" }} shadow="xs" mt={5} radius="md" withBorder>
            <div style={{ padding: "1em" }}>
                <ActionIcon size="xl" radius="md" onClick={() => { chatOpen == "flex" ? setChatOpen("none") : setChatOpen("flex"); }}>
                    <IconArrowBarRight size={34} />
                </ActionIcon>
            </div>
            <Divider style={{ width: "100%", paddingBottom: "0" }} />
            <Flex style={{ height: "100%", width: "100%", overflow: "auto", padding: "1em" }}
                align="flex"
                direction="column-reverse"
                wrap="nowrap">
                    {/* {messages.map(message=>{})} */}
                <MessageChip user='Rainer' message='testing1' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testing' />
                <MessageChip user='Rainer' message='testingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtesting' />
                <MessageChip user='Rainer' message='testingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtesting' />
                <MessageChip user='Rainer' message='testingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtesting' />
            </Flex>

            <Box style={{ width: "100%", marginTop: "auto" }}>
                <Flex align="center" direction="row">
                    <Textarea
                        style={{ width: "100%" }}
                        radius="md"
                        placeholder="Message"
                        autosize
                        variant="filled"
                        size="md"
                        minRows={2}
                        maxRows={4}
                    />
                    <Button size="md" radius="md" style={{ height: "4.5em" }}>Send</Button>
                </Flex>
            </Box>

        </Paper >
    )
}

export default Chat