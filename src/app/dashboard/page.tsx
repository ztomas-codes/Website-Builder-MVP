"use client";

import { DashboardWrapper } from "@/features/dashboard/DashboardWrapper";
import { MainContent } from "@/features/dashboard/MainContent";
import { Sidebar } from "@/features/dashboard/Sidebar";
import Orders from "@/features/dashboard/UIComponents/Orders";
import Recap from "@/features/dashboard/UIComponents/Recap";
import { Order } from "../api/account/orders/route";
import { useOrdersList } from "@/features/queries/useOrdersList";
export default function Home() {

    const {data} = useOrdersList();

    const orders = data || [];

    return <>
        <DashboardWrapper>
            <Sidebar page="Overview"  />
            <MainContent label="Overview">
                <Recap orders={orders} />
                <Orders orders={orders} />
            </MainContent>
        </DashboardWrapper>
    </>
}