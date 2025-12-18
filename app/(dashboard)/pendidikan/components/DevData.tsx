'use client'

import TablePesertaDidikBySatdik from './dev/TablePesertaDidikBySatdik'
import TablePesertaDidikByProdi from './dev/TablePesertaDidikByProdi'
import TablePesertaDidikByGender from './dev/TablePesertaDidikByGender'
import TablePesertaDidikByPenerimaan from './dev/TablePesertaDidikByPenerimaan'
import TablePesertaDidikByProvinsi from './dev/TablePesertaDidikByProvinsi'
import TablePesertaDidikByAsal from './dev/TablePesertaDidikByAsal'


type CategoryType = 'satdik' | 'prodi' | 'gender' | 'penerimaan' | 'provinsi' | 'asal'

interface Category {
    id: CategoryType
    title: string
    description: string
    icon: any
    color: string
}

function DevData({ triwulan }: { triwulan: any }) {
    return (
        <div className="bg-navy-900 min-h-screen">
            <div className="grid grid-cols-1 gap-6">
                <TablePesertaDidikBySatdik loading={false} tahun='2025' triwulan={triwulan} />
                {/* <TablePesertaDidikByProdi loading={false} tahun='2025' triwulan={triwulan} /> */}
                <TablePesertaDidikByPenerimaan loading={false} tahun='2025' triwulan={triwulan} />
                <TablePesertaDidikByGender loading={false} tahun='2025' triwulan={triwulan} />
                <TablePesertaDidikByProvinsi loading={false} tahun='2025' triwulan={triwulan} />
                <TablePesertaDidikByAsal loading={false} tahun='2025' triwulan={triwulan} />
            </div>
        </div>
    )
}

export default DevData