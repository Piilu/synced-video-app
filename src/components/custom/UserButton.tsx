import
{
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
    createStyles,
    Button,
    Menu,
    Progress,
    Tooltip,
    MediaQuery,
} from '@mantine/core';
import React, { useState } from "react"
import { IconArrowsLeftRight, IconChevronRight, IconLogout, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash } from '@tabler/icons';
import prettyBytes from 'pretty-bytes';
import { signOut, useSession } from 'next-auth/react';

const useStyles = createStyles((theme) => ({
    user: {
        display: 'block',
        width: '100%',
        borderRadius: "5%",
        padding: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
    },
}));


const UserButton = ({ ...others }: UnstyledButtonProps) =>
{
    const { classes } = useStyles();
    const [opened, setOpened] = useState<boolean>()
    const { data: session } = useSession();
    return (
        <>
            <Menu shadow="md" opened={opened} radius={"md"} withArrow position="right" width={180} >
                <Menu.Target>
                    <UnstyledButton className={classes.user} {...others}>
                        <Group>
                            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                                <Avatar src={session?.user?.image} radius="xl" />
                            </MediaQuery>

                            <div style={{ flex: 1 }}>
                                <Text size="sm" weight={500}>
                                    {session?.user?.name}
                                </Text>

                                <Text color="dimmed" size="xs">
                                    {session?.user?.email}
                                </Text>


                            </div>
                            <IconChevronRight size="0.9rem" stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
                    <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                    <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
                    <Menu.Item
                        icon={<IconSearch size={14} />}
                        rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
                    >
                        Search
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item icon={<IconLogout size={14} onClick={() => signOut({ callbackUrl: `${window.location.origin}` })} />}>Logout</Menu.Item>
                </Menu.Dropdown>
            </Menu >

        </>
    );
}
export default UserButton