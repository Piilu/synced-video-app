import { Button, Center, Container, Divider, TextInput } from '@mantine/core'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { api } from "../utils/api";

const Create: NextPage = () => {
    //const test = api.room.hello.useQuery({ text: "from tRPC" });
    const [name, setName] = useState<string>("");
    const handelRoomChange = () => {
        alert("Your name is " + name)
    }

    return (
        <Container>
            <h4>This is create test page</h4>
            <TextInput value={name} onChange={(e) => { setName(e.target.value) }} label="Your name" />
            <br />
            <Button onClick={() => { handelRoomChange() }}>Create</Button>
        </Container>
    )



}



export default Create