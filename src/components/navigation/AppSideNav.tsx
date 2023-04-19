import { ActionIcon, Box, Button, Code, createStyles, Divider, Group, Navbar, ScrollArea, Text } from '@mantine/core'
import { useWindowEvent } from '@mantine/hooks';
import { IconSwitchHorizontal, IconLogout, IconBrandYoutube, Icon24Hours, IconFingerprint, IconKey, IconDatabase, Icon2fa, IconSettings, IconUser, TablerIcon, IconPlayerPlay } from '@tabler/icons';
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

const data = [
    { label: 'Account', isInfo: true },
    { link: '/profile/{0}', label: 'Profile', icon: IconUser, linkType: LinkTypes.PROFILE, isInfo: false },
    { link: '/test', label: 'Test', icon: IconUser, linkType: LinkTypes.DEFAULT, isInfo: false },
];

const ShortcutData = [
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
    const links = data.map((item) =>
    {
        if (item.isInfo)
        {
            return (
                <Text key={item.label+"link"} tt={"uppercase"} size="xs" my={10} weight={500} color="dimmed">
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

    const shortCutLinks = ShortcutData.map((item) =>
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

    return (

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
                {links}
                <Text tt={"uppercase"} size="xs" my={10} weight={500} color="dimmed">
                    Shortcuts
                </Text>
                <Box style={{overflow:"auto"}} mah={250}>
                    {shortCutLinks}
                </Box>
                <NavCreateNew />

            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <UserButton />
                <UserStorage />
                {/* <LogoutButton /> */}
            </Navbar.Section>
        </Navbar>
    )
}
export default AppSideNav
