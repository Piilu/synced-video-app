import { Container } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { api } from "../../utils/api";

const Profile = () => {
    const router = useRouter();
    const userProfile = router.query.name as string;
    const user = api.user.getByName.useQuery(userProfile);
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!user.isLoading) {
            setLoading(false)
        }
    }, [user])

    if (loading) {
        return null
    }

    if (user.data !== null) {
        return (
            <>
                <Container>
                    <div>{userProfile}'s Profile</div>
                </Container>
            </>
        )
    }

    //#region Not logged in
    return (
        <>
            <Container>
                <div>Can't find the user</div>
            </Container>
        </>
    )
    //#endregion
}

export default Profile