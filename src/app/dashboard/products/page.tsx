"use client";
import { Sidebar } from "@/features/dashboard/Sidebar";
import { DashboardWrapper } from "@/features/dashboard/DashboardWrapper";
import { MainContent } from "@/features/dashboard/MainContent";
import { useProducts } from "@/features/queries/useProducts";
import { Box, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { EditProductForm } from "./ProductForm";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductNewForm } from "./ProductNew";



export default function Home() {


    const {data, refetch} = useProducts();
    useEffect(() => {
        refetch();
    });


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(13);

    const deleteProduct = async (id: number) => {
        setIsSubmitting(true);
        const response = await fetch(`/api/shop/deleteproduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id
            })
        });

        if (response.ok) {
            refetch();
        } else {
            const error = await response.text();
        }
        setIsSubmitting(false);
        refetch();
    }


    return <DashboardWrapper>
            <Sidebar page="Products"/>
            <MainContent label={"Products settings"}>
                {
                    isSubmitting && <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 100,
                    }}>
                        <LinearProgress color="secondary" />
                    </Box>
                }
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "50%",
                    gap: "10%"
                }}>

                <Card style={{
                    marginLeft: "5%",
                    marginTop: "20px",
                    minWidth: "90%",
                    height: "95vh",
                }}>
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>
                            Manage your products and view their sales performance.
                            <br />
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button>Add product</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Creating new product..</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <ProductNewForm />
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardDescription>
                    </CardHeader>
                    <CardContent style={{
                        height: "80%",
                        overflow: "scroll",
                    }}>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.products && data.products.map((product, index) => {
                                    return <TableRow key={index} style={{cursor: "pointer"}} onClick={()=> setSelectedProduct(product.id)}>
                                    <TableCell className="hidden sm:table-cell">
                                        <img
                                        alt="Product image"
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={`${product.image}`}
                                        width="64"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {product.name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.visible ? 'Visible' : 'Hidden'}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{product.cost}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={()=>setSelectedProduct(product.id)}>
                                                    Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={()=> deleteProduct(product.id)}>
                                                Delete
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <div className="text-xs text-muted-foreground">
                            You have <strong>{
                                data?.products ? data.products.length : 0
                            }</strong> products
                        </div>
                    </CardFooter>
                </Card>
                <Card style={{
                    marginTop: "20px",
                    height: "95vh",
                    minWidth: "90%",
                }}>
                    <CardContent style={{
                        height: "90%",
                        marginTop: "5%",
                    }}>
                        <EditProductForm id={selectedProduct} />
                    </CardContent>
                </Card>
                </Box>
            </MainContent>
        </DashboardWrapper>
}