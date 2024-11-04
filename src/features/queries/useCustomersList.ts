import { CustomerResponse } from '@/app/api/account/customers/route';
import { Order } from '@/app/api/account/orders/route';
import { useQuery } from '@tanstack/react-query';

export const useCustomersList = () =>
    useQuery({
        queryKey: ['customers'],
        staleTime: Infinity,
        queryFn: async ()  => {
            const data = await fetch('/api/account/customers', {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((data) => {
                return data as CustomerResponse;
            });
            return data as CustomerResponse;
        },
        enabled: true,
    });
