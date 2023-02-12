import { Navbar } from '@mantine/core'
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'
import NavDefaultItem from './items/NavDefaultItem';

type AppSideNavProps = {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>
}

const AppSideNav: FunctionComponent<AppSideNavProps> = (props) => {
    const { opened, setOpened } = props;
    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>

            <Navbar.Section grow mt="xl">
                <p>jes</p>
            </Navbar.Section>
            <Navbar.Section style={{
                borderTop: `1px solid gray`
            }}>
                <NavDefaultItem user={undefined} />
            </Navbar.Section>
        </Navbar>
    )
}

export default AppSideNav