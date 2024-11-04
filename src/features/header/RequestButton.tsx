import { Button } from "@mui/material"
import colors from "../colors"

export const RequestButton = () => {
    return <>
        <Button variant="contained" sx={{
            backgroundColor: colors.darkRed,
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
            borderRadius: "15px",
            padding: "10px 20px",
            border: `${colors.darkRed} 1px solid`,
            textTransform: "none",
            '&:hover': {
                backgroundColor: "transparent",
            }
        
        }}>
            Get request
        </Button>
    </>
}