import { Code, createStyles, Group, Navbar } from '@mantine/core'
import { IconSwitchHorizontal, IconLogout, IconBrandYoutube, Icon24Hours, IconFingerprint, IconKey, IconDatabase, Icon2fa, IconSettings, IconUser } from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import {LogoutButton, NavDefaultItem} from './items/NavLinks';


const data = [
    { link: '/profile/Piilu', label: 'Profile', icon: IconUser },
];

const useStyles = createStyles((theme, _params) => {
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

const AppSideNav: FunctionComponent<AppSideNavProps> = (props) => {
    const { opened, setOpened } = props;

    const { classes, cx } = useStyles();

    const router = useRouter();
    const links = data.map((item) => (
        <NavDefaultItem item={item} path={router.asPath} />
    ));
    return (

        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>

            <Navbar.Section grow>
                <Group className={classes.header} position="apart">
                    <h2 style={{ margin: 0 }}>Title</h2>
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