"use client";
import { getCookie, Sidebar } from "@/features/dashboard/Sidebar";
import { DashboardWrapper } from "@/features/dashboard/DashboardWrapper";
import { MainContent } from "@/features/dashboard/MainContent";
import { Box, ButtonBase, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { Page, usePages } from "@/features/queries/usePages";
import { dashboardColors } from "../dasboardColors";
import LanguageIcon from '@mui/icons-material/Language';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageFormComponent } from "./pageForm";
import { Button } from "@/components/ui/button";


export default function Home() {

    const {data, refetch} = usePages();
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState<Page>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reallyDelete, setReallyDelete] = useState(false);

    const newPage = async () => {

        setIsSubmitting(true);

        const session = getCookie("APP_SESSION");
        const site = getCookie("site");

        const response = await fetch("/api/shop/newpage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: ""
        });


        if (response.ok) {
            refetch();
            setIsSubmitting(false);
        }
        else
        {
            alert("Error creating new page");
            setIsSubmitting(false);
        }
    }

    const deletePage = async () => {

        setIsSubmitting(true);

        const session = getCookie("APP_SESSION");
        const site = getCookie("site");

        const response = await fetch("/api/shop/deletepage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: page?.id
            })
        });

        if (response.ok) {
            refetch();
            setIsSubmitting(false);
        }
        else
        {
            alert("Error deleting page");
            setIsSubmitting(false);
        }
    }
    return <DashboardWrapper>
            <Sidebar page="All Pages"/>
            <MainContent label={"Pages"}>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent> 
                        <DialogHeader>
                            <DialogTitle>Editing settings of page {page?.name} </DialogTitle>
                            <DialogDescription>
                                You can edit here only the name and description of the page. For editing the content of the page, please go to the page editor.
                                <ButtonBase onClick={()=> {
                                    setReallyDelete(true);
                                }} sx={{
                                    background: dashboardColors.darkRed,
                                    padding: "10px",
                                    borderRadius: '20px',
                                    color: dashboardColors.white,
                                    mt: "20px",
                                }}> Delete Page </ButtonBase>
                                <PageFormComponent page={page}/>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Dialog open={reallyDelete} onOpenChange={setReallyDelete}>
                    <DialogContent> 
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this page?</DialogTitle>
                            <DialogDescription>
                                This action is irreversible.
                                <Button onClick={()=>
                                    {
                                        deletePage();
                                        setReallyDelete(false);
                                        setOpen(false);
                                    }
                                }>
                                    Yes
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    padding: "30px",
                }}>
                    {
                        isSubmitting ? <CircularProgress/> :
                        <ButtonBase onClick={newPage} sx={{
                            background: dashboardColors.darkRed,
                            padding: "20px",
                            borderRadius: '20px',
                        }}>
                            <Typography variant="h6" sx={{
                                color: dashboardColors.white,
                            }}>Create new page</Typography>
                        </ButtonBase>
                    }
                </Box>

                <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                }}>
                {
                    data && data.pages.map((page) => {
                        return <Box key={page.slug} sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "30px",
                        }}>
                             <ButtonBase onClick={()=> {
                                setPage(page);
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
                                    <Typography variant="h6">{page.name}</Typography>
                                    <Typography variant="body2" sx={{
                                        background: dashboardColors.darkRed,
                                        color: dashboardColors.white,
                                        padding: "5px",
                                        borderRadius: "5px",
                                    }}>{page.slug}</Typography>
                                </Box>
                                <Box sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "left",
                                }}>
                                    <Typography>{page.description || '-'}</Typography>
                                </Box>
                            </ButtonBase>
                            <ButtonBase href={
                                `${data.domain}/edit?id=${page.id}&type=page&session=${data.session}`
                            } target="_blank" sx={{
                                background: '#6B0C30',
                                padding: "20px",
                                borderRadius: '0px 20px 20px 0px',
                            }}>
                                <LanguageIcon/>
                            </ButtonBase>
                        </Box>
                    })
                }
                </Box>

            </MainContent>
        </DashboardWrapper>
}