import React from "react";
import {
  Pie,
  PieChart,
  Label,
  BarChart,
  CartesianGrid,
  XAxis,
  Bar,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Card from "@/components/card";
import { TrendingUp } from "lucide-react";
import { Pendaftar } from "@/types/pentaru";
import axios from "axios";
import { baseUrl } from "@/urls/urls";
import { PentaruMap } from "@/components/map/PentaruMap";
import { DotLoader } from "react-spinners";
import { SATUAN_PENDIDIKAN } from "@/data/satuanPendidikan";
import { LoadScript } from "@react-google-maps/api";

const chartConfig1 = {
  asnTniPolri: {
    label: "ASN/TNI/POLRI",
    color: "rgb(0, 105, 137)",
  },
  duDiDn: {
    label: "Du/Di DN",
    color: "rgb(85, 173, 155)",
  },
};

const chartConfig2 = {
  range1: {
    label: "1.000.000 - 5.000.000",
    color: "rgb(0, 105, 137)",
  },
  range2: {
    label: "5.000.001 - 10.000.000",
    color: "rgb(85, 173, 155)",
  },
};

const chartConfig3 = {
  kuliah: {
    label: "KULIAH",
    color: "rgb(0, 105, 137)",
  },
  duDiLn: {
    label: "Du/Di LN",
    color: "rgb(85, 173, 155)",
  },
};

const chartData1 = [
  {
    name: "ASN/TNI/POLRI",
    desktop: 1015,
    fill: chartConfig1.asnTniPolri.color,
  },
  { name: "Du/Di DN", desktop: 8500, fill: chartConfig1.duDiDn.color },
];

const chartData2 = [
  {
    name: "1.000.000 - 5.000.000",
    desktop: 1364,
    fill: chartConfig2.range1.color,
  },
  {
    name: "5.000.001 - 10.000.000",
    desktop: 289,
    fill: chartConfig2.range2.color,
  },
];

const chartData3 = [
  { name: "Laki - Laki", desktop: 1364, fill: chartConfig3.kuliah.color },
  { name: "Perempuan", desktop: 289, fill: chartConfig3.duDiLn.color },
];

const programStudiPendidikanMenengah = [
  { month: "Agung Bintara", desktop: 186, fill: "#003f5c" }, // Dark blue
  { month: "Indonesia Nippon Anugerah", desktop: 305, fill: "#2f4b7c" }, // Medium dark blue
  { month: "PT. SEII", desktop: 237, fill: "#665191" }, // Medium blue
  { month: "Semesta Indah Indonesia", desktop: 81, fill: "#a05195" }, // Medium light blue
  { month: "PT. Sammy Lautan Sejati", desktop: 73, fill: "#d45087" }, // Light blue
  { month: "Sinbori Maru", desktop: 209, fill: "#f95d6a" }, // Very light blue
  { month: "PT. Siana Marina Service", desktop: 214, fill: "#ff7c43" }, // Lightest blue
  { month: "LPK Nanohana", desktop: 186, fill: "#ffa600" }, // Pale blue
  { month: "PT. CIS Jakarta (Jepang)", desktop: 134, fill: "#7a5195" }, // Muted blue
  { month: "LPK OS SELNAJAYA", desktop: 42, fill: "#ef5675" }, // Pale blue
];

const programStudiPendidikanTinggi = [
  { month: "Indonesia", desktop: 186, fill: "#005f73" }, // Dark teal
  { month: "Japan", desktop: 134, fill: "#0a9396" }, // Medium dark teal
  { month: "Taiwan", desktop: 237, fill: "#94d2bd" }, // Medium teal
  { month: "Jepang", desktop: 73, fill: "#e9d8a6" }, // Light teal
  { month: "Afganistan", desktop: 209, fill: "#ee9b00" }, // Pale teal
  { month: "Argentian", desktop: 214, fill: "#ca6702" }, // Light orange
  { month: "South Korea", desktop: 186, fill: "#bb3e03" }, // Medium orange
  { month: "Korea Selatan", desktop: 134, fill: "#ae2012" }, // Dark orange
  { month: "Panama", desktop: 237, fill: "#9b2226" }, // Darkest orange
];

const perusahaanDNAlumni = [
  { month: "PT BORNEO", desktop: 186, fill: "#264653" }, // Dark green
  { month: "PT Fresh On Time", desktop: 134, fill: "#2a9d8f" }, // Medium dark green
  { month: "PT Dwi Bina Utama", desktop: 237, fill: "#e9c46a" }, // Medium green
  { month: "PT Radios Apirja Sorong", desktop: 73, fill: "#f4a261" }, // Light green
  { month: "PT Perikanan Nusantara", desktop: 209, fill: "#e76f51" }, // Pale green
  { month: "Citra Raja Ampat Canning", desktop: 214, fill: "#d62828" }, // Light red
  { month: "PT Suri Tani Pemuka", desktop: 186, fill: "#ba181b" }, // Medium red
  { month: "UD. Piala Sorong", desktop: 134, fill: "#660708" }, // Dark red
  { month: "PT Pratama Jaya", desktop: 237, fill: "#a4161a" }, // Darkest red
  { month: "Wahan Lestarai Investama", desktop: 92, fill: "#e63946" }, // Very light red
];

const jenjangAlumni = [
  { month: "SUPM", desktop: 6551, fill: "#6a040f" }, // Dark maroon
  { month: "D3", desktop: 6137, fill: "#9d0208" }, // Medium maroon
  { month: "D4/S1", desktop: 3906, fill: "#d00000" }, // Light maroon
];

const jenjangAlumniConfig = {
  desktop: {
    label: "Jumlah",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const bidangAlumni = [
  { month: "Penangkapan Ikan", desktop: 2963 },
  { month: "Budidaya Ikan", desktop: 2515 },
  { month: "Pengolahan Ikan", desktop: 2408 },
  { month: "Permesinan", desktop: 1102 },
  { month: "Pengolahan Hasil Perikanan", desktop: 521 },
  { month: "Pemasaran Produk KP", desktop: 473 },
  { month: "Ekowisata/Konservasi", desktop: 423 },
  { month: "ABK", desktop: 353 },
  { month: "PNS", desktop: 285 },
  { month: "Budidaya Perikanan", desktop: 277 },
];

const bidangAlumniConfig = {
  desktop: {
    label: "Jumlah",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const programStudiPendidikanTinggiConfig = {
  desktop: {
    label: "Jumlah",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const perusahaanDNAlumniConfig = {
  desktop: {
    label: "Jumlah",
    color: "#818cf8",
  },
} satisfies ChartConfig;

const programStudiPendidikanMenengahConfig = {
  desktop: {
    label: "Jumlah",
    color: "#17c1e8",
  },
} satisfies ChartConfig;

function Pentaru() {
  const totalVisitors = React.useMemo(() => {
    return chartData1.reduce((acc, curr) => acc + curr.desktop, 0);
  }, []);

  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [pendaftars, setPendaftars] = React.useState<Pendaftar[]>([]);
  const handleFetchingPendaftar = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/pentaru`
      );
      setPendaftars(response.data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
    }
  };

  React.useEffect(() => {
    handleFetchingPendaftar()
  }, [])

  return (
    <div className="flex flex-col gap-5">
      {isFetching ? (
        <div className="flex w-full h-fit py-10 items-center justify-center">
          <DotLoader color="#2152ff" size={50} />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-5  ">


          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API!}
            libraries={["places"]}
          >
            <PentaruMap pendaftars={pendaftars} />
          </LoadScript>


        </div>
      )}
      <div className="w-full flex flex-row gap-5">
        <Card className="flex flex-col w-full">
          <CardHeader className="items-center pb-0">
            <CardTitle>Rekap Jalur Pedaftaran</CardTitle>
            <CardDescription>Total Pendaftar Aktif 5,586</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig1}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData1}
                  dataKey="desktop"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={0}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-white text-3xl font-bold"
                            >
                              {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-gray-400"
                            >
                              Peserta Didik
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Updated last minute <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
        <Card className="flex flex-col w-full">
          <CardHeader className="items-center pb-0">
            <CardTitle>Rekap Blu/Non Blu</CardTitle>
            <CardDescription>Total Blu : 4137 | Non Blu : 1449</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig2}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData2}
                  dataKey="desktop"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={0}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-white text-3xl font-bold"
                            >
                              {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-gray-400"
                            >
                              Peserta Didik
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Updated last minute <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
        <Card className="flex flex-col w-full">
          <CardHeader className="items-center pb-0">
            <CardTitle>Rekap Berdasar Gender</CardTitle>
            <CardDescription>
              Total Laki-laki : 3,433 | Perempuan : 2,153
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig2}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData3}
                  dataKey="desktop"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={0}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-white text-3xl font-bold"
                            >
                              {totalVisitors.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-gray-400"
                            >
                              Peserta Didik
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Updated last minute <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="w-full flex gap-5">
        <Card className="w-full">
          <CardHeader className="text-gray-300">
            <CardTitle>Grafik Pekerjaan Orang Tua Pelaku utama</CardTitle>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={programStudiPendidikanTinggiConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <BarChart accessibilityLayer data={programStudiPendidikanTinggi}>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => value} // Directly use the custom label
                  interval={0} // Ensures that all ticks are displayed
                  angle={-45} // Optional: Rotates labels to prevent overlap
                  textAnchor="end" // Optional: Aligns rotated labels
                  height={100}
                  tick={{ fill: "#cbd5e0" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground text-white"
                    fontSize={12}
                    fill="#cbd5e0"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none text-gray-300">
              Updated last minute <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-gray-300">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
        <Card className="w-full">
          <CardHeader className="text-gray-300">
            <CardTitle>Grafik Prodi Pilihan 1 - Top 10</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={programStudiPendidikanMenengahConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={programStudiPendidikanMenengah}
              >
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => value} // Directly use the custom label
                  interval={0} // Ensures that all ticks are displayed
                  angle={-45} // Optional: Rotates labels to prevent overlap
                  textAnchor="end" // Optional: Aligns rotated labels
                  height={100}
                  tick={{ fill: "#cbd5e0" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground text-white"
                    fontSize={12}
                    fill="#cbd5e0"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none text-gray-300">
              Updated last minute <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-gray-300">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="w-full flex gap-5">
        <Card className="w-full">
          <CardHeader className="text-gray-300">
            <CardTitle>Rekap Pentaru per Provinsi</CardTitle>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={perusahaanDNAlumniConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <BarChart accessibilityLayer data={perusahaanDNAlumni}>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => value} // Directly use the custom label
                  interval={0} // Ensures that all ticks are displayed
                  angle={-45} // Optional: Rotates labels to prevent overlap
                  textAnchor="end" // Optional: Aligns rotated labels
                  height={100}
                  tick={{ fill: "#cbd5e0" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground text-white"
                    fontSize={12}
                    fill="#cbd5e0"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none text-gray-300">
              Updated last minute <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-gray-300">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="w-full flex gap-5">
        <Card className="w-full">
          <CardHeader className="text-gray-300">
            <CardTitle>Rekap Asal Pendaftar Per Kota/Kabupaten</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={bidangAlumniConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <BarChart accessibilityLayer data={bidangAlumni}>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => value} // Directly use the custom label
                  interval={0} // Ensures that all ticks are displayed
                  angle={-45} // Optional: Rotates labels to prevent overlap
                  textAnchor="end" // Optional: Aligns rotated labels
                  height={100}
                  tick={{ fill: "#cbd5e0" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground text-white"
                    fontSize={12}
                    fill="#cbd5e0"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none text-gray-300">
              Updated last minute <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-gray-300">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="w-full flex gap-5">
        <Card className="w-full">
          <CardHeader className="text-gray-300">
            <CardTitle>
              Rekap Pentaru per Satuan Pendidikan Pilihan Ke 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={bidangAlumniConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <BarChart accessibilityLayer data={bidangAlumni}>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => value} // Directly use the custom label
                  interval={0} // Ensures that all ticks are displayed
                  angle={-45} // Optional: Rotates labels to prevent overlap
                  textAnchor="end" // Optional: Aligns rotated labels
                  height={100}
                  tick={{ fill: "#cbd5e0" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground text-white"
                    fontSize={12}
                    fill="#cbd5e0"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none text-gray-300">
              Updated last minute <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-gray-300">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Pentaru;
