import React, { FunctionComponent, useState } from 'react'
import { Paper, Text, Box, Textarea, Flex, ScrollArea, Divider, Button, ActionIcon } from '@mantine/core'
import { IconArrowBarRight } from '@tabler/icons'

type chatProps = {
    message: string;
    user: string;
}

const Chat: FunctionComponent<chatProps> = (props: chatProps) => {
    const { } = props;
    const [chatOpen, setChatOpen] = useState<string>("flex")
    return (
        <Paper style={{ display: chatOpen, height: "100%", gap: "", flexDirection: "column", alignItems: "flex-start" }} shadow="xs" mt={5} radius="md" withBorder>
            <div style={{ padding: "1em" }}>
                <ActionIcon size="xl" radius="md" onClick={() => { chatOpen == "flex" ? setChatOpen("none") : setChatOpen("flex"); }}>
                    <IconArrowBarRight size={34} />
                </ActionIcon>
            </div>
            <Divider style={{ width: "100%" }} />
            <Flex style={{ height: "100%", width: "100%", overflow: "auto", padding: "1em" }}
                align="flex"
                direction="column-reverse"
                wrap="nowrap">

                {/* Messages here */}

            </Flex>

            <Box style={{ width: "100%", marginTop: "auto" }}>
                <Textarea
                    placeholder="Message"
                    autosize
                    variant="filled"
                    size="md"
                    minRows={2}
                    maxRows={4}
                />
            </Box>

        </Paper >
    )
}

export default Chat