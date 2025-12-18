import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/urls/urls';
import { AlumniSummary } from '@/types/alumnis';

interface UseFetchDataAlumniSummaryParams {
    tingkatPendidikan: string;
    selectedYear: string;
}

export const useFetchDataAlumniSummary = ({ tingkatPendidikan, selectedYear }: UseFetchDataAlumniSummaryParams) => {
    const [data, setData] = useState<AlumniSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${baseUrl}/api/alumnis/summary`, {
                    params: { tingkatPendidikan, selectedYear },
                });
                setData(response.data);
            } catch (err) {
                setError(err as Error);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [tingkatPendidikan, selectedYear]);

    return { data, loading, error };
};