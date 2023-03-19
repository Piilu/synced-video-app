import { Code, createStyles, Group, Navbar } from '@mantine/core'
import { IconSwitchHorizontal, IconLogout, IconBrandYoutube, Icon24Hours, IconFingerprint, IconKey, IconDatabase, Icon2fa, IconSettings, IconUser, TablerIcon } from '@tabler/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import { LinkTypes } from '../../constants/GlobalEnums';
import { LogoutButton, NavDefaultItem } from './items/NavLinks';

const data = [
    { link: '/profile/{0}', label: 'Profile', icon: IconUser, linkType: LinkTypes.PROFILE },
];

const useStyles = createStyles((theme, _params) =>
{
    return {
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
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
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>
}

const AppSideNav: FunctionComponent<AppSideNavProps> = (props) =>
{
    const { opened, setOpened } = props;
    const { data: session } = useSession();
    const { classes, cx } = useStyles();

    const router = useRouter();
    console.log("APPSIDENAV:", router)
    const links = data.map((item) => (
        <NavDefaultItem key={item.label} item={item} profileName={router.query.name as string} />
    ));
    return (

        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>

            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    <Link href={`/profile/${session?.user?.name}`} style={{ margin: 0, fontSize: "1.5em" }}>App?</Link>
                </Group>
                {links}
            </Navbar.Section>

            <Navbar.Section className={classes.footer}>
                <LogoutButton />
            </Navbar.Section>
        </Navbar>
    )
}

export default AppSideNav