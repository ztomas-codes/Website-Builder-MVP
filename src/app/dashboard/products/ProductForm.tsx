'use client';
import {
    Box,
    CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import {FC, useEffect, useState} from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import {  ProductForm, productForm } from '@/types/dashboard/dashboardForms';
import { useProducts } from '@/features/queries/useProducts';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type ProductEditFormProps = {
    id: number;
}

export const FormateLabelText = (text: string) => {
    // Capitalize the first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);
    // Replace _ with space
    return text.replace(/_/g, " ");
}

export const EditProductForm:FC<ProductEditFormProps> = ({id}) => {

    const {data, refetch} = useProducts();


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<ProductForm>({
        mode: 'onChange',
        resolver: zodResolver(productForm),
        defaultValues: {
            category_id: 1,
        }
    });

    const { handleSubmit, control, setValue, formState: { errors }, getValues } = form;

    useEffect(() => {
        setError(null);
        if (!data) return;
        const product = data.products?.find(product => product.id == id);

        if (product) {
            setValue('name', product.name);
            setValue('cost', product.cost + "");
            setValue('category_id', product.category_id);
            setValue('visible', product.visible);
            setValue('image', product.image);
            setValue('description', product.description);
        }
        else
        {
            setError('Product not found');
        }
      }, [data, id, setValue]
    );

    const onSubmit = async (data: ProductForm) => {
        toast({
            title: 'Saving product',
            description: 'Please wait...',
        });
        setIsSubmitting(true);
        const response = await fetch(`/api/shop/editproduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                name: data.name,
                cost: data.cost,
                category_id: data.category_id,
                description: data.description,
                visible: data.visible,
                image: data.image
            }),
        });

        if (response.ok) {
            setIsSubmitting(false);
            setError(null);
        } else {
            const error = await response.text();
            setError(error);
            setIsSubmitting(false);
        }

        toast({
            title: `${data.name}`,
            description: 'Has been saved successfully',
        });

        refetch();
    }

    if(error) return <>
        <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
            style={{
                height: "100%",
                minHeight: "100%",
            }}
        >
            {
                error === 'Product not found' ? <>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Product not selected or not found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Please try editing a different product by clicking on (...) on the product card
                        </p>
                    </div>
                </> :
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        {error}
                    </h3>
                <p className="text-sm text-muted-foreground">
                    Please try again later 
                </p>
            </div>
            }
        </div>
    </>


    if (!data) return <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }}>
        <CircularProgress />
    </Box>


    return (
        <>
            <Box sx={{
                display: "flex",
                width: "100%",
            }}>
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
                                    <Input placeholder={FormateLabelText(field.name)} {...field}/>
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
                                    <Textarea style={{width: "500px"}} placeholder={FormateLabelText(field.name)} {...field}/>
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
                                    <Input style={{width: "500px"}} placeholder={FormateLabelText(field.name)} {...field}/>
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

