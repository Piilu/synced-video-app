import { Avatar, Box, Flex, Grid, Tooltip, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { User } from '@prisma/client';
import { openConfirmModal } from '@mantine/modals'
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
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
    const { data: session } = useSession();
    const externalinkWarning = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (e.currentTarget.href.includes(window.location.hostname)) return;
        e.preventDefault();
        var url = e.currentTarget.href;
        openConfirmModal({
            title: 'Please confirm your action',
            centered:true,
            withCloseButton:false,
            closeOnClickOutside:false,
            children: (
                <Text size="sm">
                    Are you sure you want to follow this link
                </Text>
            ),
            labels: { confirm: 'Yes, open it', cancel: 'Cancel' },
            onCancel: () => { return },
            onConfirm: () =>window.open(url),
        });
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
                    <Tooltip position='left' label={session?.user?.id === user?.id ? `${user?.name} (You)` : user?.name}>
                        <Avatar style={{ border: session?.user?.id === user?.id ? "solid 1px rgba(228, 255, 54, 0.17)" : "none", boxShadow: session?.user?.id === user?.id ? '0 0 10px rgba(228, 255, 54, 0.17)' : "none" }} radius="xl" size="md">{user?.name?.charAt(0)}</Avatar>
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
        </Box >

    )
}

export default MessageChip  