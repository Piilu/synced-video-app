import { ActionIcon, Button, CopyButton, Tooltip } from '@mantine/core';
import { IconMessageCircle, IconCheck, IconLink, IconSettings } from '@tabler/icons';
import { useSession } from 'next-auth/react';
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'

//Maybe make function that adds buttons based on json (different component)
type FloatingButtonsProps = {
    setChatOpen: Dispatch<SetStateAction<"flex" | "none">>;
    setSettingsOpen: Dispatch<SetStateAction<boolean>>;
    chatOpen: "flex" | "none";
    settingsOpen: boolean;
    ownerId: string | undefined,
}
const FloatingButtons: FunctionComponent<FloatingButtonsProps> = (props) =>
{
    const { chatOpen, setChatOpen, setSettingsOpen, settingsOpen, ownerId } = props
    const { data: session } = useSession();
    if (chatOpen !== "flex")
    {
        return (
            <Button.Group orientation="vertical" style={{ position: "absolute", right: 40, top: 40, gap: 2 }}>

                <Tooltip position='left' label="Open chat">
                    <ActionIcon color="light" size="xl" radius="md" onClick={() => { setChatOpen("flex"); }}>
                        <IconMessageCircle size={29} />
                    </ActionIcon>
                </Tooltip>
                <CopyButton value={window.location.href}>
                    {({ copied, copy }) => (
                        <Tooltip position='left' label={copied ? "Copied" : "Copy room link"}>
                            <ActionIcon color="light" size="xl" radius="md" onClick={copy}>
                                {copied ? <IconCheck size={29} /> : <IconLink size={29} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>

                {session != null && session?.user?.id === ownerId ?
                    <Tooltip position='left' label="Settings">
                        <ActionIcon color="light" size="xl" radius="md" onClick={() => { setSettingsOpen(true) }} >
                            <IconSettings size={29} />
                        </ActionIcon>
                    </Tooltip>
                    : null}

            </Button.Group>
        )
    }
    return null
}

export default FloatingButtons