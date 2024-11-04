import { Box, Typography } from "@mui/material"
import { FC } from "react"
import colors from "../colors"

type Props = {
    feature: {
        name: string,
        description: string,
        icon: JSX.Element,
        color: string,
    }
}

export const Feature:FC<Props> = ({feature}) => 
{
    return <>
        <Box key={feature.name} sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        padding: "1.5rem",
        borderRadius: 2,
        cursor: "pointer",
        maxWidth: "400px",
        ['&:hover']: {
            transition: "all 0.3s",
            background: colors.black,
            transform: "scale(1.09)"
        }
        }}>
            <Box sx={{display: "flex"}}>
                <Box sx={{p: '10px', background: feature.color, borderRadius: 2, mr: 2}}>
                    {feature.icon}
                </Box>
                <Typography sx={{fontSize: '1.5rem', fontWeight: 700, color: 'white'}}>{feature.name}</Typography>
            </Box>
            <Typography sx={{fontSize: '1rem', fontWeight: 400, textAlign: 'left'}}>{feature.description}</Typography>
        </Box>
    </>
}