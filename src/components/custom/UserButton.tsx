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
    Switch,
    useMantineColorScheme,
} from '@mantine/core';
import React, { useState } from "react"
import { IconArrowsLeftRight, IconChevronRight, IconLogout, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash } from '@tabler/icons';
import prettyBytes from 'pretty-bytes';
import { signOut, useSession } from 'next-auth/react';

const useStyles = createStyles((theme) => ({
    user: {
        display: 'block',
        width: '100%',
        borderRadius: "1.1em",
        padding: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
        },
        transition: "0.2s"
    },
}));


const UserButton = ({ ...others }: UnstyledButtonProps) =>
{
    const { classes } = useStyles();
    const [opened, setOpened] = useState<boolean>()
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const { data: session } = useSession();
    return (
        <Menu shadow="md"  opened={opened} radius={"md"} withArrow width={200}>
            <Menu.Target>
                <UnstyledButton className={classes.user} {...others}>
                    <Group>
                            <Avatar src={session?.user?.image} radius="xl" />

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
                {/* <Menu.Item
                    icon={<IconSearch size={14} />}
                    rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
                    >
                    Search
                </Menu.Item> */}
                <Menu.Label>Appearance</Menu.Label>
                <Menu.Item  onClick={()=>{toggleColorScheme();console.log("hc amsnjdb,ashbdk,")}} closeMenuOnClick={false} icon={<IconPhoto size={14} />}>
                    <Group position='apart' noWrap>
                        Dark theme <Switch  checked={dark} size="xs"></Switch>
                    </Group>
                </Menu.Item>


                <Menu.Divider />

                <Menu.Item icon={<IconLogout size={14} onClick={() => signOut({ callbackUrl: `${window.location.origin}` })} />}>Logout</Menu.Item>
            </Menu.Dropdown>
        </Menu >

    );
}
export default UserButton