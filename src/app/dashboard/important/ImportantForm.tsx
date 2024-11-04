'use client';
import { useForm } from 'react-hook-form';
import {useEffect, useState} from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import {LoadingPage} from "@/features/pageComponents/loadingPage";
import { MainInfo, mainInfo } from '@/types/dashboard/dashboardForms';
import { useUserInfo } from '@/features/queries/useUserInfo';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { Box } from '@mui/material';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FormateLabelText = (text: string) => {
    // Capitalize the first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);
    // Replace _ with space
    return text.replace(/_/g, " ");
}

export function ImportantForm() {



    const { data, isLoading, isError } = useUserInfo();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<MainInfo>({
        mode: 'onChange',
        resolver: zodResolver(mainInfo),
    });

    const { setValue, control, handleSubmit } = form;

    useEffect(() => {
        if (!data) return;
        if (data.siteInfo) {
            setValue('domain', data.siteInfo.domain);
            setValue('currency', data.siteInfo.currency);
            setValue('smtp_host', data.siteInfo.smtp_host);
            setValue('smtp_port', data.siteInfo.smtp_port + "");
            setValue('smtp_secure', data.siteInfo.smtp_secure + "");
            setValue('smtp_user', data.siteInfo.smtp_user);
            setValue('smtp_pass', data.siteInfo.smtp_pass);
            setValue('stripe', data.siteInfo.stripeKey);
        }
        else
        {
            setError('No data found');
        }
    }, [setValue, data]);

    const onSubmit = async (data: MainInfo) => {
        setIsSubmitting(true);
        setError(null);

        toast({
            title: "Settings",
            description: "Settings were sent to the server",
          });

        const response = await fetch('/api/account/saveImportantSettings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                domain: data.domain,
                currency: data.currency,
                smtp_host: data.smtp_host,
                smtp_port: data.smtp_port,
                smtp_secure: data.smtp_secure,
                smtp_user: data.smtp_user,
                smtp_pass: data.smtp_pass,
                stripe: data.stripe,
            }),
        });

        const json = await response.json() as { success: boolean, error: string };
        if (response.ok) {
            //@ts-ignore
            if (!json.success)
            {
                toast({
                    title: "Settings",
                    description: json.error,
                });
                setIsSubmitting(false);
                setError(json.error);
            }
            else
            {
                setIsSubmitting(false);
                setError(null);
                toast({
                    title: "Settings",
                    description: "Important settings for your shop have been saved",
                  });
            }

        } else {
            const error = await response.json();
            setError(error.error);
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Box sx={{
                display: "flex",
            }}>
                <Form {...form}>
                {
                    isLoading ? <LoadingPage /> 
                    : 
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1 style={{
                            fontSize: "1.5rem",
                            marginBottom: "1rem",
                            marginTop: "1rem",
                            fontWeight: 800
                        }}>Important settings</h1>
                        <Tabs defaultValue="shop" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="shop">Shop settings</TabsTrigger>
                            <TabsTrigger value="mailer">Mailer Settings</TabsTrigger>
                        </TabsList>
                        <TabsContent value="shop">
                        <FormField
                            control={control}
                            name="domain"
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
                                    Domain of your website
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="currency"
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
                                    Currency, for example $, €, £, Kč
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="stripe"
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
                                    Stripe key
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        </TabsContent>
                        <TabsContent value="mailer">
                        <FormField
                            control={control}
                            name="smtp_host"
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
                                    Currency, for example $, €, £, Kč
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="smtp_user"
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
                                    Currency, for example $, €, £, Kč
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="smtp_pass"
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
                                    Currency, for example $, €, £, Kč
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />


                        <FormField
                            control={control}
                            name="smtp_port"
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
                                    Currency, for example $, €, £, Kč
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />


                        <FormField
                            control={control}
                            name="smtp_secure"
                            disabled={isSubmitting}
                            render={({ field: { ref, ...field } }) => (
                            <FormItem style={{
                                marginTop: 16
                            }}>
                                <FormLabel>
                                    {FormateLabelText(field.name)}
                                </FormLabel>
                                <FormControl>
                                    <Switch {...field} checked={Boolean(field.value)} />
                                </FormControl>
                                <FormDescription>
                                    Currency, for example $, €, £, Kč
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        </TabsContent>
                        </Tabs>
                        <Button type="submit" disabled={isSubmitting} style={{marginTop: 16}}>Save</Button>
                    </form>
                }
                </Form>
            </Box>
        </>
    );
}
