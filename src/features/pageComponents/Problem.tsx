import { Box, Container, Typography } from "@mui/material"
import colors, { BREAKPOINT } from "../colors"

import Image from "next/image";
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import StoreIcon from '@mui/icons-material/Store';

export const Problem = () => 
{

    const iconStyle = {
        color: colors.darkRed,
        fontSize: "3rem",
        mr: "1rem",
    }

    const features = [
        {
            name : "Page Editor",
            description: "Edit your website with a simple drag and drop interface. No coding required!",
            icon: <FormatShapesIcon style={iconStyle} />
        },
        {
            name: "Online Store",
            description: "Sell your products online with our easy to use online store. Add products, set prices, and start selling!",
            icon: <StoreIcon style={iconStyle} />
        },
        {
            name: "See your Orders",
            description: "View all your orders in one place. See who has bought what and when.",
            icon: <BackupTableIcon style={iconStyle} />
        },
        {
            name: "See your customers",
            description: "View all your customers in one place. See who has bought what and when.",
            icon: <Diversity1Icon style={iconStyle} />
        },
        {
            name: "Email Marketing",
            description: "Send emails to your customers to keep them engaged and coming back for more.",
            icon: <MarkEmailReadIcon style={iconStyle} />
        }
    ]

    const Style = {
        color: colors.white,
        lineHeight: "2em",
        fontSize: "1.2em",
        mt: "1em",
    };

    return <Container sx={{
        maxWidth: "1300px !important",
    }} > 
        <Box sx={{
            [`@media (max-width: ${BREAKPOINT})`]: {
                display: "none",
            }
        }}>
        <Image src="/blob-haikei.svg" width="1000" height="500" alt="Problem" style={{
            position: "absolute",
            zIndex: -1,
            left: 0,
            width: "100%",
            objectFit: "cover",
        }}  />
        </Box>
        <Typography sx={{
            typography: "h1",
            fontSize: "4rem",
            fontWeight: "bold",
            color: colors.white,
            mb: "2rem",
        }}>
            Features
        </Typography>
        <Box sx={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
        }}>
            {features.map((feature, index) => {
                return <Box key={index} sx={{
                    gap: "2rem",
                    mt: "2rem",
                    backgroundColor: 'black',
                    alignItems: "center",
                    padding: "2rem",
                    width: "30%",
                    borderRadius: "1rem",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    ['&:hover']: {
                        transform: "scale(1.1)",
                    },
                    [`@media (max-width: 1000px)`]: {
                        width: "100%",
                    }
                }}>
                    <Box sx={{
                        display: "flex",
                    }}>
                        {feature.icon}
                        <Typography sx={{
                            typography: "h2",
                            fontSize: "2rem",
                            fontWeight: "bold",
                            color: colors.white,
                            marginLeft: "1rem",
                        }}>
                            {feature.name}
                        </Typography>
                    </Box>
                        <Typography sx={Style}>
                            {feature.description}
                        </Typography>
                </Box>
            })
            }
        </Box>
    </Container>
}