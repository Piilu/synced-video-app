import { Burger, Header, MediaQuery } from '@mantine/core'
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'

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
            </div>
        </Header>
    )
}

export default NavHeader