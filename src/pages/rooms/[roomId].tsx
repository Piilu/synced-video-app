import { ActionIcon, Button, Center, Container, CopyButton, Drawer, Flex, Group, Tooltip, Transition, useMantineColorScheme } from '@mantine/core';
import { useRouter } from 'next/router'
import type { GetServerSideProps, NextPage } from 'next/types';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import Chat from '../../components/room/Chat';
import type { SendMessage, SendMessageTest, VideoAction } from '../../constants/schema';
import { IconCheck, IconLink, IconMessageCircle, IconSettings } from '@tabler/icons'
import { slideLeft } from '../../styles/transitions';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client'
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { Events, QueryParams } from '../../constants/events';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { useSession } from 'next-auth/react';
import { useLocalStorage } from '@mantine/hooks';
import FloatingButtons from '../../components/room/FloatingButtons';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    if (session) {

        return {
            props: { session },
        };
    }
    return {

        redirect: {
            permanent: false,
            destination: `/rooms/guest?${QueryParams.RETURN_URL}=${ctx.resolvedUrl}`,
        },
    }
};

const Room: NextPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const roomId = router.query.roomId as string;
    const [chatOpen, setChatOpen] = useState<"flex" | "none">("flex");
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<SendMessageTest[] | []>([]);
    const [socketSend, setSocketSend] = useState<boolean>(true);
    const [guest, setGuest] = useLocalStorage({ key: 'guest', defaultValue: null });
    const videoTag = useRef<HTMLVideoElement>(null)

    //#region  SOCKET ON
    useEffect(() => {
        void fetch('/api/socket/socket')
        socket = io()

        socket.on(Events.JOIN_ROOM_UPDATE, data => {
            console.log('connected ' + data.user + " " + data.roomId)
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
            videoTag.current.currentTime = msg.time
        })
        socket.on(Events.VIDEO_PAUSE_UPDATE, msg => {
            console.log(msg);
            setSocketSend(false)
            videoTag.current?.pause()
            setSocketSend(false)
            videoTag.current.currentTime = msg.time
        })

        socket.on(Events.VIDEO_SEEK_UPDATE, msg => {
            console.log(msg);
            setSocketSend(false)
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
        if (roomId !== undefined && session?.user !== undefined) {
            data = { message: "Test", user: session.user.name as string, roomId: roomId }
            socket.emit(Events.JOIN_ROOM, data)
        }
        else if (roomId !== undefined && session?.user === undefined && guest !== null) {
            data = { message: "Test", user: guest, roomId: roomId }
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
                <Center style={{ width: "100%", height: "100%", position: "relative" }}>
                    <video muted={true} ref={videoTag} onPause={event => { videoPause(event, socketSend) }} onPlay={(event) => { videoPlay(event, socketSend) }} onSeeked={(event) => { videoSeek(event, socketSend) }} src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' width="100%" height="100%" controls />
                    <FloatingButtons setSettingsOpen={setSettingsOpen} settingsOpen={settingsOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
                </Center>
                <Transition mounted={chatOpen === "flex"} transition={slideLeft} duration={200} timingFunction="ease">
                    {(styles) => (
                        //@ts-ignore
                        <Chat user={session?.user} roomId={roomId} styles={styles} chatOpen={chatOpen} sendMessageWs={sendMessageWs} setChatOpen={setChatOpen} messages={messages} />
                        //Fix user type :)
                    )}
                </Transition>
            </Flex >
        </>
    );
}

export default Room