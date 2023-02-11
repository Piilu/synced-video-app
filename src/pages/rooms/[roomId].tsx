import { ActionIcon, Button, Center, CopyButton, Drawer, Flex, Tooltip, Transition, useMantineColorScheme } from '@mantine/core';
import { useRouter } from 'next/router'
import type { NextPage } from 'next/types';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import Chat from '../../components/room/Chat';
import type { SendMessage, SendMessageTest, VideoAction } from '../../constants/schema';
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
    const [messages, setMessages] = useState<SendMessageTest[] | []>([]);
    const [socketSend, setSocketSend] = useState<boolean>(true);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const videoTag = useRef<HTMLVideoElement>(null)

    //#region TRPC queries
    //#endregion


    //#region  SOCKET ON
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

        socket.on(Events.LEAVE_ROOM_UPDATE, msg => {
            console.log(msg);
        })

        socket.on(Events.VIDEO_PLAY_UPDATE, msg => {
            console.log(msg);
            setSocketSend(false)
            videoTag.current?.play()
            setSocketSend(false)
            // @ts-ignore
            videoTag.current.currentTime = msg.time
        })
        socket.on(Events.VIDEO_PAUSE_UPDATE, msg => {
            console.log(msg);
            setSocketSend(false)
            videoTag.current?.pause()
            setSocketSend(false)
            // @ts-ignore
            videoTag.current.currentTime = msg.time
        })

        socket.on(Events.VIDEO_SEEK_UPDATE, msg => {
            console.log(msg);
            setSocketSend(false)
            // @ts-ignore
            videoTag.current.currentTime = msg.time
        })

        return () => {
            socket.off(Events.SEND_MESSAGE_UPDATE);
            socket.off(Events.JOIN_ROOM_UPDATE);
            socket.off(Events.LEAVE_ROOM_UPDATE);
            socket.off(Events.VIDEO_PLAY_UPDATE);
            socket.off(Events.VIDEO_PAUSE_UPDATE);
            socket.off(Events.VIDEO_SEEK_UPDATE);
        };
    }, [])
    //#endregion

    useEffect(() => {
        let data: SendMessageTest;
        if (roomId !== undefined) {
            data = { message: "Test", user: "Rainer", roomId: roomId }
            socket.emit(Events.JOIN_ROOM, data)
        }

    }, [roomId])

    //#region Sending message
    const sendMessageWs = (message: SendMessageTest) => {
        socket.emit(Events.SEND_MESSAGE, message)
        sendMessage(message);
    }

    const sendMessage = (message: SendMessageTest) => {
        if (message.message.trim() == "") return;

        setMessages((currentMsg) => [
            { user: message.user, message: message.message, roomId: roomId }, ...currentMsg
        ]);
    }
    //#endregion

    //#region For video actions

    //!!!!!!!!!!!!Possible loop when user triggers onPlay... for all useres!!!!!!!!! <== Fixed??? maybe :) 
    const videoPlay = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) => {
        const videoData: VideoAction = { roomId: roomId, time: event.currentTarget.currentTime, type: event.type }
        console.log("TESTING SEND PLAY")
        if (socketSend) {
            console.log("SEND PLAY")
            socket.emit(Events.VIDEO_PLAY, videoData)
        }
        setSocketSend(true)
    }

    const videoPause = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) => {
        const videoData: VideoAction = { roomId: roomId, time: event.currentTarget.currentTime, type: event.type }
        console.log("TESTING SEND PAUSE")
        if (socketSend) {
            console.log("SEND PAUSE")
            socket.emit(Events.VIDEO_PAUSE, videoData)
        }
        setSocketSend(true)
    }

    const videoSeek = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) => { //maybe seeking??
        const videoData: VideoAction = { roomId: roomId, time: event.currentTarget.currentTime, type: event.type }
        console.log("TESTING SEND SEEK")
        if (socketSend) {
            console.log("SEND SEEK")
            socket.emit(Events.VIDEO_SEEK, videoData)
        }
        setSocketSend(true)
    }

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
                    <video muted={true} ref={videoTag} onPause={event => { videoPause(event, socketSend) }} onPlay={(event) => { videoPlay(event, socketSend) }} onSeeked={(event) => { videoSeek(event, socketSend) }} src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' width="100%" height="100%" controls />
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