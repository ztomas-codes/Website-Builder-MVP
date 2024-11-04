import { Order } from '@/app/api/account/orders/route';
import { useQuery } from '@tanstack/react-query';


export const useOrdersList = () =>
    useQuery({
        queryKey: ['orders'],
        staleTime: Infinity,
        queryFn: async ()  => {
            const data = await fetch('/api/account/orders', {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                return data.orders as Order[];
            });
            return data as Order[];
        },
        enabled: true,
    });
