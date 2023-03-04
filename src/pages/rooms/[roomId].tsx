import { ActionIcon, Button, Center, Container, CopyButton, Drawer, Flex, Group, Tooltip, Transition, useMantineColorScheme } from '@mantine/core';
import { useRouter } from 'next/router'
import type { GetServerSideProps, NextPage } from 'next/types';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import Chat from '../../components/room/Chat';
import { IconCheck, IconLink, IconMessageCircle, IconSettings } from '@tabler/icons'
import { slideLeft } from '../../styles/transitions';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client'
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { Events, QueryParams } from '../../constants/GlobalEnums';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { useSession } from 'next-auth/react';
import { useLocalStorage } from '@mantine/hooks';
import FloatingButtons from '../../components/room/FloatingButtons';
import { RoomMessage, VideoAction } from '../../constants/schema';
import { Prisma, ConnectedRooms, User, Video, Room } from '@prisma/client';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);
    const roomId = ctx.query.roomId as string;
    const roomIdNumber = parseInt(roomId);
    //If roomId is string
    const roomData = await prisma?.room.findFirst({
        where: {
            id: roomIdNumber,
        },
        include: {
            ConnectedRooms: true,
            user: true,
            video: true,
        },
    })
    const user = await prisma?.user.findUnique({
        where: {
            id: session?.user?.id
        }
    })
    if (session) {
        return {
            props: { session, roomData, user },
        };
    }
    return {

        redirect: {
            permanent: false,
            destination: `/rooms/guest?${QueryParams.RETURN_URL}=${ctx.resolvedUrl}`,
        },
    }
};

type RoomProps = {
    roomData: (Room & {
        ConnectedRooms: ConnectedRooms[];
        user: User;
        video: Video | null;
    }) | null | undefined;
    user: User,
}

const RoomTest: NextPage<RoomProps> = (props) => {
    const { roomData, user } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const [chatOpen, setChatOpen] = useState<"flex" | "none">("flex");
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<RoomMessage[] | []>([]);
    const [socketSend, setSocketSend] = useState<boolean>(true);
    const [guest, setGuest] = useLocalStorage({ key: 'guest', defaultValue: null });
    const videoTag = useRef<HTMLVideoElement>(null)

    //#region  SOCKET ON
    useEffect(() => {
        void fetch('/api/socket/socket')
        socket = io()

        socket.on("connect", () => {
            console.log("Connect test 123")
        })
        socket.on(Events.JOIN_ROOM_UPDATE, (data: RoomMessage) => {
            console.log('connected ' + data.user?.name + " " + data.roomId)
        })

        socket.on(Events.DISSCONNECT, (msg) => {
            console.log('disconnected ' + msg)
        })

        socket.on(Events.SEND_MESSAGE_UPDATE, (data: RoomMessage) => {
            console.log(data);
            sendMessage(data)
        })

        socket.on(Events.LEAVE_ROOM_UPDATE, (data: RoomMessage) => {
            console.log(`${data.user?.name} left the room`);
        })

        socket.on(Events.VIDEO_PLAY_UPDATE, (data: VideoAction) => {
            console.log(data);
            setSocketSend(false)
            videoTag.current?.play()
            setSocketSend(false)
            videoTag.current.currentTime = data.time
        })
        socket.on(Events.VIDEO_PAUSE_UPDATE, (data: VideoAction) => {
            console.log(data);
            setSocketSend(false)
            videoTag.current?.pause()
            setSocketSend(false)
            videoTag.current.currentTime = data.time
        })

        socket.on(Events.VIDEO_SEEK_UPDATE, (data: VideoAction) => {
            console.log(data);
            setSocketSend(false)
            videoTag.current.currentTime = data.time
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
        let data: RoomMessage;
        if (roomData?.id !== null && session?.user !== undefined) {
            data = { message: "Test", user: user, roomId: roomData?.id }
            socket.emit(Events.JOIN_ROOM, data)
        }
        else if (roomData?.id !== undefined && session?.user === undefined && guest !== null) {

            alert("For testing it's not working");
        }
        return () => {
            socket.off(Events.JOIN_ROOM)
        }
    }, [])

    //#region Sending message
    const sendMessageWs = (message: RoomMessage) => {
        console.log(message)
        socket.emit(Events.SEND_MESSAGE, message)
        sendMessage(message);
    }

    const sendMessage = (message: RoomMessage) => {
        if (message.message.trim() == "") return;
        //@ts-ignore
        setMessages((prevMessages) => [
            { roomId: message.roomId, user: message.user, message: message.message }, ...prevMessages
        ])
        // setMessages((currentMsg) => [
        //     { roomId: roomData?.id, user: session, message: message }, ...currentMsg
        // ]);
    }
    //#endregion

    //#region For video actions

    //!!!!!!!!!!!!Possible loop when user triggers onPlay... for all useres!!!!!!!!! <== Fixed??? maybe :) 
    const videoPlay = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) => {
        const videoData: VideoAction = { roomId: roomData?.id, time: event.currentTarget.currentTime, type: event.type }
        console.log("TESTING SEND PLAY")
        if (socketSend) {
            console.log("SEND PLAY")
            socket.emit(Events.VIDEO_PLAY, videoData)
        }
        setSocketSend(true)
    }

    const videoPause = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) => {
        const videoData: VideoAction = { roomId: roomData?.id, time: event.currentTarget.currentTime, type: event.type }
        console.log("TESTING SEND PAUSE")
        if (socketSend) {
            console.log("SEND PAUSE")
            socket.emit(Events.VIDEO_PAUSE, videoData)
        }
        setSocketSend(true)
    }

    const videoSeek = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) => { //maybe seeking??
        const videoData: VideoAction = { roomId: roomData?.id, time: event.currentTarget.currentTime, type: event.type }
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
                <h4>Conetn in here {roomData?.ConnectedRooms.length}</h4>
            </Drawer>

            <Flex style={{ backgroundColor: "black", width: "100%", height: "100%" }} direction="row" justify={"flex-end"}>
                <Center style={{ width: "100%", height: "100%", position: "relative" }}>
                    <video muted={true} ref={videoTag} onPause={event => { videoPause(event, socketSend) }} onPlay={(event) => { videoPlay(event, socketSend) }} onSeeked={(event) => { videoSeek(event, socketSend) }} src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' width="100%" height="100%" controls />
                    <FloatingButtons setSettingsOpen={setSettingsOpen} settingsOpen={settingsOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
                </Center>
                <Transition mounted={chatOpen === "flex"} transition={slideLeft} duration={200} timingFunction="ease">
                    {(styles) => (
                        <Chat user={user} roomId={roomData?.id} styles={styles} chatOpen={chatOpen} sendMessageWs={sendMessageWs} setChatOpen={setChatOpen} messages={messages} />
                    )}
                </Transition>
            </Flex >
        </>
    );
}

export default RoomTest