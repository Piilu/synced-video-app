import { ActionIcon, Button, Center, CopyButton, Drawer, Flex, Grid, Paper, Tooltip, Transition } from '@mantine/core';
import { useRouter } from 'next/router'
import type { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import Chat from '../../components/room/Chat';
import type { SendMessage, SendMessageTest } from '../../constants/schema';
// import { api } from '../../utils/api';
import { IconCheck, IconLink, IconMessageCircle, IconSettings } from '@tabler/icons'
import { slideLeft } from '../../styles/transitions';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client'
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { Events } from '../../constants/events';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const Room: NextPage = () => {
    const router = useRouter();
    const roomId = router.query.roomId as string;
    const [chatOpen, setChatOpen] = useState<string>("flex");
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<[SendMessageTest] | []>([]);

    useEffect(() => {
        void fetch('/api/socket/socket')
        socket = io()

        socket.on(Events.JOIN_ROOM_UPDATE, data => {
            console.log('connected ' + data.roomId)
        })

        socket.on(Events.SEND_MESSAGE_UPDATE, msg => {
            console.log(msg);
            sendMessage(msg)
        })

        socket.on(Events.LEAVE_ROOM, msg => {
            console.log(msg);
        })
     
        return () => {
            socket.off(Events.SEND_MESSAGE_UPDATE);
            socket.off(Events.JOIN_ROOM_UPDATE);
            socket.off(Events.LEAVE_ROOM_UPDATE);
        };
    }, [])

    useEffect(() => {
        let data: SendMessageTest;
        if (roomId !== undefined) {
            data = { message: "Test", user: "Rainer", roomId: roomId }
            socket.emit(Events.JOIN_ROOM, data)
        }
      
    }, [roomId])

    const sendMessageWs = (message: SendMessageTest) => {
        socket.emit(Events.SEND_MESSAGE, message)
        sendMessage(message);
    }

    const sendMessage = (message: SendMessageTest) => {
        if (message.message.trim() == "") return;

        // const prevMessages = messages;
        // prevMessages?.unshift({ message: message.message, user: "Rainer", roomId: roomId })
        setMessages((currentMsg) => [
            { user: message.user, message: message.message, roomId: roomId }, ...currentMsg
        ]); // find a way to fix the type safety

        // sendMessageWs({ message: message, user: "Rainer", roomId })
    }
    //#region TRPC queries
    //#endregion


    //#region View functions

    //#endregion    

    return (
        <>
            <Drawer
                position='top'
                opened={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                title="Settings"
                padding="xl"
                size="xl"
            >
                <h4>Conetn in here</h4>
            </Drawer>

            <Flex style={{ backgroundColor: "black", width: "100%", height: "100%" }} direction="row" justify={"flex-end"}>
                <Center style={{ width: "100%", height: "100%" }}>
                    <video src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' width="100%" height="100%" controls />
                </Center>

                {chatOpen != "flex" ?

                    //Maybe make function that adds buttons based on json (different component)
                    <Button.Group orientation="vertical" style={{ position: "absolute", right: 40, top: 40, gap: 2 }}>

                        <Tooltip position='left' label="Open chat">
                            <ActionIcon color="light" size="xl" radius="md" onClick={() => {
                                chatOpen == "flex" ? setChatOpen("none") : setChatOpen("flex"); //function??
                            }}>
                                <IconMessageCircle size={29} />
                            </ActionIcon>
                        </Tooltip>

                        <CopyButton value={window.location.href}>
                            {({ copied, copy }) => (
                                <Tooltip position='left' label={copied ? "Copied" : "Copy room link"}>
                                    <ActionIcon color="light" size="xl" radius="md" onClick={copy}>
                                        {copied ? <IconCheck size={29} /> : <IconLink size={29} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>

                        <Tooltip position='left' label="Settings">
                            <ActionIcon color="light" size="xl" radius="md" onClick={() => { setSettingsOpen(true) }} >
                                <IconSettings size={29} />
                            </ActionIcon>
                        </Tooltip>

                    </Button.Group>
                    : null}
                <Transition mounted={chatOpen === "flex"} transition={slideLeft} duration={200} timingFunction="ease">
                    {(styles) => (
                        <Chat roomId={roomId} styles={styles} chatOpen={chatOpen} sendMessageWs={sendMessageWs} setChatOpen={setChatOpen} messages={messages} />
                    )}
                </Transition>
            </Flex >
        </>
    );
}

export default Room