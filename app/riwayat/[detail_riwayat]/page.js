'use client';
import { LoadingPage } from '@/components/loading';
import Offline from '@/components/offline';
import { checkUserAuthentication, useAuthenticatedRequest } from '@/service/auth.service';
import { UseGetDetailRiwayatKunjunganByIdRegistrasi } from '@/service/riwayat.service';
import { CaretLeft, X } from '@phosphor-icons/react'
import Link from 'next/link';
import React from 'react'

const DetailRiwayat = ({ params }) => {
  console.log("params detail riwayat"+ params.detail_riwayat)
  console.log("params"+ params)
  const { isUser, isValid } = checkUserAuthentication();
  useAuthenticatedRequest(isValid);

  const { data, isLoading, isError } = UseGetDetailRiwayatKunjunganByIdRegistrasi(params.detail_riwayat);
  
  const cppt = data?.data.cppt
  const item_alkes = data?.item_alkes
  const pemeriksaan_pasien = data?.pemeriksaan_pasien
  // const item_obat = data?.data.item_obat
  // const tindakan = data?.data.tindakan
  const response = data
  // console.log(cppt);

  const riwayatData = data?.data?.data;
  const obatYangDiberikan = riwayatData?.obat_yang_diberikan;
  const nonRacikan = obatYangDiberikan?.non_racikan || [];
  const tandaVital = riwayatData?.tanda_vital;
  const tandaFisikPasien = riwayatData?.tanda_fisik_pasien || [];
  const diagnosaPenyakit = riwayatData?.diagnosa_penyakit || [];
  const tindakanDokter = riwayatData?.tindakan_dokter || [];

  const tinggiBadan = tandaFisikPasien.find(item => item.tanda_fisik === "tinggi_badan")?.nilai || "-";
  const beratBadan = tandaFisikPasien.find(item => item.tanda_fisik === "berat_badan")?.nilai || "-";
  const Nadi = tandaFisikPasien.find(item => item.tanda_fisik === "nadi_nilai")?.nilai || "-";
  const Pernafasan = tandaFisikPasien.find(item => item.tanda_fisik === "pernafasan_nilai")?.nilai || "-";
  const Sistole = tandaFisikPasien.find(item => item.tanda_fisik === "sistole")?.nilai || "-";
  const StatusIMT = tandaFisikPasien.find(item => item.tanda_fisik === "status_imt")?.nilai || "-";
  const IMT = tandaFisikPasien.find(item => item.tanda_fisik === "imt")?.nilai || "-";
  const Suhu = tandaFisikPasien.find(item => item.tanda_fisik === "temperature")?.nilai || "-";
  const tindakan = riwayatData?.tindakan_dokter?.map(item => item.nama_tindakan) || [];

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <>
      <Offline />
      <div className='bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
      <div className='px-2'>
        <section className='mt-5'>
          <Link href={'/riwayat'} className='flex items-center p-1 font-bold text-lg gap-1 text-white'>
            <CaretLeft size={18} weight='bold' />
            <div className=''>
              Riwayat Medis
            </div>
          </Link>
        </section>
        <section className='m-2 mt-4'>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-1 text-sm">
              <div className="border p-2 grid gap-2 bg-white rounded">
                <div className="border-b font-medium">
                  Keluhan :
                </div>
                <div className='text-kecil'>
                  {cppt?.subjektif}
                </div>
              </div>
              <div className="border p-2 grid gap-2 bg-white rounded">
                <div className="border-b font-medium">
                  Observasi :
                </div>
                <div className="grid grid-cols-2 gap-1 text-kecil">
                  <div className="pb-1">Tinggi Badan :
                    <div>
                      {tinggiBadan} cm
                    </div>
                  </div>
                  <div className="pb-1">Berat Badan :
                    <div>
                      {beratBadan} kg
                    </div>
                  </div>
                  <div className="pb-1">
                    BMI
                    <div>
                      {IMT} - {StatusIMT}
                    </div>
                  </div>
                  <div className="pb-1">
                    Tekanan Darah
                    <div>
                      {Sistole}
                    </div>
                  </div>
                  <div className="pb-1">
                    Suhu
                    <div>
                      {Suhu} c
                    </div>
                  </div>
                  <div className="pb-1">
                    Pernafasan
                    <div>
                      {Pernafasan} x/menit
                    </div>
                  </div>
                  <div className="pb-1">
                    Denyut Nadi
                    <div>
                      {Nadi} BPM
                    </div>
                  </div>
                  <div className="pb-1">
                    Lingkar Kepala
                    <div>
                      Normal
                    </div>
                  </div>
                  <div className="pb-1">
                    Sistole
                    <div>
                      {Sistole}
                    </div>
                  </div>
                  <div className="pb-1">
                    GDS
                    <div>
                      -
                    </div>
                  </div>
                </div>
              </div>
              <div className="border p-2 grid gap-2 bg-white rounded">
                <div className="border-b font-medium">Diagnosa :</div>
                <div className="grid grid-cols-2 gap-1 text-kecil">
                  {diagnosaPenyakit.map((diagnosa, index) => (
                    <div key={index} className="pb-1">
                      <div>{index === 0 ? "Primer:" : "Sekunder:"}</div>
                      <div>{diagnosa.detail.diagnosa}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="border p-2 grid gap-2 bg-white rounded">
                <div className="border-b font-medium">Diagnosa :</div>
                <div className="grid grid-cols-2 gap-1 text-kecil">
                  <div className="pb-1">Primer:
                    <div>
                      {diagnosa.detail.diagnosa}
                    </div>
                  </div>
                  <div className="pb-1">Sekunder :
                    <div>
                      {cppt?.assesment}
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="border p-2 grid gap-2 bg-white rounded">
                <div className="border-b font-medium">
                  Resep Obat :
                </div>
                <div className='text-kecil'>
                <ul>
                  {nonRacikan.map((obat, index) => (
                    <li key={index}>
                      {obat.nama_item} - {obat.dosis} {obat.satuan_dosis}, {obat.jumlah} {obat.signa}
                    </li>
                  ))}
                </ul>
                </div>
              </div>
              <div className="border p-2 grid gap-2 bg-white rounded">
                <div className="border-b font-medium">
                  Tindakan :
                </div>
                <div className='text-kecil'>
                <ul>
                  {tindakan.length > 0 ? tindakan.map((tindak, i) => (
                    <li key={i}>{tindak}</li>
                  )) : " - "}
                </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div >
    </>
  )
}

export default DetailRiwayat
