import { Box } from "@mui/material"
import { FC } from "react"

type MainContentProps = {
    children: React.ReactNode
    label: string
}

export const MainContent:FC<MainContentProps> = ({children, label}) => {
    return <Box sx={{
        marginLeft: "180px",
        width: "calc(100% - 180px)",
        minHeight: "100vh",
        overflow: "scroll"
    }}>
        {children}
    </Box>
}