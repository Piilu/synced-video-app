import { ActionIcon, Avatar, Button, Center, Container, FileInput, Flex, Grid, Group, Modal, NativeSelect, Paper, Progress, SimpleGrid, Tabs, Text, Textarea, TextInput } from '@mantine/core';
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals';
import { Room, Session, User, Video } from '@prisma/client';
import { IconCheck, IconDoor, IconEdit, IconMessageCircle, IconPhoto, IconSettings, IconUpload, IconX } from '@tabler/icons';
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { ReactElement, RefAttributes, useRef, useState } from 'react';
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
export const getServerSideProps: GetServerSideProps = async (ctx) =>
{
    const getProfileName = ctx.params?.name;
    const session = await getServerAuthSession(ctx);
    const profileUser = getProfileName !== null ? await prisma.user.findFirst({
        include: {
            rooms: true,
            videos: true,
        },
        where: {
            name: getProfileName as string
        }
    }) : null;

    const isUsersProfile = session?.user?.id == profileUser?.id ? true : false;

    if (profileUser === null)
    {
        return {
            notFound: true
        }
    }
    profileUser.emailVerified = null //Fix date  serializing  issue here. Nextjs thing
    console.log(profileUser)
    return { props: { profileUser, session, isUsersProfile } }
};

type ProfileProps = {
    profileUser: (User & {
        videos: Video[];
        rooms: Room[];
    }) | null;
    isUsersProfile: boolean;
}

const Profile: NextPage<ProfileProps> = (props) =>
{
    const { data: session } = useSession();
    const { profileUser, isUsersProfile } = props
    const [name, setName] = useState<string>();
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const [uploadVideo, setUploadVideo] = useState<boolean>(false);
    const [createRoom, setCreateRoom] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [animationParent] = useAutoAnimate()
    const router = useRouter();
    const handleUploadVideo = async () =>
    {
        setUploadVideo(false);

        console.log("UPLOADING")
    }
    return (
        <>
            <ProfileSettignsModal profileUser={profileUser} editProfile={editProfile} setEditProfile={setEditProfile} />
            <UploadVideoModal handleUploadVideo={handleUploadVideo} profileUser={profileUser} uploadVideo={uploadVideo} setUploadVideo={setUploadVideo} />
            <CreateRoomModal createRoom={createRoom} setCreateRoom={setCreateRoom} />
            <Container>
                <Flex direction="column">
                    <Paper shadow="sm" radius="lg" mt="lg" p="sm" >
                        <Group position="right">
                            {isUsersProfile ?
                                <ActionIcon onClick={() => { setEditProfile(true) }} size="md" radius="lg">
                                    <IconEdit size={19} />
                                </ActionIcon>
                                : null}
                        </Group>
                        <Group position='center' p="lg">
                            <Flex gap={3} align="center" direction={"column"}>
                                <Avatar component='a' href='#' radius="xl" size="xl" src={profileUser?.image} />
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
                            {isUsersProfile ?
                                <Group position='right' my={10}>
                                    <Button color="teal" onClick={() => { setUploadVideo(true) }} size='xs' radius="md" leftIcon={<IconUpload size={18} />}>Upload video</Button>
                                </Group>
                                : null}
                            <Flex direction="column" gap={20} mb={35}>
                                {profileUser?.videos?.length != 0 ? profileUser?.videos.map(video =>
                                {
                                    return (
                                        <VideoItem key={video.id} isUsersProfile={isUsersProfile} />
                                    )

                                }) : <NoItems text='No videos' />}
                            </Flex>
                        </Tabs.Panel>

                        <Tabs.Panel value="rooms" pt="xs">
                            {isUsersProfile ?
                                <Group position='right' my={10}>
                                    <Button color="teal" onClick={() => setCreateRoom(true)} size='xs' radius="md" leftIcon={<IconDoor size={18} />}>Create a new room</Button>
                                </Group>
                                : null}
                            <Grid gutter="md" ref={animationParent}>
                                {profileUser?.rooms?.length != 0 ? profileUser?.rooms.map(room =>
                                {
                                    return (
                                        <Grid.Col key={room.id} md={6} lg={4}>
                                            <RoomItem key={room.id} isUsersProfile={isUsersProfile} createdTime={room.createdAt.toDateString()} room={room} />
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