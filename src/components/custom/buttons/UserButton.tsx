import { Menu, Button, Text, UnstyledButtonProps, createStyles, UnstyledButton, Group, Avatar, MediaQuery } from '@mantine/core'
import { IconArrowsLeftRight, IconChevronDown, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash } from '@tabler/icons'
import { useSession } from 'next-auth/react';
import image from 'next/image';
import React, { FunctionComponent } from 'react'

const useStyles = createStyles((theme) => ({
    user: {
        display: 'block',
        borderRadius: "5%",
        padding: "0.5em",
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
    },
}));

interface UserButtonProps extends UnstyledButtonProps
{
    image: string;
    name: string;
    email: string;
    usedStorage: number | null | undefined,
}

const UserButton: FunctionComponent = () =>
{
    const { classes } = useStyles();
    const { data: session } = useSession();

    return (
        <div style={{marginLeft:"auto"}}>
            <Menu width={150} withArrow>
                <Menu.Target>
                    <UnstyledButton className={classes.user} >
                        <Group p={0}>
                            <Avatar p={0} m={0} size={"sm"} src={session?.user?.image} radius="xl" />
                            <Text p={0} m={0}>{session?.user?.name}</Text>
                            <IconChevronDown size="0.9rem" stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item icon={<IconSettings size={14} />}>Videos</Menu.Item>
                    <Menu.Item icon={<IconMessageCircle size={14} />}>Rooms</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Logout</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}

export default UserButton
