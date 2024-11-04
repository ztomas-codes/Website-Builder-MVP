"use client";
import { Box, ButtonBase, Typography } from "@mui/material"
import Image from "next/image"
import { FC, useEffect, useState } from "react";
import SimCardAlertIcon from '@mui/icons-material/SimCardAlert';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';

type SidebarProps = {
    page: string;
}

import Link from "next/link";
import { useAccountSites } from "../queries/useAccountSites";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserInfo } from "../queries/useUserInfo";
import { useProducts } from "../queries/useProducts";
import { usePages } from "../queries/usePages";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useOrdersList } from "../queries/useOrdersList";
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CodeIcon from '@mui/icons-material/Code';

const setCookie = (name: string, value:string, days:number) => {
    
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    if (typeof document !== 'undefined') {
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
};

export const getCookie = (name:string) => {
    if (typeof document === 'undefined') {
        return null;
    }
    const nameEQ = name + "=";
    //@ts-ignore
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export const Sidebar:FC<SidebarProps> = ({page}) => {

    const categories = [
        {
            name: "General",
            links: [
                {
                    link: "",
                    icon: <Box sx={{color: '#6B0C30'}}>
                    <DashboardIcon color="inherit"/>
                    </Box>,
                    label: "Overview"
                },
                {
                    link: "/customers",
                    icon: <Box sx={{color: '#6B0C30'}}>
                        <SupervisorAccountIcon color="inherit"/>
                    </Box>,
                    label: "Customers"
                }
            ]
        },
        {
            name: "Settings",
            links: [
                {
                    link: "/important",
                    icon: <Box sx={{color: '#6B0C30'}}>
                        <SimCardAlertIcon color="inherit"/>
                    </Box>,
                    label: "Settings"
                },
                {
                    link: "/products",
                    icon: <Box sx={{color: '#6B0C30'}}>
                        <InventoryIcon color="inherit"/>
                    </Box>,
                    label: "Products"
                },
            ]
        },
        {
            name: "Adv.. Settings",
            links: [
                {
                    link: "/components",
                    icon: <Box sx={{color: '#6B0C30'}}>
                        <SettingsInputComponentIcon color="inherit"/>
                    </Box>,
                    label: "Components"
                },
                {
                    link: "/pages",
                    icon: <Box sx={{color: '#6B0C30' }}>
                        <AutoStoriesIcon color="inherit"/>
                    </Box>,
                    label: "All Pages"
                },
                {
                    link: "/files",
                    icon: <Box sx={{color: '#6B0C30' }}>
                        <CodeIcon color="inherit"/>
                    </Box>,
                    label: "Site Files"
                }
            ]
        },
    ]

    const {data, refetch} = useAccountSites();
    const {refetch: refetchSites, data: sitesData} = useUserInfo();
    const {refetch: refetchProducts} = useProducts();
    const {refetch: refetchPages} = usePages();
    const {refetch: refetchOrders} = useOrdersList();

    useEffect(() => {
        refetch();
        refetchSites();
        refetchProducts();
        refetchPages();
        refetchOrders();
    }, []);

    const [site, setSite] = useState(getCookie('site') || '');

    return <aside className="fixed inset-y-0 left-0 z-10 hidden w-50 flex-col border-r bg-background sm:flex" style={{
        width: '150px',
    }}>
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5" style={{
                width: '100%',
                height: '100vh',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}>
                <a href={"/"}>
                    <Image src={"/logo.png"} width={100} height={100} alt="Logo"></Image>
                </a>
                <Select value={site} onValueChange={(e)=>{
                    setSite(e);
                    setCookie('site', e, 10);
                    refetchSites();
                    refetchProducts();
                    refetchPages();
                    refetchOrders();
                }} >
                    <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                        {data?.sites.map((site, index) => {
                            return <SelectItem key={index} value={site.id + ""}>
                                <Typography variant="body1">{site.name}</Typography>
                            </SelectItem>
                        })}
                    </SelectContent>
                </Select>

                {sitesData?.siteInfo && categories.map((category, index) => {
                    return <Box key={index} className="flex flex-col items-center gap-2">
                        <Typography style={{
                            marginTop: '20px',
                            fontSize: '1rem',
                            color: 'white',
                            fontWeight: 'bold',
                        }}>{category.name}</Typography>
                        <hr style={{
                            width: '100%',
                            backgroundColor: 'rgb(50,50,50)',
                            height: '1px',
                            border: 'none',
                        }} />
                        {category.links.map((link, index) => {
                            return <Link href={"/dashboard" + link.link} key={index}>
                                <ButtonBase key={index} className="p-3 rounded-lg" style={{
                                    backgroundColor: page === link.label ? 'rgb(100,0,0,0.3)' : "transparent",
                                    padding: '10px',
                                    borderRadius: '10px',
                                }}>
                                    {link.icon}
                                    <Typography variant="body1" style={{
                                        color: 'white',
                                        fontWeight: page === link.label ? 'bold' : 'normal',
                                        marginLeft: '10px',
                                    }}>{link.label}</Typography>
                                </ButtonBase>
                            </Link>
                        })}
                    </Box>
                })}
            </nav>
        </aside>

}