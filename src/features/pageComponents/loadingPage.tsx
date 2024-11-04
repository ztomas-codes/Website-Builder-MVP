import {Box, CircularProgress} from "@mui/material";
import colors from "@/features/colors";

export const LoadingPage = () => {
    return <>
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
        }}>
            <CircularProgress sx={{
                color: colors.darkRed,
                transform: "scale(10)"
            }} />
        </Box>
    </>
}