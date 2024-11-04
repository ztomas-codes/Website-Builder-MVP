'use client';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    FormHelperText,
    MenuItem,
    TextField,
    Typography
} from '@mui/material';
import Image from "next/image";
import {useState} from "react";
import { userRegisterSchema, UserRegisterSchema} from "@/types/account/account";
import { zodResolver } from '@hookform/resolvers/zod';
import colors, {BREAKPOINT} from "@/features/colors";
import Link from "next/link";
import { Controller, useForm } from 'react-hook-form';
import {LoadingPage} from "@/features/pageComponents/loadingPage";
import {ThankYouPage} from "@/app/auth/register/ThankYouPage";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormateLabelText } from '@/app/dashboard/components/EditComponentForm';
import { Input } from '@/components/ui/input';

export default function Home() {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const form = useForm<UserRegisterSchema>({
        mode: 'onChange',
        resolver: zodResolver(userRegisterSchema),
    });

    const { control, handleSubmit, formState: { errors } } = form;

    const onSubmit = async (data: UserRegisterSchema) => {
        //fetch data at /api/account/register
        await setIsSubmitting(true);
        fetch('/api/account/register', {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then(data => {
                if (data.success)
                {
                    setIsSuccess(true);
                }
                else
                {
                    setError(data.error);
                }
                setIsSubmitting(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setIsSubmitting(false);
            });
    }

    if(isSuccess) return <ThankYouPage />

    if (isSubmitting) return <LoadingPage />

    return (
        <>
            <Container sx={{
                maxWidth: "1300px !important",
                padding: "10px",
            }}>
                <Box sx={{marginTop: 3}}>
                    <Link href="/">
                        <Image src="/logo.png" alt="logo" width={50} height={50} style={{borderRadius: "15px"}} />
                    </Link>
                </Box>
                <Box sx={{
                    mt: 2,
                    height: '90vh',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                    <Form {...form} >
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <Box sx={{
                                padding: "20px",
                                display: "flex",
                                flexDirection: "column",
                                width: "50%",
                                borderRight: "3px solid #212121",
                                paddingRight: "10%",
                                paddingBottom: "20px",
                                paddingTop: "20px",
                                [`@media (max-width: ${BREAKPOINT})`]: {
                                    width: "95%",
                                    borderRight: "none",
                                    paddingRight: "0",
                                }
                            }}>
                                <Typography sx={{
                                    fontSize: "2rem",
                                    color: colors.lighterRed,
                                    fontWeight: 600,
                                    marginBottom: "20px",
                                }}>
                                    Welcome to Produx!
                                </Typography>
                                <Typography>
                                    Register to get started
                                </Typography>
                                {
                                    error && <FormHelperText sx={{fontSize: 15, fontWeight: 'bolder'}} error>{error}</FormHelperText>
                                }


                            <FormField
                                control={control}
                                name="firstname"
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
                                name="lastname"
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
                                name="email"
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
                                name="nickname"
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
                                name="password"
                                disabled={isSubmitting}
                                render={({ field: { ref, ...field } }) => (
                                <FormItem style={{
                                    marginTop: 16
                                }}>
                                    <FormLabel>
                                        {FormateLabelText(field.name)}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder={FormateLabelText(field.name)} {...field}/>
                                    </FormControl>
                                    <FormDescription>

                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />


                                <Button style={{ marginTop: 16, background: colors.darkRed }} type="submit" variant="contained" fullWidth>
                                    Zaregistrovat se
                                </Button>
                                <Typography sx={{mt:2}}>
                                    Do you already own account? {' '}
                                    <Link style={{fontWeight: 'bolder', color: colors.lighterRed,}} href="/auth/login">
                                        Log in
                                    </Link>
                                </Typography>
                            </Box>
                        </form>
                    </Form>
                </Box>

            </Container>
        </>
    );
}
