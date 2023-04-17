import { ActionIcon, Paper, useMantineColorScheme } from '@mantine/core'
import { IconArrowLeft, IconArrowRight, IconChevronLeft, IconChevronRight } from '@tabler/icons';
import { useSession } from 'next-auth/react';
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'

type ToggleNavbarType = {
    hideNav: boolean,
    setHideNav: Dispatch<SetStateAction<boolean>>,
    absolute?: boolean,
    top?: number,
    bottom?: number,
    left?: number,
    right?: number,

}
const ToggleNavbar: FunctionComponent<ToggleNavbarType> = (props) =>
{
    const { setHideNav, hideNav, left, right, absolute, top, bottom } = props;
    const { data: session } = useSession();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    if (session)
    {

        return (
            <ActionIcon title={hideNav ? "Open navbar" : "Close navbar"} radius={"lg"} style={{ transition: "0.2s", zIndex: 20, position: absolute ? "fixed" : "static", left: left, right: right, top: top, bottom: bottom }} size={35} onClick={() => { setHideNav(!hideNav) }}>
                {hideNav ?
                    <IconChevronRight  size={35} />
                    : <IconChevronLeft size={35} />}
            </ActionIcon>
        )
    }
    return null;
}

export default ToggleNavbar
