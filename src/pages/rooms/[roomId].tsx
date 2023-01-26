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
    // const [messages, setMessages] = useState<[SendMessageTest]>();
    const [chatOpen, setChatOpen] = useState<string>("flex");
    // const [bgColor, setBgColor] = useState<Color>("#000000");
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    useEffect(() => {
        void socketInitializer()
    }, [])


    const socketInitializer = async () => {
        await fetch('/api/socket/socket')
        socket = io()

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on(Events.SEND_MESSAGE_UPDATE, msg => {
            console.log(msg);
        })
    }

    const sendMessageWs = (message: SendMessageTest) => {
        socket.emit(Events.SEND_MESSAGE, message)
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
                        <Chat styles={styles} chatOpen={chatOpen} sendMessageWs={sendMessageWs} setChatOpen={setChatOpen} messages={[{ message: "test", user: "Rainer" }]} />
                    )}
                </Transition>
            </Flex >
        </>
    );
}

export default Room