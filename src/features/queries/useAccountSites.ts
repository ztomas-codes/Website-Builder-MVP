import { useQuery } from '@tanstack/react-query';

type SiteResponse = {
    success: boolean;
    sites: Site[];
}

type Site = {
    id: number;
    userid: number;
    domain: string;
    name: string;
    emailer: string | null;
    smtp_host: string | null;
    smtp_port: string | null;
    smtp_secure: string | null;
    smtp_user: string | null;
    smtp_pass: string | null;
    subscription_type: string | null;
    subscription_ending: string | null;
    currency: string;    
}

export const useAccountSites = () =>
    useQuery({
        queryKey: ['accountSites'],
        staleTime: Infinity,
        queryFn: async ()  => {
            const data = await fetch('/api/shop/sites', {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                return data as SiteResponse;
            });
            return data as SiteResponse;
        },
        enabled: true,
    });
