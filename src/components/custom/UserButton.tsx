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
} from '@mantine/core';
import React, { useState } from "react"
import { IconArrowsLeftRight, IconChevronRight, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash } from '@tabler/icons';

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

interface UserButtonProps extends UnstyledButtonProps
{
    image: string;
    name: string;
    email: string;
}

const UserButton = ({ image, name, email, ...others }: UserButtonProps) =>
{
    const { classes } = useStyles();
    const [opened, setOpened] = useState<boolean>()

    return (
        <>
            <Menu shadow="md" opened={opened} withArrow position="right" width={200}>
                <Menu.Target>
                    <UnstyledButton className={classes.user} {...others}>
                        <Group>
                            <Avatar src={image} radius="xl" />
                            <div style={{ flex: 1 }}>
                                <Text size="sm" weight={500}>
                                    {name}
                                </Text>

                                <Text color="dimmed" size="xs">
                                    {email}
                                </Text>

                                <Tooltip label="50%">
                                    <div style={{ marginTop: "0.5em" }}>
                                        <Progress color="cyan" radius="xl" size="xs" value={50} />
                                        <Group position='apart'>
                                            <Text size="xs">0GB</Text>
                                            <Text size="xs">5GB</Text>
                                        </Group>
                                    </div>
                                </Tooltip>
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

                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
                    <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
                </Menu.Dropdown>
            </Menu >

        </>
    );
}
export default UserButton