import { Burger, Flex, Group, Header, MediaQuery, TextInput } from '@mantine/core'
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'
import ToggleTheme from '../custom/ToggleTheme';

type NavHeaderProps = {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>
}

const NavHeader: FunctionComponent<NavHeaderProps> = (props) =>
{
    const { setOpened, opened } = props;
    return (
        <Header height={{ base: 50, md: 70 }} p="md">
            <Flex align="center" h="100%" justify="space-between">
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                        opened={opened}
                        onClick={() => setOpened((o) => !o)}
                        size="sm"
                        mr="xl"
                    />
                </MediaQuery>
                <TextInput w={300} placeholder='Username' />
                <div >
                </div>
                <div >
                    <ToggleTheme />
                </div>
            </Flex>
        </Header >
    )
}

export default NavHeader