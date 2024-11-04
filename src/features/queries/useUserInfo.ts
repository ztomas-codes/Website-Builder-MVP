import { useQuery } from '@tanstack/react-query';

export type SiteInfo = {
    smtp_host: string;
    smtp_port: number;
    smtp_secure: boolean;
    smtp_user: string;
    smtp_pass: string;
    email_template: string;
    domain: string;
    currency: string;
    template_id: string;
    stripeKey: string;
}
export type UserInfoRequest = {
    success: boolean;
    siteInfo: SiteInfo;
}

export const useUserInfo = () =>
    useQuery({
        queryKey: ['accountInfo'],
        staleTime: Infinity,
        refetchInterval: 10000,
        queryFn: async ()  => {
            const data = await fetch('/api/account/importantSettings', {
                method: 'POST',
            })
                .then((response) => response.json())
                .then((data) => {
                return data as UserInfoRequest;
            });
            return data as UserInfoRequest;
        },
        enabled: true,
    });
