import { Progress, Text, Tooltip } from '@mantine/core'
import React, { useEffect, FunctionComponent, useState, Dispatch, SetStateAction } from 'react'

type ProgressBarProps = {
    progress: number,
    setProgress: Dispatch<SetStateAction<number>>
}
const ProgressBar: FunctionComponent<ProgressBarProps> = (props) =>
{
    const { progress, setProgress } = props;
    const [visible, setVisible] = useState<"none" | "block">("none")

    useEffect(() =>
    {
        if (progress > 0)
        {
            setVisible('block')

        }

        if (progress >= 100 || progress == 0)
        {
            setVisible("none")
        }

    }, [progress])
    return (
        <Tooltip label="Uploading video" position="bottom" withArrow>
            <div style={{ display: visible }}>
                <Text align='center'>{progress}%</Text>
                <Progress color="green" size="sm" value={progress} animate />
            </div>
        </Tooltip>
    )
}

export default ProgressBar