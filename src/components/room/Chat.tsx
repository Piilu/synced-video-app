import React, { FunctionComponent, useState, useRef } from 'react'
import { Paper, Text, Box, Textarea, Flex, ScrollArea, Divider, Button, ActionIcon, Tooltip } from '@mantine/core'
import { IconArrowBarRight } from '@tabler/icons'
import { SendMessage, SendMessageTest } from '../../constants/schema';
import MessageChip from './MessageChip';
import { useWindowEvent } from '@mantine/hooks';
type ChatProps = {
    messages: [SendMessageTest];
    chatOpen: string;
    styles: React.CSSProperties;
    setChatOpen: React.Dispatch<React.SetStateAction<string>>;
}

const Chat: FunctionComponent<ChatProps> = (props: ChatProps) => {
    const { styles, chatOpen, setChatOpen } = props;
    const [messages, setMessages] = useState<[SendMessageTest]>([{ message: "", user: "" }]);
    const [message, setMessage] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const sendMessage = () => {
        if (message.trim() == "") return;

        const prevMessages = messages;
        prevMessages?.unshift({ message: message, user: "Rainer" })
        setMessages(prevMessages)
        setMessage("");
    }

    //#region handeling textarea keyboard 
    useWindowEvent('keydown', (event) => {
        if (event.code == "Enter" && (event.shiftKey) || event.code == "NumpadEnter" && (event.shiftKey)) return;
        if (event.code === 'Enter' || event.code == "NumpadEnter") {
            event.preventDefault();
            sendMessage();
        }
    });
    //#endregion


    return (
        <Paper style={{ ...styles, maxWidth: "25em", minWidth: "25em", height: "100%", margin: 0, gap: "", flexDirection: "column", alignItems: "flex-start" }} shadow="xs" mt={5} radius="xs" withBorder>
            <div style={{ padding: "0.5em" }}>
                <Tooltip position='left' label="Close chat">
                    <ActionIcon size="md" radius="md" onClick={() => { chatOpen == "flex" ? setChatOpen("none") : setChatOpen("flex"); }}>
                        <IconArrowBarRight size={29} />
                    </ActionIcon>
                </Tooltip>
            </div>
            <Divider style={{ width: "100%", paddingBottom: "0" }} />
            <Flex style={{ height: "100%", width: "100%", overflow: "auto", padding: "1em" }}
                align="flex"
                direction="column-reverse"
                wrap="nowrap">
                {messages?.map(message => {
                    return (
                        <MessageChip key={Math.floor(Math.random() * 100000)} user={message.user} message={message.message} />
                    );
                })}
                {/* <MessageChip user='Rainer' message='testing1' />
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
                <MessageChip user='Rainer' message='testingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtesting' /> */}
            </Flex>

            <Box style={{ width: "100%", marginTop: "auto", padding: "0 1em 1em" }}>
                <Flex align="center" direction="row">
                    <Textarea
                        value={message}
                        onChange={e => setMessage(e.currentTarget.value)}
                        style={{ width: "100%" }}
                        radius="md"
                        placeholder="Message"
                        autosize
                        variant="filled"
                        size="md"
                        minRows={2}
                        maxRows={2}
                        ref={inputRef}
                    />
                    <Button size="md" radius="md" style={{ height: "4.5em" }}>Send</Button>
                </Flex>
            </Box>

        </Paper >
    )
}

export default Chat

