import { ActionIcon, Avatar, Button, Card, Center, Container, FileInput, Flex, Grid, Group, Loader, Modal, NativeSelect, Paper, Progress, SimpleGrid, Tabs, Text, Textarea, TextInput, Title } from '@mantine/core';
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals';
import { ConnectedRooms, Room, Session, User, Video } from '@prisma/client';
import { IconCheck, IconDoor, IconEdit, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconUpload, IconX } from '@tabler/icons';
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { ReactElement, RefAttributes, useEffect, useRef, useState } from 'react';
import NoItems from '../../components/custom/NoItems';
import RoomItem from '../../components/profile/RoomItem';
import VideoItem from '../../components/profile/VideoItem';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { prisma } from "../../server/db/client"
import { useRouter } from 'next/router';
import ProfileSettignsModal from '../../components/profile/ProfileSettignsModal';
import UploadVideoModal from '../../components/profile/UploadVideoModal';
import CreateRoomModal from '../../components/profile/CreateRoomModal';
import { useAutoAnimate } from "@formkit/auto-animate/react"
import ProgressBar from '../../components/custom/ProgressBar';
import axios, { AxiosRequestConfig } from 'axios';
import { VideoReq, VideoRes } from '../api/video';
import { EndPoints } from '../../constants/GlobalEnums';
import { showNotification } from '@mantine/notifications';
import Head from "next/head"
import Search from '../../components/custom/Search';
import SmallStatsCard from '../../components/custom/SmallStatsCard';
import { RoomReq, RoomRes } from '../api/room';
import { useIntersection } from '@mantine/hooks';
import InfiniteScroll from 'react-infinite-scroller';

export const getServerSideProps: GetServerSideProps = async (ctx) =>
{
    const getProfileName = ctx.params?.name;
    const session = await getServerAuthSession(ctx);
    const profileUser = getProfileName !== null ? await prisma.user.findFirst({
        include: {
            rooms: { take: 10, include: { ConnectedRooms: { include: { user: true } } } },
            videos: { take: 10 }
        },
        where: {
            name: getProfileName as string
        },
    }) : null;

    let videoCount = 0;

    let roomCount = 0;

    const isUsersProfile = session?.user?.id == profileUser?.id ? true : false;

    if (isUsersProfile)
    {
        videoCount = await prisma.video.count({
            where: {
                userId: profileUser?.id as string,
            }
        })

        roomCount = await prisma.room.count({
            where: {
                userId: profileUser?.id as string,
            }
        })
    }
    else
    {
        videoCount = await prisma.video.count({
            where: {
                userId: profileUser?.id as string,
                isPublic: true,
            }
        })

        roomCount = await prisma.room.count({
            where: {
                userId: profileUser?.id as string,
                isPublic: true,
            }
        })
    }

    if (profileUser === null)
    {
        return {
            notFound: true
        }
    }

    if (!isUsersProfile)
    {
        profileUser.rooms = profileUser.rooms.filter(room => { return room.isPublic })
        profileUser.videos = profileUser.videos.filter(video => { return video.isPublic })
    }

    return { props: { profileUser, session, isUsersProfile, videoCount, roomCount } }
};

type ProfileProps = {
    profileUser: (User & {
        rooms: (Room & {
            ConnectedRooms: (ConnectedRooms & {
                user: User;
            })[];
        })[];
        videos: Video[];
    }) | null
    isUsersProfile: boolean;
    videoCount: number,
    roomCount: number,
}

const Profile: NextPage<ProfileProps> = (props) =>
{
    const { data: session } = useSession();
    const { profileUser, isUsersProfile, videoCount, roomCount } = props
    const [name, setName] = useState<string>();
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const [uploadVideo, setUploadVideo] = useState<boolean>(false);
    const [createRoom, setCreateRoom] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [videos, setVideos] = useState<Video[] | undefined>(profileUser?.videos)
    const [rooms, setRooms] = useState<(Room & { ConnectedRooms: (ConnectedRooms & { user: User; })[]; })[] | undefined | undefined>(profileUser?.rooms)
    const [animationParent] = useAutoAnimate()
    const router = useRouter();

    useEffect(() =>
    {
        setRooms(profileUser?.rooms)
        setVideos(profileUser?.videos)
    }, [profileUser])

    const handleUploadVideo = async (file: File, data: VideoReq) =>
    {
        await axios.post(`${window.origin}${EndPoints.VIDEO}`, data).then(res =>
        {
            let newData = res.data as VideoRes;

            if (newData.success)
            {
                router.push({
                    pathname: router.asPath,
                }, undefined, { scroll: false })
                showNotification({
                    message: "New video uploaded",
                    icon: <IconCheck />,
                    color: "green"
                })
            }
            else
            {
                showNotification({
                    message: newData.errorMessage,
                    icon: <IconX />,
                    color: "red"
                })
            }
        }).catch(err =>
        {
            showNotification({
                message: err.message,
                icon: <IconX />,
                color: "red"
            })
        })

        setUploadVideo(false);
        const dataFile = new FormData();
        dataFile.append('file', file);
        const config: AxiosRequestConfig = {
            onUploadProgress: function (progressEvent)
            {
                const precentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(precentComplete)
            }
        }
        await axios.post(`${window.origin}${EndPoints.VIDEO_STREAM}`, dataFile, config)
            .then(res =>
            {
                showNotification({
                    title: "Uploaded",
                    message: res.data.message,
                    icon: <IconCheck />,
                    color: 'green'
                })
            }).catch(err =>
            {
                showNotification({
                    title: "Failed",
                    message: err.message,
                    icon: <IconX />,
                    color: 'red'
                })
            })
    }

    const searchVideos = async (value: string) =>
    {
        let data: RoomReq =
        {
            userId: profileUser?.id,
            isPublic: session?.user?.id == profileUser?.id, //Security problem in api 
            name: value,
            useSearch: true,

        }
        await axios.get(`${window.origin}${EndPoints.VIDEO}`, { params: data }).then(res =>
        {
            let newData = res.data as VideoRes;
            setVideos(newData.videos)

        }).catch(err =>
        {
            console.log(err.message)
        })
    }

    const searchRooms = async (value: string) =>
    {
        let data: RoomReq =
        {
            userId: profileUser?.id,
            isPublic: session?.user?.id == profileUser?.id, //Security problem in api 
            name: value,
            useSearch: true,
        }
        await axios.get(`${window.origin}${EndPoints.ROOM}`, { params: data }).then(res =>
        {
            let newData = res.data as RoomRes;
            setRooms(newData.rooms)
        }).catch(err =>
        {
            console.log(err.message)
        })
    }

    const searchNextRoom = () =>
    {
        console.log("Load Rooms")
    }

    const searchNextVideos = async () =>
    {
        if (videos === undefined) return;

        console.log(Math.max(...videos.map(video => video.id)),)
        let data: VideoReq = {
            cursor: Math.max(...videos.map(video => video.id)),
            userId: profileUser?.id,
            isPublic: true, //doesn't matter
            name: "",//doesn't matter
            location: "sasd",//doesn't matter
            size: 1111//doesn't matter
        }

        await axios.get(`${window.origin}${EndPoints.VIDEO}`, { params: data }).then(res =>
        {
            const newData = res.data as VideoRes;
            if (newData.success)
            {
                console.log(newData.videos)
                setVideos((prevVideos) => [
                    ...prevVideos, ...newData.videos
                ])
            }
        }).catch(err =>
        {
            showNotification(
                {
                    title: "Error",
                    message: err.message,
                }
            )
        })
        console.log("Videos list Count:" + videos.length)
        console.log("Videos all Count:" + videoCount)
    }
    return (
        <>
            <Head>
                <title>Profile - {profileUser?.name}</title>
            </Head>
            <ProfileSettignsModal profileUser={profileUser} editProfile={editProfile} setEditProfile={setEditProfile} />
            <UploadVideoModal handleUploadVideo={handleUploadVideo} profileUser={profileUser} uploadVideo={uploadVideo} setUploadVideo={setUploadVideo} />
            <CreateRoomModal createRoom={createRoom} setCreateRoom={setCreateRoom} />
            <Container>
                <Flex direction="column">
                    <Paper shadow="sm" radius="lg" mt="lg" p="sm" style={{ position: "relative" }} >
                        <Group style={{ position: "absolute", right: 10 }}>
                            {isUsersProfile ?
                                <ActionIcon onClick={() => { setEditProfile(true) }} size="md" radius="lg">
                                    <IconEdit size={19} />
                                </ActionIcon>
                                : null}
                        </Group>
                        <Group position='center' p="lg">
                            <Flex gap={4} align="center" direction={"column"}>
                                <Flex w="100%" justify="center" gap={20}>
                                    <SmallStatsCard label='Videos' value={videoCount} />
                                    <Avatar component='a' href='' radius={120} size={120} src={profileUser?.image} />
                                    <SmallStatsCard label='Rooms' value={roomCount} />
                                </Flex>
                                <h4 style={{ margin: 0 }}>{profileUser?.name}</h4>
                                <small>{profileUser?.email}</small>
                                <small style={{ minWidth: "50%", textAlign: "center" }}>{profileUser?.bio}</small>
                            </Flex>
                        </Group>
                    </Paper>

                    <Tabs defaultValue="videos">
                        <Paper shadow="sm" radius="lg" mt="lg" p="sm" >
                            <Tabs.List grow={true}>
                                <Tabs.Tab value="videos" icon={<IconPhoto size={14} />}>Videos</Tabs.Tab>
                                <Tabs.Tab value="rooms" icon={<IconMessageCircle size={14} />}>Rooms</Tabs.Tab>
                                <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>Settings</Tabs.Tab>
                            </Tabs.List>
                        </Paper>

                        <Tabs.Panel value="videos" pt="xs">
                            <ProgressBar progress={progress} setProgress={setProgress} />
                            <Flex direction="row" wrap="nowrap" justify="space-between">
                                <Search getSearchData={searchVideos} />
                                {isUsersProfile ?
                                    <Group position='right' my={10}>
                                        <Button color="teal" onClick={() => { setUploadVideo(true) }} size='xs' radius="md" leftIcon={<IconUpload size={18} />}>Upload video</Button>
                                    </Group>
                                    : null}
                            </Flex>

                            <InfiniteScroll
                                threshold={300}
                                loadMore={searchNextVideos}
                                hasMore={videos?.length !== videoCount}
                                loader={<Group key={0} mb={10} position='center'><Loader variant="dots" ></Loader></Group>}
                            >
                                <Flex direction="column" gap={20} mb={35} ref={animationParent}>

                                    {videos?.length != 0 ? videos?.map(video =>
                                    {
                                        return (
                                            <VideoItem video={video} key={video.id} isUsersProfile={isUsersProfile} />
                                        )

                                    }) : <NoItems text='No videos' />}
                                </Flex>
                            </InfiniteScroll>

                        </Tabs.Panel>

                        <Tabs.Panel value="rooms" pt="xs">
                            <Flex direction="row" wrap="nowrap" justify="space-between">
                                <Search getSearchData={searchRooms} />
                                {isUsersProfile ?
                                    <Group position='right' my={10}>
                                        <Button color="teal" onClick={() => setCreateRoom(true)} size='xs' radius="md" leftIcon={<IconDoor size={18} />}>Create a new room</Button>
                                    </Group>
                                    : null}
                            </Flex>
                            <Grid gutter="md" ref={animationParent}>
                                {rooms?.length != 0 ? rooms?.map(room =>
                                {
                                    return (
                                        <Grid.Col key={room.id} md={6} lg={4}>
                                            <RoomItem isUsersProfile={isUsersProfile} createdTime={room.createdAt} room={room} />
                                        </Grid.Col>
                                    )
                                }) : <Grid.Col><NoItems text={`${isUsersProfile ? "You have no rooms" : `${profileUser?.name} have no rooms`}`} /></Grid.Col>}
                            </Grid>
                        </Tabs.Panel>

                        <Tabs.Panel value="settings" pt="xs">
                            <Center style={{ height: "100%" }}>
                                <NoItems text="Settings tab content" />
                            </Center>
                        </Tabs.Panel>
                    </Tabs>
                </Flex>

            </Container>
        </>
    )
}

export default Profile