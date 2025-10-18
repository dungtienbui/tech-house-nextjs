'use client';

import { useQuery } from '@tanstack/react-query';
import { getVariantByIds } from '../actions/variant';

export function useVariantsByIds(ids: string[]) {
    return useQuery({
        queryKey: ['products', ids.sort()],
        queryFn: () => getVariantByIds(ids),
        enabled: ids.length > 0,
    });
}