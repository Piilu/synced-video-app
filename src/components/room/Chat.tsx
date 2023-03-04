import { FunctionComponent, useEffect } from 'react';
import React, { useState, useRef } from 'react'
import { Paper, Box, Textarea, Flex, Divider, Button, ActionIcon, Tooltip, TextInput, useMantineColorScheme } from '@mantine/core'
import { IconArrowBarRight, IconMoonStars, IconSearch, IconSun, IconX } from '@tabler/icons'
import MessageChip from './MessageChip';
import { useWindowEvent } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import ToggleTheme from '../custom/ToggleTheme';
import { RoomMessage } from '../../constants/schema';
import { useSession } from 'next-auth/react';
type ChatProps = {
    messages: RoomMessage[] | [];
    chatOpen: string;
    styles: React.CSSProperties;
    roomId: number | undefined;
    user: User | undefined;
    setChatOpen: React.Dispatch<React.SetStateAction<"flex" | "none">>;
    sendMessageWs: (message: RoomMessage) => void
}

const Chat: FunctionComponent<ChatProps> = (props: ChatProps) => {
    const { styles, chatOpen, setChatOpen, sendMessageWs, roomId, messages, user } = props;
    const [message, setMessage] = useState<string>("");
    const [name, setName] = useState<string>(user !== undefined ? user.name as string : "");
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const sendMessage = () => {
        if (message.trim() == "") return;
        if (name.trim() == "") {
            showNotification({
                title: 'Name is required',
                message: "Hey there, your don't have a name! 🤥",
                icon: <IconX />,
                color: "red",
            })
            return;
        }
        sendMessageWs({ message: message, user: user, roomId })
        setMessage("");
    }

    const keyboardSend = (event: React.KeyboardEvent) => {
        if (event.code == "Enter" && (event.shiftKey) || event.code == "NumpadEnter" && (event.shiftKey)) return;
        if (event.code === 'Enter' || event.code == "NumpadEnter") {
            event.preventDefault();
            sendMessage();
        }
    }

    return (
        <Paper style={{ ...styles, maxWidth: "25em", minWidth: "25em", height: "100%", margin: 0, gap: "", flexDirection: "column", alignItems: "flex-start" }} shadow="xs" mt={5} radius="xs" withBorder>
            {/* <p>{messages2!=null?messages2[0].message:"NULL"}</p> */}
            <div style={{ padding: "0.5em", display: "flex", alignItems: "center", width: "100%" }}>
                <Tooltip position='left' label="Close chat">
                    <ActionIcon size="md" radius="md" onClick={() => { chatOpen == "flex" ? setChatOpen("none") : setChatOpen("flex"); }}>
                        <IconArrowBarRight size={29} />
                    </ActionIcon>
                </Tooltip>
                <div style={{ marginLeft: "auto", marginRight: "1em" }}>
                    <TextInput value={name} onChange={e => setName(e.target.value)} placeholder='Placeholder name ...' />
                </div>
                <ToggleTheme />
            </div>
            <Divider style={{ width: "100%", paddingBottom: "0" }} />
            <Flex style={{ height: "100%", width: "100%", overflow: "auto", padding: "1em" }}
                align="flex"
                direction="column-reverse"
                wrap="nowrap">
                {messages.length !== 0 ? messages?.map(message => {
                    return (
                        <MessageChip key={Math.floor(Math.random() * 100000)} user={message.user} message={message.message} />
                    );
                }) :
                    <div style={{ marginBottom: "auto", marginTop: "auto", textAlign: "center", opacity: 0.5 }}>
                        <h4>No recent chat messages</h4>
                        <IconSearch size={32} />
                    </div>
                }
            </Flex>

            <Box style={{ width: "100%", marginTop: "auto", padding: "0 1em 1em" }}>
                <Flex gap={8} direction="column">
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
                        onKeyDown={(event) => { keyboardSend(event) }}
                    />
                    <Flex direction="row">
                        <Button onClick={sendMessage} size='xs' style={{ marginLeft: "auto" }}>Send</Button>
                    </Flex>
                </Flex>
            </Box>

        </Paper >
    )
}

export default Chat

