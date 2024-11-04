'use client';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardWrapper } from "@/features/dashboard/DashboardWrapper";
import { MainContent } from "@/features/dashboard/MainContent";
import { Sidebar } from "@/features/dashboard/Sidebar";
import { Box, ButtonBase, CircularProgress, Typography } from "@mui/material";
import { dashboardColors } from "../dasboardColors";
import { File, useFilesList } from "@/features/queries/useFilesList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { FileFormComponent } from "./FileForm";
import { set } from "zod";


const FileComponent = ({
    file,
    onClick,
}: {
    file: File,
    onClick?: () => void,
}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {refetch, isRefetching} = useFilesList();

    const deleteFile = async (id: number) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/shop/filesdelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            });
            const json = await response.json();
            if (json.success) {
                refetch();
                setIsSubmitting(false);
            } else {
                console.error(json.error);
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error(e);
            setIsSubmitting(false);
        }
    }

    if (isSubmitting || isRefetching) {
        return <Box sx={{
            marginRight: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <CircularProgress />
        </Box>
    }

    return <Box sx={{
        marginRight: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Box sx={{
            width: "50%",
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            margin: "5px",
            transition: "all 0.3s ease-in-out",
            cursor: "pointer",
            "&:hover": {
                transform: "scale(1.2)",
                backgroundColor: "rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,255,255,0.5)"
            }
        }}>
            <Typography>
                {file.name}
            </Typography>
            <Box sx={{
                display: "flex",
                gap: "1rem",
            }}>
                <Typography sx={{
                    backgroundColor: dashboardColors.darkRed,
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                }}>
                    {file.type}
                </Typography>
                <Button onClick={()=>
                    deleteFile(file.id)
                }>
                    Delete
                </Button>
                <Button onClick={()=>
                    onClick && onClick()
                }>
                    Edit
                </Button>
            </Box>
        </Box>
    </Box>
}
export default function Home() {

    const {data, refetch} = useFilesList();
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const newFile = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/shop/filesnew', {
                method: 'POST',
            });
            const json = await response.json();
            if (json.success) {
                refetch();
                setIsSubmitting(false);
            } else {
                console.error(json.error);
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error(e);
            setIsSubmitting(false);
        }
    }

    return <DashboardWrapper>
                <Sidebar page="Site Files"/>
                <MainContent label={"Site Files"}>


                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogContent style={{
                        maxWidth: "1000px"
                    }}>
                        <DialogHeader>
                        <DialogTitle>
                            <FileFormComponent file={selectedFile || {} as File} />
                        </DialogTitle>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                    <Card style={{
                        marginBottom: "1rem"
                    }}>
                        <CardHeader>
                            <CardTitle>
                                Site Files
                            </CardTitle>
                        </CardHeader>
                        <CardFooter>
                            <Button onClick={newFile}>
                                New File
                            </Button>
                        </CardFooter>
                    </Card>


                    {
                        data?.files.sort(
                            (a, b) => {
                                if (a.type === b.type) {
                                    return a.order - b.order;
                                }
                                return a.type.localeCompare(b.type);
                            }
                        ).map((file, index) => {
                            return <FileComponent key={index} onClick={()=>{
                                setOpen(true);
                                setSelectedFile(file);
                            }} file={file} />
                        })
                    }

                    {isSubmitting && <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "1rem"
                    }}>
                        <CircularProgress />
                    </Box>
                    }


                </MainContent>
            </DashboardWrapper>
}