"use client";
import { dashboardColors } from "@/app/dashboard/dasboardColors"
import { Box } from "@mui/material"
import { FC } from "react"
import { useAccountSites } from "../queries/useAccountSites"
import { LoadingPage } from "../pageComponents/loadingPage"

type DashboardWrapperProps = {
    children: React.ReactNode
}

export const DashboardWrapper:FC<DashboardWrapperProps> = ({children}) => {

    const {data, refetch, isLoading} = useAccountSites();

    if (data?.success === false) {
        window.location.href = "/auth/login";
    }

    if (isLoading) {
        return <LoadingPage/>
    }

    return <Box sx={{
        display: "flex",
        backgroundColor: dashboardColors.sidebar,
        overflowX: "hidden",
        overflowY: "hidden",
        height: "100vh",
    }}>
        {children}
    </Box>

}