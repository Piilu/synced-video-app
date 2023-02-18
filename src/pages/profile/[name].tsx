import { Button, Center, Container, FileInput, Flex, Group, NativeSelect, Paper, Tabs, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { Session, User } from '@prisma/client';
import { IconMessageCircle, IconPhoto, IconSettings, IconUpload } from '@tabler/icons';
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import VideoItem from '../../components/custom/VideoItem';
import ProfileCard from '../../components/profile/ProfileCard';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { prisma } from "../../server/db/client"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const getProfileName = ctx.params?.name;
    const session = await getServerAuthSession(ctx);

    const profileUser = getProfileName !== null ? await prisma.user.findFirst({
        where: {
            name: getProfileName as string
        }
    }) : null;

    const isUsersProfile = session?.user?.id == profileUser?.id ? true : false;

    if (profileUser === null) {
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

const Profile: NextPage<profileType> = (props) => {
    const { data: session } = useSession();
    const { profileUser, isUsersProfile } = props
    const handleUploadVideo = () => {
        openModal({
            title: "Profile settings",
            centered: true,
            children: (
                <>
                    <Flex direction="column" rowGap={10}>
                        <Group  grow>
                            <TextInput fullwidth withAsterisk label="Video title" placeholder='Awesome movie' />
                            <NativeSelect data={['Public','Private']}  withAsterisk label="Visibility"/>

                        </Group>
                        <FileInput label="Video" placeholder="Your video" icon={<IconUpload size={14} />} />
                    </Flex>
                    <Button fullWidth mt="md">
                        Upload
                    </Button>
                </>
            )
        })
    }

    return (
        <>
            <Container>
                <Flex direction="column">
                    <ProfileCard isUsersProfile={isUsersProfile} profileUser={profileUser} />
                    <Tabs defaultValue="videos">
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
                                    <Button color="teal" onClick={handleUploadVideo} size='xs' radius="md" leftIcon={<IconUpload size={18} />}>Upload video</Button>
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
                            <Center>
                                User have no rooms
                            </Center>
                        </Tabs.Panel>

                        <Tabs.Panel value="settings" pt="xs">
                            <Center>
                                Settings tab content
                            </Center>
                        </Tabs.Panel>
                    </Tabs>
                </Flex>

            </Container>
        </>
    )
}

export default Profile