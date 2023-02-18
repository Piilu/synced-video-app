import { Burger, Group, Header, MediaQuery } from '@mantine/core'
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'
import ToggleTheme from '../custom/ToggleTheme';

type NavHeaderProps = {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>
}

const NavHeader: FunctionComponent<NavHeaderProps> = (props) => {
    const { setOpened, opened } = props;
    return (
        <Header height={{ base: 50, md: 70 }} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                        opened={opened}
                        onClick={() => setOpened((o) => !o)}
                        size="sm"
                        mr="xl"
                    />
                </MediaQuery>

                <p>Application header</p>
                <div style={{marginLeft:"auto"}}>
                    <ToggleTheme />
                </div>
            </div>
        </Header>
    )
}

export default NavHeader