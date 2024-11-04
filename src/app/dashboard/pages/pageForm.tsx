import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Page, usePages } from "@/features/queries/usePages";
import { pageForm, PageForm } from "@/types/dashboard/dashboardForms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";

export const FormateLabelText = (text: string) => {
    // Capitalize the first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);
    // Replace _ with space
    return text.replace(/_/g, " ");
}

type PageFormProps = {

    page?: Page;
}

export const PageFormComponent:FC<PageFormProps> = ({page}) => {


    const {refetch} = usePages();

    const form = useForm<PageForm>({
        mode: 'onChange',
        resolver: zodResolver(pageForm),
        defaultValues: {
            ...page,
            description: page?.description || "",
        }
    });

    const { control, handleSubmit, formState: { isSubmitting }} = form;

    const onSubmit = async (data: PageForm) => {
        toast({
            title: 'Saving',
            description: 'Saving page'
        });
        const response = await fetch(`/api/shop/editpage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            toast({
                title: 'Success',
                description: 'Page saved'
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

            <FormField
                control={control}
                name="slug"
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
                        Enter the slug of the page
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
                <FormItem style={{
                    marginTop: 16
                }}>
                    <FormLabel>
                        <Typography sx={{color: 'white'}}>
                            {FormateLabelText(field.name)}
                        </Typography>
                    </FormLabel>
                    <FormControl>
                        <Textarea style={{width: "90%"}} placeholder={FormateLabelText(field.name)} {...field}/>
                    </FormControl>
                    <FormDescription>
                        Enter the description of the page
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button type="submit" disabled={isSubmitting} style={{marginTop: 16}}>
                Save
            </Button>

        </form>
    </Form>

};