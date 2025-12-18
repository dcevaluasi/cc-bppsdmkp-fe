import CardPieChart from '@/components/CardPieChart';
import React from 'react';
import { DotLoader } from 'react-spinners';

// Define the types for the props
interface RealisasiAnggaranChartProp {
    loading: boolean;
    title: string;

    data: any[]; // Adjust this type based on your actual chart data structure
    config?: object; // Optional chart style config
}

const RealisasiAnggaranChart: React.FC<RealisasiAnggaranChartProp> = ({ loading, title, data, config }) => {
    return loading ? (
        <div className="flex w-full h-[25vh] py-10 items-center justify-center">
            <DotLoader color="#2152ff" size={50} />
        </div>
    ) : (
        <CardPieChart
            title={title}
            data={data}
            config={config} // optional, or your chart style config
        />
    );
};

export default RealisasiAnggaranChart;
