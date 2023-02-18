import { ActionIcon, Avatar, Button, Flex, Group, Overlay, Paper, Textarea, TextInput, useMantineColorScheme } from '@mantine/core'
import { useHover } from '@mantine/hooks';
import { closeAllModals, openModal } from '@mantine/modals';
import { Session, User } from '@prisma/client';
import { IconEdit, IconMoonStars, IconSun } from '@tabler/icons';
import React, { FunctionComponent } from 'react'

type profileCardProps = {
    profileUser: User;
    isUsersProfile: boolean;
}

const ProfileCard: FunctionComponent<profileCardProps> = (props: profileCardProps) => {
    const { profileUser, isUsersProfile } = props;
    const editProfile = () => {
        openModal({
            title: "Profile settings",
            centered: true,
            children: (
                <>
                    <Flex direction="column">
                        <Group>
                            <TextInput title="Email cant't be changed" disabled withAsterisk label="Email:" value={profileUser?.email as string} placeholder="Your email" />
                            <TextInput withAsterisk label="Username:" value={profileUser?.name as string} placeholder="Your name" />
                        </Group>
                        <Textarea
                            placeholder="Your comment"
                            label="Your comment"
                        />
                    </Flex>
                    <Button fullWidth mt="md">
                        Save
                    </Button>
                </>
            )
        })
    }

    return (
        <Paper shadow="sm" radius="lg" mt="lg" p="sm" >
            <Group position="right">
                {isUsersProfile ?
                    <ActionIcon onClick={editProfile} size="md" radius="lg">
                        <IconEdit size={19} />
                    </ActionIcon>
                    : null}
            </Group>
            <Group position='center' p="lg">
                <Flex gap={3} align="center" direction={"column"}>
                    <Avatar component='a' href='#' radius="xl" size="xl" src={profileUser.image} />
                    <h4 style={{ margin: 0 }}>{profileUser.name}</h4>
                    <small>{profileUser.email}</small>
                    <small style={{ width: "50%", textAlign: "center" }}>Minim Lorem fugiat ad non excepteur elit enim voluptate exercitation proident cupidatat dolor.</small>
                </Flex>
            </Group>
        </Paper>
    )
}
export default ProfileCard;
