import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileForm } from "@/types/dashboard/dashboardForms";
import { useForm } from "react-hook-form";
import { FormateLabelText } from "../components/EditComponentForm";
import { FC, useState } from "react";
import { File, useFilesList } from "@/features/queries/useFilesList";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircularProgress } from "@mui/material";
import { FileKey } from "lucide-react";

type Props = {
    file: File;
}

export const FileFormComponent:FC<Props> = ({file}) => {

    const {refetch} = useFilesList();

    const form = useForm<FileForm>({
        defaultValues: {
            name: file.name,
            type: file.type,
            content: file.content,
            id: file.id,
            order: file.order
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, handleSubmit } = form;

    const onSubmit = async (data: FileForm) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/shop/filesedit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const json = await response.json();
            if (json.success) {
                setIsSubmitting(false);
                refetch();
            } else {
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error(e);
        }

    }

    return <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>

            {
                isSubmitting && <CircularProgress />
            }

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
                        <Input placeholder={FormateLabelText(field.name)} {...field} />
                    </FormControl>
                    <FormDescription>
                        Name of the file
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={control}
                name="type"
                disabled={isSubmitting}
                render={({ field: { ref, ...field } }) => (
                <FormItem style={{
                    marginTop: 16
                }}>
                    <FormLabel>
                        {FormateLabelText(field.name)}
                    </FormLabel>
                    <FormControl>
                        <Select value={
                            field.value
                        }
                        onValueChange={(value) => {
                            field.onChange(value);
                        }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SCRIPT">Script</SelectItem>
                                <SelectItem value="CSS">CSS</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormDescription>
                        Type of the file
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={control}
                name="content"
                disabled={isSubmitting}
                render={({ field: { ref, ...field } }) => (
                <FormItem style={{
                    marginTop: 16
                }}>
                    <FormLabel>
                        {FormateLabelText(field.name)}
                    </FormLabel>
                    <FormControl>
                        <Textarea style={{
                            height: 200
                        }} placeholder={FormateLabelText(field.name)} {...field} />
                    </FormControl>
                    <FormDescription>
                        Content of the file
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={control}
                name="order"
                disabled={isSubmitting}
                render={({ field: { ref, ...field } }) => (
                <FormItem style={{
                    marginTop: 16
                }}>
                    <FormLabel>
                        {FormateLabelText(field.name)}
                    </FormLabel>
                    <FormControl>
                        <Input type="number" placeholder={FormateLabelText(field.name)} {...field} />
                    </FormControl>
                    <FormDescription>
                        Order of the file
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button style={{
                marginTop: 16
            }} type="submit" disabled={isSubmitting}>Edit</Button>

        </form>
    </Form>
}