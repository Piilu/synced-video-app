import { Button, Center, Container, Divider, TextInput } from '@mantine/core'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { api } from "../utils/api";

const Create: NextPage = () => {
    const user = api.user.getCurrentUser.useQuery();
    const [name, setName] = useState<string>("");
    const handelRoomChange = () => {
        alert("Your name is " + name)
    }
    return (
        <Container>
            {user.data !== undefined
                ?
                <>
                    <h4>This is create test page</h4>
                    <TextInput value={name} onChange={(e) => { setName(e.target.value) }} label="Your name" />
                    <br />
                    <Button onClick={() => { handelRoomChange() }}>Create</Button>
                </>
                : "naaah"}
        </Container>
    )
}



export default Create