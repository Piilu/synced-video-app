import { Avatar, Box, Flex, Grid, Tooltip } from '@mantine/core';
import React, { FunctionComponent, useState } from 'react'

type MessageChip = {
    user: string;
    message: string;
}
//Maybe make it look better later :) 
const MessageChip: FunctionComponent<MessageChip> = (props) => {
    const { user, message } = props;
    return (
        <Box
            style={{ wordBreak: "break-all", padding: "0.5em" ,margin:"0.2em"}}
            sx={(theme) => ({
                textAlign: 'left',
                padding: theme.spacing.xl,
                borderRadius: theme.radius.md,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                },
            })}
        >
            <Flex direction="row">
                <div style={{minWidth:"3em", maxHeight:"3em"}}>
                    <Tooltip position='left' label={user}>
                        <Avatar radius="xl" size="md">{user.charAt(0)}</Avatar>
                    </Tooltip>
                </div>
                <div style={{marginTop:"auto",marginBottom:"auto"}}>{message}</div>
            </Flex>
        </Box>

    )
}

export default MessageChip  