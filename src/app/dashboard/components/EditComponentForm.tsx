import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Category, Component, useComponentsList } from "@/features/queries/useComponentsList";
import { componentForm, ComponentForm } from "@/types/dashboard/dashboardForms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ButtonBase, Typography } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";

export const FormateLabelText = (text: string) => {
    text = text.charAt(0).toUpperCase() + text.slice(1);
    return text.replace(/_/g, " ");
}

type EditComponentForm = {

    component?: Component;
    categories: Category[];
}


export const EditComponentForm:FC<EditComponentForm> = ({component, categories}) => {


    const {refetch} = useComponentsList();

    const form = useForm<ComponentForm>({
        mode: 'onChange',
        resolver: zodResolver(componentForm),
        defaultValues: {
            ...component,
            categories: component?.categories == "Not an product type component" 
            ? "" : component?.categories
        }
    });

    const { control, handleSubmit, formState: { isSubmitting }} = form;

    const onSubmit = async (data: ComponentForm) => {
        toast({
            title: 'Saving',
            description: 'Saving component'
        });


        const response = await fetch(`/api/shop/components/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                id: component?.id,
                categories: data.categories == "Not an product type component" ? "" : data.categories
            })
        });

        if (response.ok) {
            toast({
                title: 'Success',
                description: 'Component saved'
            });
        } else {
            const error = await response.text();
            toast({
                title: 'Error',
                description: error,
            })
        }

        refetch();
    }

    return <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
                control={control}
                name="name"
                disabled={isSubmitting}
                render={({ field: { ref, ...field } }) => (
                <FormItem style={{
                    marginTop: 16
                }}>
                    <FormLabel>
                        <Typography sx={{color: 'white'}}>
                            {FormateLabelText(field.name)}
                        </Typography>
                    </FormLabel>
                    <FormControl>
                        <Input type='string' style={{width: "90%"}} placeholder={FormateLabelText(field.name)} {...field}/>
                    </FormControl>
                    <FormDescription>
                        Enter the name of the page
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            {component?.type === 'Product' && <FormField
                control={control}
                name="categories"
                disabled={isSubmitting}
                render={({ field: { ref, ...field } }) => (
                <FormItem style={{
                    marginTop: 16
                }}>
                    <FormLabel>
                        <Typography sx={{color: 'white'}}>
                            Add product categories to the component by clicking on the buttons below
                        </Typography>
                        {
                            categories.map((cat, index) => {
                                return <ButtonBase key={index} sx={{
                                    color: 'black',
                                    background: 'white',
                                    borderRadius: 5,
                                    p: '5px 10px',
                                    fontWeight: 'bold',
                                    mr: 2,
                                    mt: 2,
                                }} onClick={() => {
                                    if (field.value == undefined) return;
                                    const categories = field.value.split(' ');
                                    if (field.value.includes(cat.id + "")) return;
                                    categories.push(cat.id + "");
                                    field.onChange(categories.join(' ').trim());
                                }}>
                                    {cat.name}
                                </ButtonBase>
                            })
                        }
                    </FormLabel>
                    <FormControl>
                        <Box>
                            {field.value != undefined && field.value.length > 0 && field.value.split(' ').map((cat, index) => {
                                return <Box key={index} sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    borderBottom: '1px solid rgb(255, 255, 255, 0.2)',
                                    padding: 1,
                                    mt: 2,
                                }}>
                                    <Typography>{
                                        categories.find((c) => c.id == parseInt(cat))?.name
                                    }</Typography>
                                    <ButtonBase sx={{
                                        color: 'black',
                                        background: 'white',
                                        borderRadius: 5,
                                        p: '5px 10px',
                                        fontWeight: 'bold',
                                    }} onClick={() => {
                                        if (field.value == undefined) return;
                                        const categories = field.value.split(' ');
                                        categories.splice(index, 1);
                                        field.onChange(categories.join(' '));
                                    }}>
                                        X
                                    </ButtonBase>
                                </Box>
                            })}
                        </Box>
                    </FormControl>
                    <FormDescription>
                        What product categories should this component render?
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />}

            <Button type="submit" disabled={isSubmitting} style={{marginTop: 16}}>
                Save
            </Button>

        </form>
    </Form>

};