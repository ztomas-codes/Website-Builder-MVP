"use client";

import { DashboardWrapper } from "@/features/dashboard/DashboardWrapper";
import { MainContent } from "@/features/dashboard/MainContent";
import { Sidebar } from "@/features/dashboard/Sidebar";
import { Component, useComponentsList } from "@/features/queries/useComponentsList";
import { Box, ButtonBase, CircularProgress, Typography } from "@mui/material";
import { dashboardColors } from "../dasboardColors";
import { LanguagesIcon } from "lucide-react";
import { useState } from "react";
import { PageFormComponent } from "../pages/pageForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditComponentForm } from "@/app/dashboard/components/EditComponentForm";
import FileOpenIcon from '@mui/icons-material/FileOpen';

export default function Home() {

    const {data, refetch} = useComponentsList();
    const [component, setComponent] = useState<Component>();
    const [open, setOpen] = useState(false);
    const [reallyOpen, setReallyOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const Delete = async (id: number) => {
        setIsSubmitting(true);
        const res = await fetch("/api/shop/componentsdelete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
        });
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                refetch();
            }
            setIsSubmitting(false);

        }
    }

    return <>
        <DashboardWrapper>
            <Sidebar page="Components"  />
            <MainContent label="Overview">
            <Box sx={{
                display: "flex",
            }}>
            {
                    ["Product", "Element"].map((type) => {
                        return <ButtonBase key={type} sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "30px",
                            background: dashboardColors.contentBackground,
                            boxShadow: 'var(--ds-shadow-border),0 4px 6px rgba(0,0,0,.04)',
                            borderRadius: '20px',
                            margin: "10px",
                        }} onClick={async () => {
                            setIsSubmitting(true);
                            const res = await fetch("/api/shop/componentsnew", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    type: type,
                                }),
                            });
                            if (res.ok) {
                                const data = await res.json();
                                if (data.success) {
                                    refetch();
                                }
                                setIsSubmitting(false);
                            }
                        }}>
                            <LanguagesIcon size={64} />
                            <Typography variant="h6">New <br /> {type} <br /> Component</Typography>
                        </ButtonBase>
                    })
                }
            </Box>
            <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                }}>


                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent> 
                        <DialogHeader>
                            <DialogTitle>Editing settings of component: <strong>{component?.name}</strong></DialogTitle>
                            <DialogDescription>
                                You can edit here only few settings of the component. For changing the html code, please use the editor.
                            </DialogDescription>
                            <ButtonBase onClick={() => setReallyOpen(true)} sx={{
                                background: dashboardColors.darkRed,
                                color: dashboardColors.white,
                                padding: "6px",
                                borderRadius: "5px",
                                width: "fit-content",
                            }}>
                                <Typography variant="h6">Delete</Typography>
                            </ButtonBase>
                            <Typography variant="h6">Component type is 
                                <strong style={{
                                    color: dashboardColors.darkRed,
                                    padding: "5px",
                                }}>{component?.type}</strong>
                            </Typography>
                            <EditComponentForm component={component} categories={data?.categories || []} />
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Dialog open={reallyOpen} onOpenChange={setReallyOpen}>
                    <DialogContent> 
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this component?</DialogTitle>
                            <DialogDescription>
                                You are about to delete the component: <strong>{component?.name}</strong>
                            </DialogDescription>
                            <ButtonBase onClick={() => {
                                Delete(component?.id || -1);
                                setReallyOpen(false);
                                setOpen(false);
                            }} sx={{
                                background: dashboardColors.darkRed,
                                color: dashboardColors.white,
                                padding: "6px",
                                borderRadius: "5px",
                                width: "fit-content",
                            }}>
                                <Typography variant="h6">Yes, delete</Typography>
                            </ButtonBase>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                {
                    data && data.components.map((component) => {
                        return <Box key={component.id} sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "30px",
                        }}>
                             <ButtonBase onClick={()=>{
                                setComponent(component);
                                setOpen(true);
                             }} className="border"  sx={{
                                width: "300px",
                                padding: "10px",
                                background: dashboardColors.contentBackground,
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: 'var(--ds-shadow-border),0 4px 6px rgba(0,0,0,.04)',
                                borderRadius: '20px 0px 0px 20px',
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    alignItems: "start",
                                }} >
                                    <Typography variant="h6">{component.name}</Typography>
                                    <Typography variant="body2" sx={{
                                        background: dashboardColors.darkRed,
                                        color: dashboardColors.white,
                                        padding: "5px",
                                        borderRadius: "5px",
                                    }}>{component.type}</Typography>
                                </Box>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "left",
                                }}>
                                    <Box sx={{
                                        display: "flex"
                                    }}>
                                        {!component.categories ? "Doesn't have categories" : component.categories.split(' ').map((category) => {
                                            const categ = data.categories.find((cat) => cat.id === parseInt(category))?.name;
                                            return <Typography key={category} variant="body2" sx={{
                                                background: dashboardColors.darkRed,
                                                color: dashboardColors.white,
                                                padding: "5px",
                                                borderRadius: "5px",
                                                marginRight: "5px",
                                            }}>{categ}</Typography>
                                        })}
                                    </Box>
                                </Box>
                            </ButtonBase>
                            <ButtonBase href={
                                `${data.domain}/edit?id=${component.id}&type=component&session=${data.session}`
                            } target="_blank" sx={{
                                background: '#6B0C30',
                                padding: "20px",
                                borderRadius: '0px 20px 20px 0px',
                            }}>
                                <FileOpenIcon />
                            </ButtonBase>
                        </Box>
                    })
                }

                </Box>
                {
                    isSubmitting && <Box sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <CircularProgress />
                    </Box>
                }
            </MainContent>
        </DashboardWrapper>
    </>
}