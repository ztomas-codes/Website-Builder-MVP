"use client";
import {Box, Typography} from "@mui/material";
import { dashboardColors } from "../dasboardColors";
import { Sidebar } from "@/features/dashboard/Sidebar";
import { DashboardWrapper } from "@/features/dashboard/DashboardWrapper";
import { MainContent } from "@/features/dashboard/MainContent";
import { LineChart } from "@mui/x-charts";

import { ThemeProvider, createTheme } from '@mui/system';
import { create } from "domain";
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ImportantForm } from "./ImportantForm";



export default function Home() {

    const Numbers = [
        {
            name: "Total Orders",
            value: 100,
            icon: <ShoppingCartIcon/>,
        },
        {
            name: "Total Revenue",
            value: 100,
            icon: <MonetizationOnIcon/>,
        },
        {
            name: "Total Customers",
            value: 100,
            icon: <PeopleIcon/>,
        },
    ]

    return <DashboardWrapper>
            <Sidebar page="Settings"/>
            <MainContent label={"Important settings"}>
                <ImportantForm/>
            </MainContent>
        </DashboardWrapper>
}