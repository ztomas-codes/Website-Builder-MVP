'use client';
import {Box, Button, ButtonBase, Menu, MenuItem, Typography} from "@mui/material"
import colors from "../colors"
import Link from "next/link";
import {useAccountInfoQuery} from "@/features/queries/useAccountInfo";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import {useState} from "react";

export const AccountInfo = () => {

    const {data : session , isLoading} = useAccountInfoQuery();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl || false);


    return <>
        {
            session?.success ? (
                <ButtonBase
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)}
                    sx={{
                    display: "flex",
                    justifyContent: "center",
                }}>
                    <AccountCircleIcon sx={{ width: '1.7em', height: '1.7em', flexDirection: 'column' }} />
                    <Typography sx={{
                        textAlign: "center",
                        color: colors.lighterRed,
                        fontSize: "1rem",
                        fontWeight: 600,
                        padding: "10px 5px",
                    }}>
                        {session.user.app_user.firstname} {' '}
                        {session.user.app_user.lastname}
                    </Typography>
                    <KeyboardArrowDownTwoToneIcon
                        sx={{ width: '1.5em', height: '1.5em', flexDirection: 'column' }} />
                </ButtonBase>
                ) : (
                <Link href="/auth/login">
                    <Button variant="contained" sx={{
                        backgroundColor: 'transparent',
                        color: "white",
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: "15px",
                        padding: "10px 20px",
                        border: `${colors.darkRed} 2px solid`,
                        textTransform: "none",
                        '&:hover': {
                            backgroundColor: colors.darkRed,
                        }

                    }}>
                        Log in
                    </Button>
                </Link>
            )
        }
        <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            sx={{
                position: 'absolute',
                '& .MuiMenu-paper': { backgroundColor: 'black', color: colors.lighterRed, width: 'fit-content' },
            }}
        >
            <Box sx={{ p: 2 }}>

            </Box>
            <Link href="/dashboard">
                <MenuItem onClick={handleClose}>Dashboard</MenuItem>
            </Link>
        </Menu>
    </>
}