import { ActionIcon, Avatar, Container, Flex, Group, Paper, Tabs, useMantineColorScheme } from '@mantine/core';
import { User } from '@prisma/client';
import { IconMessageCircle, IconMoonStars, IconPhoto, IconSettings, IconSun } from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ProfileCard from '../../components/profile/ProfileCard';
import { prisma } from "../../server/db/client"

//@ts-ignore
export const getServerSideProps = async (context) => { //fix type
    const getProfileName = context.params.name;
    const profileUser = await prisma.user.findFirst({
        where: {
            name: getProfileName
        }
    })
    if (profileUser === null) {
        return {
            notFound: true
        }
    }
    return { props: { profileUser } }
};

type profileType = {
    profileUser: User
}

const Profile = (props: profileType) => {
    const { profileUser } = props
    return (
        <>
            <Container>
                <Flex direction="column">
                    <ProfileCard profileUser={profileUser} />

                    <Paper shadow="sm" radius="lg" mt="lg" p="sm" >
                        <Tabs defaultValue="gallery">
                            <Tabs.List grow={true}>
                                <Tabs.Tab value="gallery" icon={<IconPhoto size={14} />}>Videos</Tabs.Tab>
                                <Tabs.Tab value="messages" icon={<IconMessageCircle size={14} />}>Some things</Tabs.Tab>
                                <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>Settings</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="gallery" pt="xs">
                                Videos tab content
                            </Tabs.Panel>

                            <Tabs.Panel value="messages" pt="xs">
                                Some things tab content
                            </Tabs.Panel>

                            <Tabs.Panel value="settings" pt="xs">
                                Settings tab content
                            </Tabs.Panel>
                        </Tabs>
                    </Paper>
                </Flex>

            </Container>
        </>
    )

    //#region Not logged in

    //#endregion
}

export default Profile