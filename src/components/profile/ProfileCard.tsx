import { ActionIcon, Avatar, Flex, Group, Paper, useMantineColorScheme } from '@mantine/core'
import { User } from '@prisma/client';
import { IconMoonStars, IconSun } from '@tabler/icons';
import React, { FunctionComponent } from 'react'
import ToggleTheme from '../custom/ToggleTheme';

type profileCardProps = {
    profileUser: User
}

const ProfileCard: FunctionComponent<profileCardProps> = (props: profileCardProps) => {
    const { profileUser } = props;
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <Paper shadow="sm" radius="lg" mt="lg" p="sm" >
            <Group position="right">
                <ToggleTheme />
            </Group>
            <Group position='center' p="lg">
                <Flex gap={3} align="center" direction={"column"}>
                    <Avatar radius="xl"  size="xl" src={profileUser.image} />
                    <h4 style={{ margin: 0 }}>{profileUser.name}</h4>
                    <small>{profileUser.email}</small>
                    <small style={{ width: "50%", textAlign: "center" }}>Minim Lorem fugiat ad non excepteur elit enim voluptate exercitation proident cupidatat dolor.</small>
                </Flex>
            </Group>
        </Paper>
    )
}
export default ProfileCard;
