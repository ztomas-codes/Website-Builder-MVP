import { Box, Button, Container, Typography } from "@mui/material";
import colors, { BREAKPOINT } from "../colors";
import Image from "next/image";

export const LandingContent = () => 
{
    return <Container sx={{
        maxWidth: "1300px !important",
        mt: 20,
        height: "80vh",
        padding: "0 2rem",
        display: "flex",
        flexDirection: "column",
        [`@media (max-width: ${BREAKPOINT})`]: {
            height: "fit-content",
            mt: 20,
        }
    }}>
        <Box sx={{
            [`@media (max-width: ${BREAKPOINT})`]: {
                display: "none",
            }
        }}>
        <Image src={"./layered-waves-haikei.svg"} style={{
            position: "absolute",
            zIndex: -1,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: "rotate(180deg)",
        }} layout="fill" objectFit="cover" alt="vawes" />
        </Box>
        <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
        }}>
            <Box sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                [`@media (max-width: ${BREAKPOINT})`]: {
                    width: "100%",
                }
            }}>
                <Typography sx={{
                    typography: "h1",
                    fontSize: "4rem",
                    fontWeight: "bold",
                    color: colors.darkRed,
                }}>
                    Produx System
                </Typography>
                <Typography sx={{
                    typography: "h2",
                    fontSize: "2rem",
                    fontWeight: "normal",
                    mt: 2,
                }}>
                    Create your own custom branded website which makes sales for you while you sleep.
                </Typography>
                <Box>
                    <Button sx={{
                        backgroundColor: colors.darkRed,
                        color: colors.white,
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        mt: 4,
                        "&:hover": {
                            backgroundColor: colors.lighterRed,
                        }
                    }}
                    href="https://discord.gg/3KPr3zNCqk"
                    >
                        Start your beta on Discord
                    </Button>
                </Box>
            </Box>
            <Box sx={{
                width: "43%",
                display: "flex",
                justifyContent: "center",
                [`@media (max-width: ${BREAKPOINT})`]: {
                    width: "100%",
                }
            }}>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/dG-3e4FddoE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </Box>
        </Box>
    </Container>
};