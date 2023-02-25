import { Center } from '@mantine/core'
import React, { FunctionComponent } from 'react'

type NotItemsProps = {
    text: string;
}

const NoItems: FunctionComponent<NotItemsProps> = (props) => {
    const {text} = props;
    return (
        <Center style={{ height: "25em" }}>
            {text}
        </Center>
    )
}

export default NoItems