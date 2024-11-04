import { useQuery } from '@tanstack/react-query';

export type Session = {
    success: boolean;
    user: {
        session_id: string;
        user_id: number;
        active: boolean;
        expiration_date: string;
        app_user: {
            email: string;
            firstname: string;
            lastname: string;
            nickname: string;
            id: number;
        }
    }
}

export const useAccountInfoQuery = () =>
    useQuery({
        queryKey: ['accountInfo'],
        staleTime: Infinity,
        queryFn: async ()  => {
               const data = await fetch('api/account/account-info', {
                    method: 'GET',
                })
                    .then((response) => response.json())
                    .then((data) => {
                    return data as Session;
                });
                return data as Session;
        },
        enabled: true,
    });
