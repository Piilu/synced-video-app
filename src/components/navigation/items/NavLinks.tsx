import { createStyles } from '@mantine/core';
import { User } from '@prisma/client'
import { IconLogout } from '@tabler/icons';
import { signOut, useSession } from 'next-auth/react';
import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import { LinkTypes } from '../../../constants/GlobalEnums';
import { LinkItemData } from '../../../constants/schema';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme, _params, getRef) =>
{
    const icon = getRef('icon');
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

        link: {
            ...theme.fn.focusStyles(),
            display: 'flex',
            marginBottom:"0.5em",
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
            padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
            borderRadius: "1.1em",
            fontWeight: 500,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                },
            },
        },

        linkIcon: {
            ref: icon,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
            // backgroundColor:theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[6],
            // borderRadius: "1.1em",
        },

        linkActive: {
            '&, &:hover': {
                backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
                    .background,
                color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
                },
            },
        },
    };
});

type NavDefaultItemProps = {
    item: LinkItemData,
    profileName: string,
    path: string,
}
const NavDefaultItem: FunctionComponent<NavDefaultItemProps> = (props) =>
{
    const { item, profileName } = props;
    const { classes, cx } = useStyles();
    const { data: session } = useSession();
    const router = useRouter()
    const link = item.linkType === LinkTypes.DEFAULT ? item.link : item.link.replace("{0}", session?.user?.name as string)

    return (
        <Link
            className={cx(classes.link, { [classes.linkActive]: item.linkType === LinkTypes.DEFAULT ? link===router.asPath : profileName === session?.user?.name as string && link.includes(session?.user?.name as string) })}
            href={link}
            key={item.label}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    )
}


const LogoutButton: FunctionComponent = (props) =>
{
    const { classes, cx } = useStyles();

    return (
        <Link href="#" className={classes.link} onClick={(event) => signOut({ callbackUrl: `${window.location.origin}` })}>
            <IconLogout className={classes.linkIcon} stroke={1} />
            <span>Logout</span>
        </Link>
    )
}

export { LogoutButton, NavDefaultItem } 