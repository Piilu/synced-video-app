import { ActionIcon, Avatar, Button, Center, Container, FileInput, Flex, Grid, Group, Modal, NativeSelect, Paper, SimpleGrid, Tabs, Text, Textarea, TextInput } from '@mantine/core';
import { closeAllModals, openConfirmModal, openModal } from '@mantine/modals';
import { Session, User } from '@prisma/client';
import { IconCheck, IconDoor, IconEdit, IconMessageCircle, IconPhoto, IconSettings, IconUpload, IconX } from '@tabler/icons';
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { ReactElement, RefAttributes, useRef, useState } from 'react';
import NoItems from '../../components/custom/NoItems';
import RoomItem from '../../components/profile/RoomItem';
import VideoItem from '../../components/profile/VideoItem';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { prisma } from "../../server/db/client"
import axios from "axios"
import { EndPoints } from '../../constants/GlobalTypes';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { profile } from 'console';
import { UserReqBody, UserResBody } from '../api/profile/user';
import { useRouter } from 'next/router';
import ProfileSettignsModal from '../../components/profile/ProfileSettignsModal';
import UploadVideoModal from '../../components/profile/UploadVideoModal';

export const getServerSideProps: GetServerSideProps = async (ctx) =>
{
    const getProfileName = ctx.params?.name;
    const session = await getServerAuthSession(ctx);

    const profileUser = getProfileName !== null ? await prisma.user.findFirst({
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
    return { props: { profileUser, session, isUsersProfile } }
};

type profileType = {
    profileUser: User;
    isUsersProfile: boolean;
}

const Profile: NextPage<profileType> = (props) =>
{
    const { data: session } = useSession();
    const { profileUser, isUsersProfile } = props
    const [name, setName] = useState<string>();
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const [uploadVideo, setUploadVideo] = useState<boolean>(false);
    const router = useRouter();

    let testData =
        [
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
            {
                roomName: "Testing",
                picUrl: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
            },
        ]

    return (
        <>
            <ProfileSettignsModal profileUser={profileUser} editProfile={editProfile} setEditProfile={setEditProfile} />
            <UploadVideoModal profileUser={profileUser} uploadVideo={uploadVideo} setUploadVideo={setUploadVideo} />
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
                                <Avatar component='a' href='#' radius="xl" size="xl" src={profileUser.image} />
                                <h4 style={{ margin: 0 }}>{profileUser.name}</h4>
                                <small>{profileUser.email}</small>
                                <small style={{ minWidth: "50%", textAlign: "center" }}>{profileUser.bio}</small>
                            </Flex>
                        </Group>
                    </Paper>

                    <Tabs defaultValue="rooms">
                        <Paper shadow="sm" radius="lg" mt="lg" p="sm" >
                            <Tabs.List grow={true}>
                                <Tabs.Tab value="videos" icon={<IconPhoto size={14} />}>Videos</Tabs.Tab>
                                <Tabs.Tab value="rooms" icon={<IconMessageCircle size={14} />}>Rooms</Tabs.Tab>
                                <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>Settings</Tabs.Tab>
                            </Tabs.List>
                        </Paper>


                        <Tabs.Panel value="videos" pt="xs">
                            {isUsersProfile ?
                                <Group position='right' my={10}>
                                    <Button color="teal" onClick={() => { setUploadVideo(true) }} size='xs' radius="md" leftIcon={<IconUpload size={18} />}>Upload video</Button>
                                </Group>
                                : null}
                            <Flex direction="column" gap={20} mb={35}>
                                <VideoItem isUsersProfile={isUsersProfile} />
                                <VideoItem isUsersProfile={isUsersProfile} />
                                <VideoItem isUsersProfile={isUsersProfile} />
                                <VideoItem isUsersProfile={isUsersProfile} />
                                <VideoItem isUsersProfile={isUsersProfile} />
                            </Flex>
                        </Tabs.Panel>

                        <Tabs.Panel value="rooms" pt="xs">
                            {isUsersProfile ?
                                <Group position='right' my={10}>
                                    <Button color="teal" onClick={() => console.log("Testing")} size='xs' radius="md" leftIcon={<IconDoor size={18} />}>Create a new room</Button>
                                </Group>
                                : null}
                            <Grid gutter="md">
                                {testData.length != 0 ? testData.map(room =>
                                {
                                    return (
                                        <Grid.Col md={6} lg={4}>
                                            <RoomItem />
                                        </Grid.Col>
                                    )
                                }) : <Grid.Col><NoItems text={`${isUsersProfile ? "You have no rooms" : `${profileUser.name} have no rooms`}`} /></Grid.Col>}
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