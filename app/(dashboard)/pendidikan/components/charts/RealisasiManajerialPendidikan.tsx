import CardBarChart from '@/components/CardBarChart';
import CardPieChart from '@/components/CardPieChart';
import React from 'react';
import { DotLoader } from 'react-spinners';

// Define the types for the props
interface RealisasiManajerialPendidikanProp {
    loading: boolean;
    title: string;

    data: any[]; // Adjust this type based on your actual chart data structure
    config?: object; // Optional chart style config
}

const RealisasiManajerialPendidikan: React.FC<RealisasiManajerialPendidikanProp> = ({ loading, title, data, config }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
        </div>
    ) : (
        <CardBarChart
            title={title}
            data={data}
            config={config} // optional, or your chart style config
        />
    );
};

export default RealisasiManajerialPendidikan;
