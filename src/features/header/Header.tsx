'use client';

import { Box, Button, Container, Typography } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { AccountInfo } from "./AccountInfo"
import colors, { BREAKPOINT } from "../colors"
import { FC, useState } from "react"

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {useAccountInfoQuery} from "@/features/queries/useAccountInfo";

type Props = {
    actual: string
}

export const Header:FC<Props> = ({actual}) => 
{

    const {data, isLoading} = useAccountInfoQuery();
    const [toggled, setToggled] = useState(false)

    const navlinks = [
        {name: "Home", href: "/", active: false},
        
    ]

    navlinks.forEach((link) => {
        if (link.href === actual) {
            link.active = true
        }
    })

    return <>
        <Box sx={{
            p: 4,
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            position: "fixed",
            background: 'rgba(0,0,0,0.3)',
            top: 0,
            zIndex: 100,
            width: "100%",
            height: 110,
            transition: "height 0.3s",
            [`@media (max-width: ${BREAKPOINT})`]: {
                height: toggled ? "1050px" : "100px",
            }
        }}>
            <Container sx={{
                maxWidth: "1300px !important",
                padding: "0",
            }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    [`@media (max-width: ${BREAKPOINT})`]: {
                        flexDirection: "column",
                        gap: 1
                    }
                }}>
                    <Box 
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <Box sx={{display: "flex", alignItems: 'center', justifyContent: "center"
                        }}>
                            <Image src="/logo.png" alt="logo" width={55} height={55} style={{borderRadius: "15px",
                            }} />
                            <Typography variant="h1" sx={{
                                fontSize: "1.5rem",
                                fontWeight: 600,
                            }}>Produx</Typography>
                        </Box>
                        <Box sx={{
                            display: "none",
                            [`@media (max-width: ${BREAKPOINT})`]: {
                                display: "block"
                            }
                        }}>
                            {toggled
                            ?<MenuOpenIcon sx={{fontSize: "2.5rem", cursor: "pointer"}} onClick={() => setToggled(false)} /> :
                            <MenuIcon sx={{fontSize: "2.5rem", cursor: "pointer"}} onClick={() => setToggled(true)} /> 
                            }
                        </Box>
                    </Box>
                    <Box 
                        sx={{
                            display:'flex', 
                            mt: 1.8,
                            [`@media (max-width: ${BREAKPOINT})`]: {
                                flexDirection: "column",
                                gap: 1
                            }
                        }}>
                        {navlinks.map((link) => (
                            <Link href={link.href} key={link.name}>
                                <Typography variant="h2" sx={{
                                    fontSize: "1.1rem",
                                    fontWeight: 800,
                                    ml: 2,
                                    paddingBottom: 1,
                                    px: 1,
                                    cursor: "pointer",
                                    color: link.active ? colors.lighterRed : '#FFF',
                                    borderBottom: link.active ? `3px solid ${colors.lighterRed}` : "none",
                                    transition: "color 0.3s",
                                    ['&:hover']: {
                                        color: colors.lighterRed,
                                    }
                                }}>{link.name}</Typography>
                            </Link>
                        ))}
                    </Box>
                    <Box 
                        sx={{
                            display: "flex",
                            gap:2,
                            [`@media (max-width: ${BREAKPOINT})`]: {
                                flexDirection: "column",
                                gap: 1
                            }
                        }}>
                        <AccountInfo />
                        <Button href="https://discord.gg/3KPr3zNCqk" variant="contained" sx={{
                            backgroundColor: colors.darkRed,
                            color: "white",
                            fontSize: "1rem",
                            fontWeight: 600,
                            borderRadius: "15px",
                            padding: "10px 20px",
                            textTransform: "none",
                            height: "fit-content",
                            border: `${colors.darkRed} 2px solid`,
                            '&:hover': {
                                backgroundColor: 'transparent',
                                border: `${colors.darkRed} 2px solid`,
                            }
                        }}>
                            Start beta on Discord
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    </>
}