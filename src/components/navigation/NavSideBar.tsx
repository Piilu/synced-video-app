import { Aside, MediaQuery } from '@mantine/core'
import React from 'react'

const NavSideBar = () => {
    return (
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
                <p>Application sidebar</p>
            </Aside>
        </MediaQuery>
    )
}

export default NavSideBar