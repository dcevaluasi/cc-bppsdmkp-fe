import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '@/urls/urls';
import { Alumnis } from '@/types/alumnis';

interface UseFetchDataAlumniParams {
    tingkatPendidikan: string;
}

export const useFetchDataAlumni = ({ tingkatPendidikan }: UseFetchDataAlumniParams) => {
    const [data, setData] = useState<Alumnis[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAlumnis = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${baseUrl}/api/alumnis`, {
                    params: { tingkatPendidikan },
                });
                setData(response.data);
            } catch (err) {
                setError(err as Error);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlumnis();
    }, [tingkatPendidikan]);

    return { data, loading, error };
};