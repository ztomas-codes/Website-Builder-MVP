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
import { Controller, useForm } from 'react-hook-form';
import {useState} from "react";
import {userLoginSchema, UserLoginSchema} from "@/types/account/account";
import { zodResolver } from '@hookform/resolvers/zod';
import colors, {BREAKPOINT} from "@/features/colors";
import Link from "next/link";
import {LoadingPage} from "@/features/pageComponents/loadingPage";
import {cookies} from "next/headers";
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormateLabelText } from '@/app/dashboard/components/EditComponentForm';


export default function Home() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<UserLoginSchema>({
        mode: 'onChange',
        resolver: zodResolver(userLoginSchema),
    });

    const { control, handleSubmit, formState: { errors } } = form;

    const onSubmit = async (data: UserLoginSchema) => {
        setIsSubmitting(true);
        fetch('/api/account/login', {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then(data => {
                if (data.success)
                {
                    window.location.href = "/";
                }
                else
                {
                    setError(data.error);
                }
                setIsSubmitting(false);
            })
            .catch((error) => {
                setError("Něco se pokazilo, zkuste to prosím znovu");
                setIsSubmitting(false);
            });
    }

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
                    height: '90vh',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}>
                    <Form {...form} >
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                Welcome back!
                            </Typography>
                            <Typography>
                                Log in to your account
                            </Typography>
                            {error && <FormHelperText error>{error}</FormHelperText>}

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


                            <Typography sx={{fontWeight: 'bolder', color: colors.lighterRed, mt:2}}>
                                <Link href="/forgot-password">
                                    Forgot password?
                                </Link>
                            </Typography>
                            <Button style={{ marginTop: 16, background: colors.darkRed }} type="submit" variant="contained" fullWidth>
                                Log in
                            </Button>
                            <Typography sx={{mt:2}}>
                                Dont have an account yet? {' '}
                                <Link style={{fontWeight: 'bolder', color: colors.lighterRed,}} href="/auth/register">
                                    Sign up
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
