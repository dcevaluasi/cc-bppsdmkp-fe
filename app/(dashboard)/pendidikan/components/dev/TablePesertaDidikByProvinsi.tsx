'use client'
import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, MapPin } from "lucide-react"

interface ProvinsiData {
    no: number
    provinsi: string
    'Akademi Komunitas Kelautan dan Perikanan Wakatobi': number | string
    'Politeknik AUP': number | string
    'Politeknik KP Bitung': number | string
    'Politeknik KP Bone': number | string
    'Politeknik KP Dumai': number | string
    'Politeknik KP Jembrana': number | string
    'Politeknik KP Karawang': number | string
    'Politeknik KP Kupang': number | string
    'Politeknik KP Pangandaran': number | string
    'Politeknik KP Sidoarjo': number | string
    'Politeknik KP Sorong': number | string
    'SUPM Kota Agung': number | string
    'SUPM Ladong': number | string
    'SUPM Pariaman': number | string
    'SUPM Tegal': number | string
    'SUPM Waiheru': number | string
}

interface DataByTriwulan {
    tw1: ProvinsiData[]
    tw2: ProvinsiData[]
    tw3: ProvinsiData[]
}

const SATDIK_COLUMNS = [
    'Akademi Komunitas Kelautan dan Perikanan Wakatobi',
    'Politeknik AUP',
    'Politeknik KP Bitung',
    'Politeknik KP Bone',
    'Politeknik KP Dumai',
    'Politeknik KP Jembrana',
    'Politeknik KP Karawang',
    'Politeknik KP Kupang',
    'Politeknik KP Pangandaran',
    'Politeknik KP Sidoarjo',
    'Politeknik KP Sorong',
    'SUPM Kota Agung',
    'SUPM Ladong',
    'SUPM Pariaman',
    'SUPM Tegal',
    'SUPM Waiheru'
] as const

const DATA: DataByTriwulan = {
    "tw1": [
        {
            "no": 1,
            "provinsi": "Aceh",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 164,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": 79,
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 2,
            "provinsi": "Bali",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 16,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 107,
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 9,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 3,
            "SUPM Waiheru": ""
        },
        {
            "no": 3,
            "provinsi": "Banten",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 50,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": 1,
            "Politeknik KP Pangandaran": 4,
            "Politeknik KP Sidoarjo": 11,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 1,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 4,
            "provinsi": "Bengkulu",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 136,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 1,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 3,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": 2,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 3,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 5,
            "provinsi": "DI Yogyakarta",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 10,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 3,
            "Politeknik KP Sidoarjo": 2,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 6,
            "provinsi": "DKI Jakarta",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 61,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 31,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 11,
            "Politeknik KP Sidoarjo": 12,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 1,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 5,
            "SUPM Waiheru": ""
        },
        {
            "no": 7,
            "provinsi": "Gorontalo",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 2,
            "Politeknik KP Bitung": 12,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 8,
            "provinsi": "Jambi",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 28,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 1,
            "Politeknik KP Karawang": 6,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 4,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": 3,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 9,
            "provinsi": "Jawa Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 264,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 146,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 158,
            "Politeknik KP Sidoarjo": 42,
            "Politeknik KP Sorong": 2,
            "SUPM Kota Agung": 1,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 11,
            "SUPM Waiheru": ""
        },
        {
            "no": 10,
            "provinsi": "Jawa Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 337,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 4,
            "Politeknik KP Karawang": 28,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 42,
            "Politeknik KP Sidoarjo": 50,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 180,
            "SUPM Waiheru": ""
        },
        {
            "no": 11,
            "provinsi": "Jawa Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 1,
            "Politeknik AUP": 88,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 48,
            "Politeknik KP Karawang": 13,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 4,
            "Politeknik KP Sidoarjo": 327,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 10,
            "SUPM Waiheru": ""
        },
        {
            "no": 12,
            "provinsi": "Kalimantan Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 58,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 1,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 2,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": 8,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 13,
            "provinsi": "Kalimantan Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 4,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 2,
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 14,
            "provinsi": "Kalimantan Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 10,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 6,
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 15,
            "provinsi": "Kalimantan Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 19,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 3,
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 16,
            "provinsi": "Kalimantan Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 7,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": 12,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 17,
            "provinsi": "Kepulauan Bangka Belitung",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 53,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 18,
            "provinsi": "Kepulauan Riau",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 22,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 9,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": 1,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 19,
            "provinsi": "Lampung",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 243,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 4,
            "Politeknik KP Jembrana": 2,
            "Politeknik KP Karawang": 5,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 13,
            "Politeknik KP Sidoarjo": 7,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 83,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 20,
            "provinsi": "Maluku",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 2,
            "Politeknik AUP": 351,
            "Politeknik KP Bitung": 11,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": 224,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": 177
        },
        {
            "no": 21,
            "provinsi": "Maluku Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 13,
            "Politeknik KP Bitung": 20,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": 6,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": 1
        },
        {
            "no": 22,
            "provinsi": "Nusa Tenggara Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 62,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 42,
            "Politeknik KP Karawang": 3,
            "Politeknik KP Kupang": 1,
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": 10,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 23,
            "provinsi": "Nusa Tenggara Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 2,
            "Politeknik AUP": 114,
            "Politeknik KP Bitung": 45,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 99,
            "Politeknik KP Karawang": 9,
            "Politeknik KP Kupang": 520,
            "Politeknik KP Pangandaran": 6,
            "Politeknik KP Sidoarjo": 31,
            "Politeknik KP Sorong": 5,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 24,
            "provinsi": "Papua",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 5,
            "Politeknik KP Bitung": 2,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 39,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": 1
        },
        {
            "no": 25,
            "provinsi": "Papua Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 2,
            "Politeknik KP Bitung": 3,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 5,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": 16,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 2,
            "SUPM Waiheru": ""
        },
        {
            "no": 26,
            "provinsi": "Papua Barat Daya",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 7,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 51,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 27,
            "provinsi": "Papua Pegunungan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 28,
            "provinsi": "Papua Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 3,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": 15,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 29,
            "provinsi": "Papua Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 3,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 7,
            "Politeknik KP Sorong": 2,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 30,
            "provinsi": "Riau",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 30,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 109,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": 2,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": 2,
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 31,
            "provinsi": "Sulawesi Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": 28,
            "Politeknik KP Bone": 49,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 32,
            "provinsi": "Sulawesi Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 78,
            "Politeknik KP Bitung": 23,
            "Politeknik KP Bone": 447,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 6,
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": 4,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 33,
            "provinsi": "Sulawesi Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 16,
            "Politeknik KP Bitung": 80,
            "Politeknik KP Bone": 79,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 2,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 34,
            "provinsi": "Sulawesi Tenggara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 37,
            "Politeknik AUP": 71,
            "Politeknik KP Bitung": 11,
            "Politeknik KP Bone": 40,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 49,
            "Politeknik KP Karawang": 2,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 5,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 35,
            "provinsi": "Sulawesi Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 10,
            "Politeknik KP Bitung": 247,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 36,
            "provinsi": "Sumatera Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 181,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 31,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 8,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 6,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": 5,
            "SUPM Pariaman": 169,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 37,
            "provinsi": "Sumatera Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 110,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 5,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 3,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 7,
            "Politeknik KP Sidoarjo": 10,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 5,
            "SUPM Ladong": "",
            "SUPM Pariaman": 1,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 38,
            "provinsi": "Sumatera Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 233,
            "Politeknik KP Bitung": 3,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": 118,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 12,
            "Politeknik KP Kupang": 2,
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 21,
            "Politeknik KP Sorong": 6,
            "SUPM Kota Agung": "",
            "SUPM Ladong": 23,
            "SUPM Pariaman": 4,
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        }
    ],
    "tw2": [
        {
            "no": 1,
            "provinsi": "Aceh",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 164,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 3,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": 25,
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 2,
            "provinsi": "Bali",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 16,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 107,
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 9,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 3,
            "provinsi": "Banten",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 50,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": 4,
            "Politeknik KP Pangandaran": 11,
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 4,
            "provinsi": "Bengkulu",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 135,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 1,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 3,
            "Politeknik KP Kupang": 2,
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 5,
            "provinsi": "DI Yogyakarta",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 10,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": 3,
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 6,
            "provinsi": "DKI Jakarta",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 61,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 31,
            "Politeknik KP Kupang": 11,
            "Politeknik KP Pangandaran": 12,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 1,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 7,
            "provinsi": "Gorontalo",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 2,
            "Politeknik KP Bitung": 11,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 8,
            "provinsi": "Jambi",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 28,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 1,
            "Politeknik KP Karawang": 6,
            "Politeknik KP Kupang": 1,
            "Politeknik KP Pangandaran": 4,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 9,
            "provinsi": "Jawa Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 335,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 4,
            "Politeknik KP Karawang": 28,
            "Politeknik KP Kupang": 42,
            "Politeknik KP Pangandaran": 50,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 63,
            "SUPM Waiheru": ""
        },
        {
            "no": 10,
            "provinsi": "Jawa Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 1,
            "Politeknik AUP": 88,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 48,
            "Politeknik KP Karawang": 13,
            "Politeknik KP Kupang": 4,
            "Politeknik KP Pangandaran": 327,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 2,
            "SUPM Waiheru": ""
        },
        {
            "no": 11,
            "provinsi": "Jawa Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 264,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 146,
            "Politeknik KP Kupang": 158,
            "Politeknik KP Pangandaran": 42,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 1,
            "SUPM Kota Agung": 1,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 2,
            "SUPM Waiheru": ""
        },
        {
            "no": 12,
            "provinsi": "Kalimantan Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 58,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 1,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 2,
            "Politeknik KP Kupang": 2,
            "Politeknik KP Pangandaran": 8,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 13,
            "provinsi": "Kalimantan Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 4,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 2,
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": 2,
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 14,
            "provinsi": "Kalimantan Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 10,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 6,
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 15,
            "provinsi": "Kalimantan Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 19,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 3,
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 16,
            "provinsi": "Kalimantan Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 7,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": 12,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 17,
            "provinsi": "Kepulauan Bangka Belitung",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 53,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 3,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 18,
            "provinsi": "Kepulauan Riau",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 22,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 9,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 19,
            "provinsi": "Lampung",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 242,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 4,
            "Politeknik KP Jembrana": 2,
            "Politeknik KP Karawang": 5,
            "Politeknik KP Kupang": 13,
            "Politeknik KP Pangandaran": 7,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 17,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 20,
            "provinsi": "Maluku",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 2,
            "Politeknik AUP": 347,
            "Politeknik KP Bitung": 11,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 224,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": 74
        },
        {
            "no": 21,
            "provinsi": "Maluku Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 13,
            "Politeknik KP Bitung": 19,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": 1,
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 6,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 22,
            "provinsi": "Nusa Tenggara Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 62,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 42,
            "Politeknik KP Karawang": 3,
            "Politeknik KP Kupang": 2,
            "Politeknik KP Pangandaran": 10,
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 23,
            "provinsi": "Nusa Tenggara Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 2,
            "Politeknik AUP": 114,
            "Politeknik KP Bitung": 45,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 99,
            "Politeknik KP Karawang": 9,
            "Politeknik KP Kupang": 6,
            "Politeknik KP Pangandaran": 31,
            "Politeknik KP Sidoarjo": 520,
            "Politeknik KP Sorong": 5,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 24,
            "provinsi": "Papua",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 5,
            "Politeknik KP Bitung": 2,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 39,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 25,
            "provinsi": "Papua Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 2,
            "Politeknik KP Bitung": 3,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 5,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 16,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 2,
            "SUPM Waiheru": ""
        },
        {
            "no": 26,
            "provinsi": "Papua Barat Daya",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 7,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 51,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 27,
            "provinsi": "Papua Pegunungan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 28,
            "provinsi": "Papua Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 3,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 15,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 29,
            "provinsi": "Papua Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 3,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 7,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 2,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 30,
            "provinsi": "Riau",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 30,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 110,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": 2,
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": 1,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 31,
            "provinsi": "Sulawesi Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": 28,
            "Politeknik KP Bone": 49,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 32,
            "provinsi": "Sulawesi Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 77,
            "Politeknik KP Bitung": 23,
            "Politeknik KP Bone": 447,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": 6,
            "Politeknik KP Pangandaran": 3,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 4,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 33,
            "provinsi": "Sulawesi Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 15,
            "Politeknik KP Bitung": 79,
            "Politeknik KP Bone": 79,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 34,
            "provinsi": "Sulawesi Tenggara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 37,
            "Politeknik AUP": 71,
            "Politeknik KP Bitung": 11,
            "Politeknik KP Bone": 40,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 49,
            "Politeknik KP Karawang": 2,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 5,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 35,
            "provinsi": "Sulawesi Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 10,
            "Politeknik KP Bitung": 239,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 36,
            "provinsi": "Sumatera Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 181,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 31,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 8,
            "Politeknik KP Kupang": 1,
            "Politeknik KP Pangandaran": 6,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": 57,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 37,
            "provinsi": "Sumatera Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 110,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 5,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 3,
            "Politeknik KP Kupang": 7,
            "Politeknik KP Pangandaran": 10,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 1,
            "SUPM Ladong": "",
            "SUPM Pariaman": 1,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 38,
            "provinsi": "Sumatera Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 233,
            "Politeknik KP Bitung": 3,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": 116,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 12,
            "Politeknik KP Kupang": 1,
            "Politeknik KP Pangandaran": 21,
            "Politeknik KP Sidoarjo": 2,
            "Politeknik KP Sorong": 6,
            "SUPM Kota Agung": "",
            "SUPM Ladong": 9,
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        }
    ],
    "tw3": [
        {
            "no": 1,
            "provinsi": "Aceh",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 163,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 2,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 4,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": 81,
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 2,
            "provinsi": "Bali",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 5,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 58,
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 7,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 3,
            "provinsi": "Banten",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 50,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 5,
            "Politeknik KP Sidoarjo": 16,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 2,
            "SUPM Waiheru": ""
        },
        {
            "no": 4,
            "provinsi": "Bengkulu",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 124,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 2,
            "Politeknik KP Jembrana": 1,
            "Politeknik KP Karawang": 6,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 1,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 5,
            "provinsi": "DI Yogyakarta",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 9,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 4,
            "Politeknik KP Sidoarjo": 2,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 2,
            "SUPM Waiheru": ""
        },
        {
            "no": 6,
            "provinsi": "DKI Jakarta",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 62,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 37,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 15,
            "Politeknik KP Sidoarjo": 15,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 2,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 2,
            "SUPM Waiheru": ""
        },
        {
            "no": 7,
            "provinsi": "Gorontalo",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 2,
            "Politeknik KP Bitung": 10,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 8,
            "provinsi": "Jambi",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 24,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 1,
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 5,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": 2,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 9,
            "provinsi": "Jawa Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 252,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 150,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 134,
            "Politeknik KP Sidoarjo": 59,
            "Politeknik KP Sorong": 1,
            "SUPM Kota Agung": 1,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 4,
            "SUPM Waiheru": ""
        },
        {
            "no": 10,
            "provinsi": "Jawa Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 1,
            "Politeknik AUP": 314,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 1,
            "Politeknik KP Karawang": 22,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 38,
            "Politeknik KP Sidoarjo": 43,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 104,
            "SUPM Waiheru": ""
        },
        {
            "no": 11,
            "provinsi": "Jawa Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 77,
            "Politeknik KP Bitung": 2,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 43,
            "Politeknik KP Karawang": 10,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 4,
            "Politeknik KP Sidoarjo": 245,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 3,
            "SUPM Waiheru": ""
        },
        {
            "no": 12,
            "provinsi": "Kalimantan Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 54,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 2,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": 7,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 13,
            "provinsi": "Kalimantan Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 1,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 14,
            "provinsi": "Kalimantan Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 6,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 1,
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 15,
            "provinsi": "Kalimantan Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 1,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 11,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 2,
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 51,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 16,
            "provinsi": "Kalimantan Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 3,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 7,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 17,
            "provinsi": "Kepulauan Bangka Belitung",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 45,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 2,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 18,
            "provinsi": "Kepulauan Riau",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 24,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": 1,
            "Politeknik KP Dumai": 6,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": 1,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 19,
            "provinsi": "Lampung",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 190,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 5,
            "Politeknik KP Jembrana": 4,
            "Politeknik KP Karawang": 8,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 6,
            "Politeknik KP Sidoarjo": 9,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 68,
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 20,
            "provinsi": "Maluku",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 347,
            "Politeknik KP Bitung": 11,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": 173,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": 150
        },
        {
            "no": 21,
            "provinsi": "Maluku Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 12,
            "Politeknik KP Bitung": 16,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": 2,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": 2
        },
        {
            "no": 22,
            "provinsi": "Nusa Tenggara Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 64,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 24,
            "Politeknik KP Karawang": 3,
            "Politeknik KP Kupang": 1,
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": 9,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 1,
            "SUPM Waiheru": ""
        },
        {
            "no": 23,
            "provinsi": "Nusa Tenggara Timur",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 1,
            "Politeknik AUP": 108,
            "Politeknik KP Bitung": 48,
            "Politeknik KP Bone": 1,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 93,
            "Politeknik KP Karawang": 13,
            "Politeknik KP Kupang": 363,
            "Politeknik KP Pangandaran": 7,
            "Politeknik KP Sidoarjo": 49,
            "Politeknik KP Sorong": 7,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 7,
            "SUPM Waiheru": ""
        },
        {
            "no": 24,
            "provinsi": "Papua",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 3,
            "Politeknik KP Bitung": 2,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 28,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 25,
            "provinsi": "Papua Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 2,
            "Politeknik KP Bitung": 3,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 5,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 2,
            "Politeknik KP Sorong": 14,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 2,
            "SUPM Waiheru": ""
        },
        {
            "no": 26,
            "provinsi": "Papua Barat Daya",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 2,
            "Politeknik AUP": 6,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": 47,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 27,
            "provinsi": "Papua Pegunungan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 4,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 28,
            "provinsi": "Papua Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 2,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 1,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 2,
            "Politeknik KP Sorong": 19,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 29,
            "provinsi": "Papua Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 2,
            "Politeknik KP Bitung": 1,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 34,
            "Politeknik KP Sorong": 5,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 30,
            "provinsi": "Riau",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 19,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 93,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 2,
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": 1,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 31,
            "provinsi": "Sulawesi Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 7,
            "Politeknik KP Bitung": 32,
            "Politeknik KP Bone": 29,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": "",
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": 3,
            "SUPM Waiheru": ""
        },
        {
            "no": 32,
            "provinsi": "Sulawesi Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 54,
            "Politeknik KP Bitung": 22,
            "Politeknik KP Bone": 290,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 6,
            "Politeknik KP Sidoarjo": 6,
            "Politeknik KP Sorong": 1,
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 33,
            "provinsi": "Sulawesi Tengah",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 14,
            "Politeknik KP Bitung": 60,
            "Politeknik KP Bone": 44,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 3,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 34,
            "provinsi": "Sulawesi Tenggara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": 28,
            "Politeknik AUP": 63,
            "Politeknik KP Bitung": 8,
            "Politeknik KP Bone": 39,
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 45,
            "Politeknik KP Karawang": 2,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 13,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 35,
            "provinsi": "Sulawesi Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 8,
            "Politeknik KP Bitung": 170,
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": "",
            "Politeknik KP Jembrana": 1,
            "Politeknik KP Karawang": "",
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": "",
            "Politeknik KP Sidoarjo": 1,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": "",
            "SUPM Pariaman": "",
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 36,
            "provinsi": "Sumatera Barat",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 169,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 28,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 4,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 3,
            "Politeknik KP Sidoarjo": 5,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": "",
            "SUPM Ladong": 1,
            "SUPM Pariaman": 93,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 37,
            "provinsi": "Sumatera Selatan",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 100,
            "Politeknik KP Bitung": "",
            "Politeknik KP Bone": "",
            "Politeknik KP Dumai": 3,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 3,
            "Politeknik KP Kupang": "",
            "Politeknik KP Pangandaran": 7,
            "Politeknik KP Sidoarjo": 11,
            "Politeknik KP Sorong": "",
            "SUPM Kota Agung": 5,
            "SUPM Ladong": "",
            "SUPM Pariaman": 1,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        },
        {
            "no": 38,
            "provinsi": "Sumatera Utara",
            "Akademi Komunitas Kelautan dan Perikanan Wakatobi": "",
            "Politeknik AUP": 219,
            "Politeknik KP Bitung": 3,
            "Politeknik KP Bone": 2,
            "Politeknik KP Dumai": 114,
            "Politeknik KP Jembrana": "",
            "Politeknik KP Karawang": 21,
            "Politeknik KP Kupang": 1,
            "Politeknik KP Pangandaran": 1,
            "Politeknik KP Sidoarjo": 33,
            "Politeknik KP Sorong": 6,
            "SUPM Kota Agung": "",
            "SUPM Ladong": 12,
            "SUPM Pariaman": 1,
            "SUPM Tegal": "",
            "SUPM Waiheru": ""
        }
    ]
}


const toNumber = (val: number | string): number => {
    return typeof val === 'number' ? val : (val === '' ? 0 : Number(val))
}

export default function TablePesertaDidikByProvinsi({
    loading = false,
    tahun = '2024',
    triwulan = 'tw1'
}: {
    loading?: boolean
    tahun?: string
    triwulan?: 'tw1' | 'tw2' | 'tw3'
}) {
    const [selectedView, setSelectedView] = useState<'all' | 'top10'>('all')

    const twLabel: Record<'tw1' | 'tw2' | 'tw3', string> = {
        tw1: 'TW I',
        tw2: 'TW II',
        tw3: 'TW III'
    }

    const { tableData, chartData, totalPerSatdik } = useMemo(() => {
        const currentData = DATA[triwulan]

        const dataWithTotal = currentData.map(row => {
            const total = SATDIK_COLUMNS.reduce((sum, col) => sum + toNumber(row[col]), 0)
            return { ...row, total }
        })

        const sortedByNo = [...dataWithTotal].sort((a, b) => a.no - b.no)
        const top10Data = [...dataWithTotal]
            .sort((a, b) => b.total - a.total)
            .slice(0, 10)
            .sort((a, b) => a.no - b.no)

        const totals: Record<string, number> = {}
        SATDIK_COLUMNS.forEach(col => {
            totals[col] = currentData.reduce((sum, row) => sum + toNumber(row[col]), 0)
        })

        const chartTop10 = [...dataWithTotal]
            .sort((a, b) => b.total - a.total)
            .slice(0, 10)

        return {
            tableData: selectedView === 'all' ? sortedByNo : top10Data,
            chartData: chartTop10,
            totalPerSatdik: totals
        }
    }, [triwulan, selectedView])

    const grandTotal = useMemo(() => {
        return tableData.reduce((sum, row) => sum + row.total, 0)
    }, [tableData])

    const generateColors = (count: number) => {
        return Array.from({ length: count }, (_, i) => {
            const hue = (210 + i * 15) % 360
            return `hsl(${hue}, 70%, 55%)`
        })
    }

    const colors = generateColors(chartData.length)

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const total = chartData.reduce((sum, item) => sum + item.total, 0)
            const percentage = ((payload[0].value / total) * 100).toFixed(1)

            return (
                <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/50 rounded-lg shadow-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <strong className="text-sm text-white font-semibold">{payload[0].payload.provinsi}</strong>
                    </div>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-4 text-gray-300">
                            <span>Total Peserta:</span>
                            <span className="font-bold text-blue-400">{payload[0].value.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-gray-300">
                            <span>Persentase:</span>
                            <span className="font-bold text-emerald-400">{percentage}%</span>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }

    const CustomBarCursor = (props: any) => {
        const { x, y, width, height } = props
        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={4}
                ry={4}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth={1}
            />
        )
    }

    if (loading) {
        return (
            <div className="flex h-[25vh] py-10 items-center justify-center">
                <div className="text-gray-300">Loading...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
                <CardHeader className="items-center pb-0 border-b border-navy-600/50">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-white text-center">
                            Top 10 Provinsi - Sebaran Peserta Didik {tahun} ({twLabel[triwulan]})
                        </CardTitle>
                    </div>
                    <p className="text-sm text-gray-400 pb-5 text-center">
                        Provinsi dengan jumlah peserta didik terbanyak
                    </p>
                </CardHeader>
                <CardContent className="flex-1 pb-0 pt-6">
                    <ResponsiveContainer width="100%" height={550}>
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                type="number"
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            />
                            <YAxis
                                type="category"
                                dataKey="provinsi"
                                width={140}
                                fontSize={12}
                                stroke="#9CA3AF"
                                tick={{ fill: '#E5E7EB', fontSize: 12, fontWeight: 500 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={<CustomBarCursor />} />
                            <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                                <LabelList
                                    dataKey="total"
                                    position="right"
                                    offset={8}
                                    formatter={(value: number) => value.toLocaleString('id-ID')}
                                    style={{
                                        fill: '#fff',
                                        fontSize: 11,
                                        fontWeight: 'bold',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                    }}
                                />
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="flex flex-col w-full bg-gradient-to-br from-navy-800 to-navy-900 border-navy-600">
                <CardHeader className="pb-4 flex items-center justify-between flex-row w-full border-b border-navy-600/50">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-400" />
                            Detail Sebaran Per Provinsi
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                            Distribusi peserta didik di setiap satuan pendidikan
                        </p>
                    </div>
                    <div className="w-48">
                        <Select value={selectedView} onValueChange={(val) => setSelectedView(val as 'all' | 'top10')}>
                            <SelectTrigger className="w-full text-gray-300 bg-navy-700 border-navy-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-gray-300">📊 Semua Provinsi</SelectItem>
                                <SelectItem value="top10" className="text-gray-300">🏆 Top 10 Provinsi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-lg border-2 border-navy-600/50 shadow-xl">
                        <table className="min-w-full divide-y divide-navy-600 bg-navy-700/50 text-xs text-gray-200">
                            <thead className="bg-gradient-to-r from-navy-800 to-navy-900">
                                <tr>
                                    <th className="px-3 py-4 text-center font-semibold text-gray-200 sticky left-0 bg-navy-800 z-10 border-r border-navy-600">
                                        #
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold text-gray-200 sticky left-12 bg-navy-800 z-10 min-w-[160px] border-r border-navy-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-blue-400" />
                                            Provinsi
                                        </div>
                                    </th>
                                    {SATDIK_COLUMNS.map((col, idx) => (
                                        <th
                                            key={col}
                                            className="px-2 py-4 text-right font-semibold text-gray-200 min-w-[90px] whitespace-nowrap border-l border-navy-600/30"
                                            style={{
                                                background: `linear-gradient(to bottom, rgba(30, 41, 59, ${0.3 + (idx * 0.02)}), rgba(15, 23, 42, ${0.3 + (idx * 0.02)}))`
                                            }}
                                        >
                                            {col.length > 20 ? col.substring(0, 18) + '...' : col}
                                        </th>
                                    ))}
                                    <th className="px-4 py-4 text-right font-bold text-gray-200 bg-navy-900 sticky right-0 z-10 border-l-2 border-blue-500/50">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-600/50">
                                {tableData.map((row, rowIndex) => (
                                    <tr
                                        key={row.no}
                                        className="hover:bg-navy-600/50 transition-all duration-200 group"
                                        style={{
                                            background: rowIndex % 2 === 0 ? 'rgba(30, 41, 59, 0.3)' : 'rgba(15, 23, 42, 0.3)'
                                        }}
                                    >
                                        <td className="px-3 py-3 text-center text-gray-300 sticky left-0 bg-navy-700/90 group-hover:bg-navy-600/90 border-r border-navy-600">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                                                {row.no}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-200 font-medium sticky left-12 bg-navy-700/90 group-hover:bg-navy-600/90 border-r border-navy-600">
                                            {row.provinsi}
                                        </td>
                                        {SATDIK_COLUMNS.map((col) => {
                                            const val = toNumber(row[col])
                                            return (
                                                <td key={col} className="px-2 py-3 text-right text-gray-300 border-l border-navy-600/20">
                                                    {val > 0 ? (
                                                        <span className="inline-block px-2 py-1 rounded bg-blue-500/10 text-blue-300 font-medium">
                                                            {val.toLocaleString('id-ID')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-600">-</span>
                                                    )}
                                                </td>
                                            )
                                        })}
                                        <td className="px-4 py-3 text-right font-bold text-teal-400 bg-navy-800/90 group-hover:bg-navy-700/90 sticky right-0 z-10 border-l-2 border-blue-500/30">
                                            <span className="inline-block px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold">
                                                {row.total.toLocaleString('id-ID')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gradient-to-r from-navy-900 to-navy-800 font-bold border-t-2 border-blue-500/50">
                                    <td colSpan={2} className="px-4 py-4 text-right sticky left-0 bg-navy-900 text-gray-200 uppercase tracking-wider border-r border-navy-600">
                                        <div className="flex items-center justify-end gap-2">
                                            <TrendingUp className="w-4 h-4 text-teal-400" />
                                            TOTAL {selectedView === 'top10' ? 'TOP 10' : 'KESELURUHAN'}
                                        </div>
                                    </td>
                                    {SATDIK_COLUMNS.map((col) => (
                                        <td key={col} className="px-2 py-4 text-right text-teal-300 border-l border-navy-600/30">
                                            {totalPerSatdik[col] > 0 ? (
                                                <span className="inline-block px-2 py-1 rounded bg-teal-500/20 font-bold">
                                                    {totalPerSatdik[col].toLocaleString('id-ID')}
                                                </span>
                                            ) : '-'}
                                        </td>
                                    ))}
                                    <td className="px-4 py-4 text-right text-teal-300 bg-navy-900 sticky right-0 z-10 border-l-2 border-blue-500/50">
                                        <span className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500/30 to-blue-500/30 text-white font-bold text-sm shadow-lg">
                                            {grandTotal.toLocaleString('id-ID')}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}