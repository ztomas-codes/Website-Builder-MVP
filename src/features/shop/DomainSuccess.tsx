import { Box, Typography } from "@mui/material"
import Image from "next/image"

export const DomainSuccess = () => {
    return <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    }}>
        <Image src="/logo.png" alt="Success" id="spinninglogo" width={200} height={200} />
        <Typography variant="h4" component="h1" sx={{ 
            marginLeft: 2,
            color: 'whitesmoke',
            width: '30%',
            fontSize: '2rem',
            lineHeight: '2.5rem',

        }}>You have successfully assigned <strong>domain records</strong>, wait for <strong>administrator</strong> to set up your shop</Typography>
    </Box>
}