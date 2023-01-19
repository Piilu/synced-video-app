import { Box } from '@mantine/core';
import React, { FunctionComponent, useState } from 'react'

type MessageChip = {
    user: string;
    message: string;
}
//Maybe make it look better later :) 
const MessageChip: FunctionComponent<MessageChip> = (props) => {
    const { user, message } = props;
    return (
        <div style={{ wordBreak: "break-all", padding: "0.5em"}}>
           {user}: {message}
        </div>
    )
}

export default MessageChip  