import { ActionIcon, Button, Center, Container, CopyButton, Drawer, Flex, Group, Textarea, TextInput, Tooltip, Transition, useMantineColorScheme } from '@mantine/core';
import { useRouter } from 'next/router'
import type { GetServerSideProps, NextPage } from 'next/types';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import Chat from '../../components/room/Chat';
import { IconCheck, IconLink, IconMessageCircle, IconRefresh, IconSettings } from '@tabler/icons'
import { slideLeft } from '../../styles/transitions';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client'
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { EndPoints, Events, QueryParams } from '../../constants/GlobalEnums';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { useSession } from 'next-auth/react';
import { useLocalStorage, usePageLeave, useWindowEvent } from '@mantine/hooks';
import FloatingButtons from '../../components/room/FloatingButtons';
import { RoomData, RoomMessage, VideoAction } from '../../constants/schema';
import { Prisma, ConnectedRooms, User, Video, Room } from '@prisma/client';
import Link from 'next/link';
import handler from '../api/rooms';
import Head from 'next/head';
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const getServerSideProps: GetServerSideProps = async (ctx) =>
{
    const session = await getServerAuthSession(ctx);
    const roomId = ctx.query.roomId as string;
    if (roomId == "" || roomId == null)
    {
        return { props: { notFound: true } }
    }
    if (!session)
    {
        return {

            redirect: {
                permanent: false,
                destination: `/rooms/guest?${QueryParams.RETURN_URL}=${ctx.resolvedUrl}`,
            },
        }
    }
    const roomInitialData = await prisma?.room.findFirst({
        where: {
            id: roomId,
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

    console.log("---------------------------------------")
    console.log(roomInitialData);
    console.log("---------------------------------------")
    if (roomInitialData === null || roomInitialData === undefined)
    {
        return { props: { notFound: true } }
    }

    if (roomInitialData?.ConnectedRooms.filter(connection => { return connection.userId == user?.id && connection.roomId == roomId }).length != 0)
    {
        return { props: { multipleUsers: true } }
    }

    if (session)
    {
        return {
            props: { session, roomInitialData: roomInitialData, user },
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
    roomInitialData: RoomData,
    user: User,
    multipleUsers?: boolean,
    notFound?: boolean,
}

const RoomTest: NextPage<RoomProps> = (props) =>
{
    const { roomInitialData, user, multipleUsers, notFound } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const [chatOpen, setChatOpen] = useState<"flex" | "none">("flex");
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<RoomMessage[] | []>([]);
    const [socketSend, setSocketSend] = useState<boolean>(true);
    const [roomData, setRoomData] = useState<RoomData>();
    const [guest, setGuest] = useLocalStorage({ key: 'guest', defaultValue: null });
    const videoTag = useRef<HTMLVideoElement>(null)

    //#region  SOCKET ON
    if (notFound)
    {
        return (
            <>
                <Head>
                    <title>Room not found</title>
                </Head>
                <Center style={{ height: "100%" }}>
                    <Flex direction="column" align="center">
                        <Group>
                            <h2>Room '{router.query.roomId}' doesn't exist</h2>
                        </Group>
                        <Group>
                            <Link href={`/profile/${session?.user?.name}`} > Go to profile</Link>
                        </Group>
                    </Flex>
                </Center>
            </>
        )
    }
    if (multipleUsers)
    {
        return (
            <>
                <Head>
                    <title>Multiple users</title>
                </Head>
                <Center style={{ height: "100%" }}>
                    <Flex direction="column" align="center">
                        <Group>
                            <h2>User already exists</h2>
                        </Group>
                        <Group>
                            <Button leftIcon={<IconRefresh />} onClick={() => router.reload()}>Click here to refresh</Button>
                        </Group>
                    </Flex>
                </Center>
            </>
        )
    }
    useEffect(() =>
    {
        void fetch('/api/socket/socket')
        socket = io()

        // socket.on("connect", () => {
        //     console.log("Connect test 123")
        // })
        socket.on(Events.JOIN_ROOM_UPDATE, (data: RoomMessage) =>
        {
            console.log('connected ' + data.user?.name + " " + data.roomId)
            sendMessage(data)
        })

        socket.on(Events.DISSCONNECT, (msg) =>
        {
            console.log('disconnected ' + msg)
        })

        socket.on(Events.SEND_MESSAGE_UPDATE, (data: RoomMessage) =>
        {
            console.log(data);
            sendMessage(data)
        })

        socket.on(Events.LEAVE_ROOM_UPDATE, (data: RoomMessage) =>
        {
            console.log(`${data.user?.name} left the room`);
            data.message = `${data.user?.name} left the room`;
            sendMessage(data);
        })

        socket.on(Events.VIDEO_PLAY_UPDATE, (data: VideoAction) =>
        {
            setSocketSend(false)
            videoTag.current?.play()
            setSocketSend(false)
            videoTag.current.currentTime = data.time
        })
        socket.on(Events.VIDEO_PAUSE_UPDATE, (data: VideoAction) =>
        {
            setSocketSend(false)
            videoTag.current?.pause()
            setSocketSend(false)
            videoTag.current.currentTime = data.time
        })

        socket.on(Events.VIDEO_SEEK_UPDATE, (data: VideoAction) =>
        {
            setSocketSend(false)
            videoTag.current.currentTime = data.time
        })

        socket.on(Events.GET_ROOM_DATA_UPDATE, (data: RoomData) =>
        {
            console.log("______________________________");
            console.log("GET ROOM DATA UPDATE");
            console.log(data);
            setRoomData(data);
        })

        return () =>
        {
            socket.off(Events.SEND_MESSAGE_UPDATE);
            socket.off(Events.JOIN_ROOM_UPDATE);
            socket.off(Events.LEAVE_ROOM_UPDATE);
            socket.off(Events.VIDEO_PLAY_UPDATE);
            socket.off(Events.VIDEO_PAUSE_UPDATE);
            socket.off(Events.VIDEO_SEEK_UPDATE);
            socket.off(Events.GET_ROOM_DATA_UPDATE);
        };
    }, [])
    //#endregion

    useEffect(() =>
    {
        joinRoom();

    }, [])

    //#region Route change
    useEffect(() =>
    {
        const handleRouteChange = (url: string) =>
        {
            socket.emit(Events.LEAVE_ROOM)
        }

        router.events.on('routeChangeStart', handleRouteChange)

        return () =>
        {
            router.events.off('routeChangeStart', handleRouteChange)
        }
    }, [])
    //#endregion

    const joinRoom = () =>
    {
        let data: RoomMessage;
        data = { message: `${user.name} joined the room`, user: user, roomId: roomInitialData?.id }
        socket.emit(Events.JOIN_ROOM, data)
    }

    //#region Sending message
    const sendMessageWs = (message: RoomMessage) =>
    {
        console.log(message)
        socket.emit(Events.SEND_MESSAGE, message)
        sendMessage(message);
    }

    const sendMessage = (message: RoomMessage) =>
    {
        if (message.message.trim() == "") return;
        //@ts-ignore
        setMessages((prevMessages) => [
            { roomId: message.roomId, user: message.user, message: message.message }, ...prevMessages
        ])
        // setMessages((currentMsg) => [
        //     { roomId: roomInitialData?.id, user: session, message: message }, ...currentMsg
        // ]);
    }
    //#endregion

    //#region For video actions

    //!!!!!!!!!!!!Possible loop when user triggers onPlay... for all useres!!!!!!!!! <== Fixed??? maybe :) 
    const videoPlay = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) =>
    {
        const videoData: VideoAction = { user: user, roomId: roomInitialData?.id, time: event.currentTarget.currentTime, type: event.type }
        if (socketSend)
        {
            console.log(videoData);
            socket.emit(Events.VIDEO_PLAY, videoData)
        }
        setSocketSend(true)
    }

    const videoPause = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) =>
    {
        const videoData: VideoAction = { user: user, roomId: roomInitialData?.id, time: event.currentTarget.currentTime, type: event.type }
        if (socketSend)
        {
            console.log(videoData);
            socket.emit(Events.VIDEO_PAUSE, videoData)
        }
        setSocketSend(true)
    }

    const videoSeek = (event: SyntheticEvent<HTMLVideoElement, Event>, send: Boolean) =>
    {
        const videoData: VideoAction = { user: user, roomId: roomInitialData?.id, time: event.currentTarget.currentTime, type: event.type }
        if (socketSend)
        {
            console.log(videoData);
            socket.emit(Events.VIDEO_SEEK, videoData)
        }
        setSocketSend(true)
    }

    //#endregion

    return (
        <>
            <Head>
                <title>Room - {roomData?.name}</title>
            </Head>
            <Drawer
                position='top'
                opened={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                title="Settings"
                padding="xl"
                size="md"
            >
                <Flex direction="column" gap={20}>
                    <Group grow>
                        {/* <TextInput title="Email cant't be changed" withAsterisk label="Email:" readOnly placeholder="Your email" />
                        <TextInput withAsterisk label="Username:" placeholder="Your name" /> */}
                    </Group>
                    <TextInput label="Current video" defaultValue={roomData?.video?.location} placeholder="http//:..." />
                </Flex>

            </Drawer>

            <Flex style={{ backgroundColor: "black", width: "100%", height: "100%" }} direction="row" justify={"flex-end"}>
                <Center style={{ width: "100%", height: "100%", position: "relative" }}>
                    <video muted={true} ref={videoTag} onPause={event => { videoPause(event, socketSend) }} onPlay={(event) => { videoPlay(event, socketSend) }} onSeeked={(event) => { videoSeek(event, socketSend) }} src={roomData?.video?.location} width="100%" height="100%" controls />
                    <FloatingButtons setSettingsOpen={setSettingsOpen} settingsOpen={settingsOpen} chatOpen={chatOpen} setChatOpen={setChatOpen} />
                </Center>
                <Transition mounted={chatOpen === "flex"} transition={slideLeft} duration={200} timingFunction="ease">
                    {(styles) => (
                        <Chat roomData={roomData} user={user} roomId={roomInitialData?.id} styles={styles} chatOpen={chatOpen} sendMessageWs={sendMessageWs} setChatOpen={setChatOpen} messages={messages} />
                    )}
                </Transition>
            </Flex >
        </>
    );
}

export default RoomTest