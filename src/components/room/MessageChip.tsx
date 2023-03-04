import { Avatar, Box, Flex, Grid, Tooltip } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { User } from '@prisma/client';
import { Session } from 'next-auth';
import React, { FunctionComponent, useState } from 'react'
import ReactLinkify from 'react-linkify';

type MessageChip = {
    user: User | undefined;
    message: string;
}
//Maybe make it look better later :) 
const MessageChip: FunctionComponent<MessageChip> = (props) => {
    const { user, message } = props;
    const { hovered, ref } = useHover();

    const externalinkWarning = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (e.currentTarget.href.includes(window.location.hostname)) return;
        e.preventDefault();
        const allowed = confirm("Are you sure you want to follow this link")
        if (!allowed) return;
        window.open(e.currentTarget.href)
    }

    return (
        <Box
            style={{ wordBreak: "break-all", padding: "0.5em", margin: "0.2em" }}
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
                <div style={{ minWidth: "3em", maxHeight: "3em" }}>
                    <Tooltip position='left' label={user?.name}>
                        <Avatar radius="xl" size="md">{user?.name?.charAt(0)}</Avatar>
                    </Tooltip>
                </div>
                <ReactLinkify componentDecorator={(decoratedHref, decoratedText, key) => (
                    <div ref={ref}>
                        <a target="blank" style={{ color: "Highlight", }} onClick={e => { externalinkWarning(e) }} href={decoratedHref} key={key}>
                            {hovered ? <u>{decoratedText}</u> : decoratedText}
                        </a>
                    </div>
                )}>
                    <div style={{ marginTop: "auto", marginBottom: "auto" }}>{message}</div>
                </ReactLinkify>
            </Flex>
        </Box>

    )
}

export default MessageChip  