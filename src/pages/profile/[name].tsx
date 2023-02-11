import { Container } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Profile = () => {
    const router = useRouter();
    const userProfile = router.query.name as string;
    const [loading, setLoading] = useState<boolean>(true)



    // if (loading) {
    //     return null
    // }

    return (
        <>
            <Container>
                <div>{userProfile}'s Profile</div>
            </Container>
        </>
    )

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