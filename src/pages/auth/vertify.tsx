import { Container, Title, Paper, Text, TextInput, Button, Divider } from '@mantine/core'
import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const vertify = () =>
{
    const router = useRouter()
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
            <Head>
                <title>Vertify</title>
            </Head>
            <Container style={{ width: "30em" }} >
                <Paper withBorder shadow="md" p={20} radius="md">
                    <Title
                        mb={10}
                        align="center"
                        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                    >
                        Check your email
                    </Title>
                    <Text align='center'>A sign in link has been sent to your email address.</Text>
                    <Text align='center' mt={20} opacity={0.5}>{window.location.host}</Text>
                </Paper>
            </Container>
        </div>
    )
}

export default vertify
