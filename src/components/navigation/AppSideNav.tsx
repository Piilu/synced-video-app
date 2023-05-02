import { ActionIcon, Box, Button, Center, Code, createStyles, Divider, Drawer, Group, Navbar, Popover, ScrollArea, Switch, Text, TextInput, useMantineTheme } from '@mantine/core'
import { useWindowEvent } from '@mantine/hooks';
import { IconSwitchHorizontal, IconLogout, IconBrandYoutube, Icon24Hours, IconFingerprint, IconKey, IconDatabase, Icon2fa, IconSettings, IconUser, TablerIcon, IconPlayerPlay, IconGripVertical, IconX, IconPlus, IconTrash, IconUsers, IconDashboard } from '@tabler/icons';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import React, { Dispatch, FunctionComponent, SetStateAction, useState, useEffect } from 'react'
import { EndPoints, LinkTypes } from '../../constants/GlobalEnums';
import { UserResBody } from '../../pages/api/profile/user';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import ToggleTheme from '../custom/ToggleTheme';
import UserButton from '../custom/UserButton';
import { LogoutButton, NavDefaultItem } from './items/NavLinks';
import UserSearch from '../custom/search/UserSearch';
import UserStorage from '../custom/status/UserStorage';
import ToggleNavbar from '../custom/buttons/ToggleNavbar';
import NavCreateNew from '../custom/buttons/NavCreateNew';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import EmojiPicker from 'emoji-picker-react';
import { PopoverTarget } from '@mantine/core/lib/Popover/PopoverTarget/PopoverTarget';
import { useForm } from '@mantine/form';
import { getUserRole } from '../../utils/helpers/get-user-role';
import { Role } from '@prisma/client';

const data = [
    { label: 'Account', isInfo: true },
    { link: '/profile/{0}', label: 'Profile', icon: IconUser, linkType: LinkTypes.PROFILE, isInfo: false },
    { link: '/test', label: 'Test', icon: IconUser, linkType: LinkTypes.DEFAULT, isInfo: false },
];

const adminData = [
    { link: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard, linkType: LinkTypes.DEFAULT, isInfo: false },
    { link: '/admin/users', label: 'Users', icon: IconUsers, linkType: LinkTypes.DEFAULT, isInfo: false },
];

const shortcutData = [
    { link: '/test', label: 'Test1', icon: IconUser, linkType: LinkTypes.DEFAULT, isInfo: false },
    { link: '/test', label: 'Test2', icon: IconUser, linkType: LinkTypes.DEFAULT, isInfo: false },


];

const useStyles = createStyles((theme, _params) =>
{
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md,
        },

        footer: {
            paddingTop: theme.spacing.sm,
            marginTop: theme.spacing.sm,
            // borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        },

    };
});

type AppSideNavProps = {
    hideNav: boolean;
    setHideNav: Dispatch<SetStateAction<boolean>>
}

const AppSideNav: FunctionComponent<AppSideNavProps> = (props) =>
{
    const { data: session } = useSession();
    const { setHideNav, hideNav } = props;
    const { classes, cx } = useStyles();
    const router = useRouter();
    const [linksOpened, setLinksOpened] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [role, setRole] = useState<Role>(Role.USER)
    const theme = useMantineTheme();
    const form = useForm({
        initialValues: {
            linkButtons: [
                { label: 'John Doe', url: 'asd', active: false },
                { label: 'John Doe 2', url: 'asdasd', active: false },
            ],
        },
    });
    const links = data.map((item) =>
    {
        if (item.isInfo)
        {
            return (
                <Text key={item.label + "link"} tt={"uppercase"} size="xs" my={10} weight={500} color="dimmed">
                    {item.label}
                </Text>
            );
        }
        else
        {
            return (
                <NavDefaultItem path={router.asPath} key={item.label} item={item} profileName={router.query.name as string} />
            )
        }

    });

    const adminLinks = adminData.map((item) =>
    {
        if (item.isInfo)
        {
            return (
                <Text key={item.label + "link"} tt={"uppercase"} size="xs" my={10} weight={500} color="dimmed">
                    {item.label}
                </Text>
            );
        }
        else
        {
            return (
                <NavDefaultItem path={router.asPath} key={item.label} item={item} profileName={router.query.name as string} />
            )
        }

    });

    const shortCutLinks = shortcutData.map((item) =>
    {
        if (item.isInfo)
        {
            return (
                <Text key={item.label} tt={"uppercase"} size="xs" my={10} weight={500} color="dimmed">
                    {item.label}
                </Text>
            );
        }
        else
        {
            return (
                <NavDefaultItem path={router.asPath} key={item.label} item={item} profileName={router.query.name as string} />
            )
        }

    });

    const fields = form.values.linkButtons.map((item, index) => (
        <Draggable key={index} index={index} draggableId={index.toString()}>
            {(provided) => (
                <div  {...provided.draggableProps}
                    ref={provided.innerRef}>

                    <Group noWrap className='box-item'>
                        <Center {...provided.dragHandleProps}>
                            <IconGripVertical size="1.2rem" />
                        </Center>
                        <Popover position='right'>
                            <Popover.Target>

                                <ActionIcon>
                                    <IconUser size={20} />
                                    {/* <item.icon size={20} /> */}
                                </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Text>Some items here</Text>
                            </Popover.Dropdown>
                        </Popover>

                        <TextInput {...form.getInputProps(`linkButtons.${index}.label`)} placeholder='Label' />
                        <TextInput icon="/"  {...form.getInputProps(`linkButtons.${index}.url`)} placeholder='Url' />
                        <Switch {...form.getInputProps(`linkButtons.${index}.active`, { type: "checkbox" })} />
                        <ActionIcon onClick={() => form.removeListItem("linkButtons", index)} color="red" ml="auto">
                            <IconTrash size={20} />
                        </ActionIcon>
                    </Group>
                </div>

            )}
        </Draggable>
    ));
    useEffect(() => { checkRole() }, [router])

    const checkRole = async () =>
    {
        setRole(await getUserRole() ?? Role.USER);
    }
    
    return (
        <>
            <Drawer size="xl" padding="xl" title="Shortcut link settings" opened={linksOpened} onClose={() => setLinksOpened(false)}>

                <div style={{ maxHeight: "30em", overflow: "auto" }} >

                    <DragDropContext onDragEnd={({ destination, source }) =>
                        form.reorderListItem('linkButtons', { from: source.index, to: destination.index })
                    }>
                        <Droppable droppableId="dnd-list" direction="vertical">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {fields}
                                    {provided.placeholder}
                                </div>
                            )}

                        </Droppable>
                    </DragDropContext>
                </div>

                <Button w="100%" leftIcon={<IconPlus />} onClick={() => form.insertListItem('linkButtons', { label: '', url: '', active: false })}>Add new shortcut</Button>
                <Text align='right' size={"xs"}>{form.values.linkButtons.length}/10</Text>

            </Drawer>

            <Navbar p="md" hiddenBreakpoint="sm" hidden={false} width={{ sm: 300, lg: 300 }}>
                <Navbar.Section style={{ overflow: "auto" }} grow>
                    <Group className={classes.header} position="apart">
                        <Group align='center'>

                            <Link href={`/profile/${session?.user?.name}`} style={{ margin: 0, fontSize: "1.5em" }}>
                                Party</Link>
                        </Group>
                        {/* <ToggleTheme /> */}
                        <ToggleNavbar setHideNav={setHideNav} hideNav={hideNav} />
                    </Group>
                    <UserSearch />
                    {session?.user?.role === Role.SUPERADMIN ?
                        <Button.Group my={5}>
                            <Button onClick={() => { setIsAdmin(false) }} radius={10} size='xs' w={"50%"} variant={isAdmin ? "default" : "filled"}>User</Button>
                            <Button onClick={() => { setIsAdmin(true) }} radius={10} size='xs' w={"50%"} variant={isAdmin ? "filled" : "default"}>Admin</Button>
                        </Button.Group>
                        : null}

                    {
                        isAdmin ?
                            adminLinks
                            :
                            <div>
                                {links}
                                <Text tt={"uppercase"} size="xs" my={10} weight={500} color="dimmed">
                                    Shortcuts
                                </Text>
                                <Box style={{ overflow: "auto" }} mah={250}>
                                    {shortCutLinks}
                                </Box>
                                <NavCreateNew onClick={() => { setLinksOpened(true) }} />
                            </div>
                    }


                </Navbar.Section>

                <Navbar.Section className={classes.footer}>
                    <UserButton />
                    <UserStorage />
                    {/* <LogoutButton /> */}
                </Navbar.Section>
                <Navbar.Section>
                </Navbar.Section>
            </Navbar>
        </>
    )
}
export default AppSideNav
