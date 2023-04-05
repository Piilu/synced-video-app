import { Center, Flex, Group } from '@mantine/core'
import { IconSearchOff } from '@tabler/icons';
import { Text } from '@mantine/core';
import React, { FunctionComponent } from 'react'

type NotItemsProps = {
    text: string;
}

const NoItems: FunctionComponent<NotItemsProps> = (props) =>
{
    const { text } = props;
    return (
        <Center style={{ height: "25em" }}>
            <Flex direction={"column"} justify={"center"} align={"center"}>
                <IconSearchOff opacity={0.5} size={100} />
                <Text size={"lg"} opacity={0.5}>{text}</Text>
            </Flex>
        </Center>
    )
}

export default NoItems