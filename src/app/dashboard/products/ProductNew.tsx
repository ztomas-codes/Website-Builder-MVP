'use client';
import {
    Box,
    CircularProgress,
    LinearProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import {useState} from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductForm, productForm } from '@/types/dashboard/dashboardForms';
import { useProducts } from '@/features/queries/useProducts';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';


const FormateLabelText = (text: string) => {
    // Capitalize the first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);
    // Replace _ with space
    return text.replace(/_/g, " ");
}

export const ProductNewForm = () => {

    const {data, refetch} = useProducts();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<ProductForm>({
        mode: 'onChange',
        resolver: zodResolver(productForm),
        defaultValues: {
            category_id: 1,
            visible: false,
        }
    });

    const { handleSubmit, control, setValue, getValues } = form;


    const onSubmit = async (data: ProductForm) => {
        setIsSubmitting(true);
        const response = await fetch(`/api/shop/newproduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            setIsSubmitting(false);
            setError(null);
        } else {
            const error = await response.text();
            setError(error);
            setIsSubmitting(false);
        }

        refetch();
    }

    if (!data) return <>
        <br />
        <CircularProgress />
    </>

    if (isSubmitting) return <>
        <br />
        <CircularProgress />
    </>

    return (
        <>
            <Box sx={{
                display: "flex",
            }}>
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
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: 'center',
                            gap: "20px"
                        }}>

                            <FormField
                                control={control}
                                name="cost"
                                disabled={isSubmitting}
                                render={({ field: { ref, ...field } }) => (
                                <FormItem style={{
                                    marginTop: 16
                                }}>
                                    <FormLabel/>
                                    <FormControl>
                                        <Input type='number' style={{width: "100px"}} placeholder={FormateLabelText(field.name)} {...field}/>
                                    </FormControl>
                                    <FormDescription>

                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="category_id"
                                disabled={isSubmitting}
                                render={({ field: { ref, ...field } }) => (
                                <FormItem style={{
                                    marginTop: 16
                                }}>
                                    <FormLabel/>
                                    <FormControl>
                                        <Select value={field.value + ""} onValueChange={(e)=>{
                                            setValue('category_id', parseInt(e))
                                        }}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={FormateLabelText(field.name)} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    data.categories?.map((category, index) => {
                                                        return <SelectItem key={index} value={category.id + ""}>
                                                            {category.name}
                                                        </SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>

                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="visible"
                                disabled={isSubmitting}
                                render={({ field: { ref, ...field } }) => (
                                <FormItem style={{
                                    marginTop: 16
                                }}>
                                    <FormLabel />
                                    <FormControl>
                                        <Switch checked={field.value} onClick={()=>{
                                            setValue('visible', !getValues('visible'))
                                        }}/>
                                    </FormControl>
                                    <FormDescription>

                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </Box>

                        <FormField
                            control={control}
                            name="name"
                            disabled={isSubmitting}
                            render={({ field: { ref, ...field } }) => (
                            <FormItem style={{
                                marginTop: 16
                            }}>
                                <FormLabel>
                                    {FormateLabelText(field.name)}
                                </FormLabel>
                                <FormControl>
                                    <Input style={{width: "90%"}} placeholder={FormateLabelText(field.name)} {...field}/>
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />


                        <FormField
                            control={control}
                            name="description"
                            disabled={isSubmitting}
                            render={({ field: { ref, ...field } }) => (
                            <FormItem
                            style={{
                                marginTop: 16
                            }}>
                                <FormLabel>
                                    {FormateLabelText(field.name)}
                                </FormLabel>
                                <FormControl>
                                    <Textarea style={{width: "90%"}} placeholder={FormateLabelText(field.name)} {...field}/>
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="image"
                            disabled={isSubmitting}
                            render={({ field: { ref, ...field } }) => (
                            <FormItem style={{
                                marginTop: 16
                            }}>
                                <FormLabel>
                                    {FormateLabelText(field.name)}
                                </FormLabel>
                                <FormControl>
                                    <Input style={{width: "90%"}} placeholder={FormateLabelText(field.name)} {...field}/>
                                </FormControl>
                                <FormDescription>

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting}>Save
                            {isSubmitting && <CircularProgress size={16} sx={{ marginLeft: 1 }} />}
                        </Button>
                    </form>
                </Form>
            </Box>
        </>
    );
}
