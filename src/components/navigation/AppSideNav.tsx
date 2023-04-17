import { ActionIcon, Button, Code, createStyles, Divider, Group, Navbar } from '@mantine/core'
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

const data = [
    { link: '/profile/{0}', label: 'Profile', icon: IconUser, linkType: LinkTypes.PROFILE },
];

const useStyles = createStyles((theme, _params) =>
{
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
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
    const links = data.map((item) => (
        <NavDefaultItem path={router.asPath} key={item.label} item={item} profileName={router.query.name as string} />
    ));

    return (

        <Navbar p="md" hiddenBreakpoint="sm" hidden={false} width={{ sm: 300, lg: 300 }}>
            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    <Group align='center'>

                        <Link href={`/profile/${session?.user?.name}`} style={{ margin: 0, fontSize: "1.5em" }}>
                            Party</Link>
                    </Group>
                    <ToggleTheme />
                    <ToggleNavbar setHideNav={setHideNav} hideNav={hideNav} />
                </Group>
                <UserSearch />
                <Divider my={15} />
                {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <UserButton />
                {/* <LogoutButton /> */}
                <UserStorage />
            </Navbar.Section>
        </Navbar>
    )
}
export default AppSideNav
