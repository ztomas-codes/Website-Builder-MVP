import {Box, Button, Typography} from "@mui/material";
import colors from "@/features/colors";
import Link from "next/link";

export const ThankYouPage = () => {
    return (
        <Box sx={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Box sx={{
                maxWidth: "50%",
            }}>
                <Typography variant="h1" style={{
                    color: colors.darkRed,
                    fontSize: "3rem",
                    fontWeight: 500,
                }}>Thanks for your Registration</Typography>
                <Box sx={{p:2}}>
                    <Typography style={{
                        color: 'white',
                        fontSize: "1.5rem",
                        fontWeight: 400,
                    }}>Dear user, we have received your registration, you can now login to your account.
                    </Typography>
                    <Link href={"/"}>
                        <Button variant="contained" sx={{
                            mt: 2,
                            backgroundColor: colors.darkRed,
                            color: 'white',
                            fontSize: "1.2rem",
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: colors.darkRed,
                                color: 'white',
                            }

                        }}>
                            Go back to Home
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}