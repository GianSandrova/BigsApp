'use client';
import { FormRow, FormRowSelect } from '@/components/FormRow';
import { Modal } from '@/components/modal';
import Offline from '@/components/offline';
import { UseGetIsUser, checkUserAuthentication, useAuthenticatedRequest } from '@/service/auth.service';
import { UseGetProfilePasienByNik, UsePostProfilePasien } from '@/service/pasien.service';
import { JENIS_VALIDASI, PEMILIK } from '@/utils/constant';
import { CaretLeft, X } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

function TambahProfile() {
  const router = useRouter();
  const { isUser, isValid } = checkUserAuthentication();
  useAuthenticatedRequest(isValid);

  const [jenisValidasi, setJenisValidasi] = useState('');
  const [validasi, setValidasi] = useState('');
  const [type, setType] = useState(''); // Tambahkan state untuk type
  const [show, setShow] = useState(false);
  const [getData, setGetData] = useState([]);
  const [loadingToastId, setLoadingToastId] = useState(null);
  const [nik, setNik] = useState('');

  const handleOnChange = (e) => {
    let selectedValue = e.target.value;
    const validasiKey = Object.keys(JENIS_VALIDASI).find(key => JENIS_VALIDASI[key] === selectedValue);
    setValidasi(validasiKey);
    setJenisValidasi(selectedValue);
    setType(validasiKey); // Tetapkan nilai type dari jenis validasi yang dipilih
  };

  const handleCloseJadwal = () => resetForm();

  const resetForm = () => {
    setShow(false);
    setGetData(null);
  };

  const { data, isLoading, isError, error, refetch } = UseGetProfilePasienByNik(nik, type);

  useEffect(() => {
    if (data) {
      toast.dismiss(loadingToastId);
      if (data.success) {
        setGetData(data.data.data);
        toast.success("Data Ditemukan!");
        setShow(true);
      } else {
        toast.error(data.data.message || "Data tidak ditemukan");
        setShow(false);
      }
    }
  }, [data, loadingToastId]);

  useEffect(() => {
    if (isError) {
      toast.dismiss(loadingToastId);
      toast.error(error.message || "Terjadi kesalahan saat mengambil data");
      setShow(false);
    }
  }, [isError, error, loadingToastId]);

  const onValidasi = (e) => {
    e.preventDefault();
    setLoadingToastId(toast.loading('Memuat data...'));
    const formSubmitData = new FormData(e.target);
    const nikFromForm = formSubmitData.get(validasi); // Assuming 'validasi' contains the field name for NIK
    setNik(nikFromForm);
    refetch(); 
  };

  const { mutate: kirimPasien, isPending: pendingKirimPasien } = UsePostProfilePasien(nik,type, {
    onSuccess: (data) => {
      toast.dismiss(loadingToastId);
      toast.success(data.message || "Profil pasien berhasil ditambahkan");
      router.push('/profile');
    },
    onError: (error) => {
      toast.dismiss(loadingToastId);
      toast.error(error.message || "Gagal menambahkan profil pasien");
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setLoadingToastId(toast.loading('Mengirim data...'));
    kirimPasien();
  };

  return (
    <>
      <Offline />
      <div>
        <div className='bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
        <div className='px-2'>
          <section className='mt-5'>
            <Link href={'/profile'} className='flex items-center p-1 font-bold text-lg gap-1 text-white'>
              <CaretLeft size={18} weight='bold' />
              <div className=''>
                Tautkan Profil Pasien
              </div>
            </Link>
          </section>
          <section className='m-2 mt-4'>
          <div className='w-full bg-white rounded-[5px] shadow-custom p-3 mt-5'>
            <div className="flex flex-col gap-2">
              <form onSubmit={onValidasi}>
                <div className="space-y-3">
                  <FormRowSelect
                    name="pemilik"
                    labelText="Pemilik"
                    list={["-- Pilih --", ...Object.values(PEMILIK)]}
                    className="w-full text-sm"
                  />
                  <FormRowSelect
                    name="jenisValidasi"
                    labelText="Jenis Validasi"
                    onChange={(e) => handleOnChange(e)}
                    list={["-- Pilih --", ...Object.values(JENIS_VALIDASI)]}
                    className="w-full text-sm"
                  />
                  <FormRow
                    type="input"
                    name={validasi}
                    labelText={`Masukkan ${jenisValidasi}`}
                    className="w-full text-sm"
                  />
                  <div className="pt-2">
                    <button
                      type='submit'
                      className='bg-primary1 p-2 w-full transition text-center rounded-[5px] font-normal text-xs sm:text-sm text-white'
                      disabled={isLoading}
                    >
                      Tautkan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
        </div>
      </div>

      <Modal open={show && getData && Object.keys(getData).length > 0} onClose={() => setShow(false)}>
      {console.log("Modal getData:", getData)}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center pb-2 border-b-2">
            <div className="text-base">Konfirmasi Data</div>
            <X onClick={handleCloseJadwal} size={24} weight="bold" />
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-2 justify-between items-center">
              <div className="grid grid-cols-1 gap-1 text-sm">
                <p>Berikut data pasien yang anda cari:</p>
                <table className="table-auto">
                  <tbody>
                    <tr>
                      <td>Nama Lengkap :</td>
                      <td>
                        <FormRow type="input" value={getData?.nama_lengkap || ""} name={"nama_lengkap"} readOnly={true} inputStyle={"border-none shadow-none"} />
                      </td>
                    </tr>
                    <tr>
                      <td>NIK :</td>
                      <td>
                        <FormRow type="input" value={getData?.nik || ""} name={"no_identitas"} readOnly={true} inputStyle={"border-none shadow-none"} />
                      </td>
                    </tr>
                    <tr>
                      <td>Tempat Lahir :</td>
                      <td>
                        <FormRow type="input" value={getData?.tempat_lahir || ""} name={"tempat_lahir"} readOnly={true} inputStyle={"border-none shadow-none"} />
                      </td>
                    </tr>
                    <tr>
                      <td>Tanggal Lahir :</td>
                      <td>
                        <FormRow type="input" value={getData?.tanggal_lahir || ""} name={"tanggal_lahir"} readOnly={true} inputStyle={"border-none shadow-none"} />
                      </td>
                    </tr>
                    <tr>
                      <td>No Rekam Medis :</td>
                      <td>
                        <FormRow type="input" value={getData?.no_rm || ""} name={"tanggal_lahir"} readOnly={true} inputStyle={"border-none shadow-none"} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end gap-2 items-center pt-3">
              <button type='button' onClick={handleCloseJadwal} className='bg-primary1 p-1 w-[5rem] transition text-center rounded-[5px] font-normal text-[12px] text-white'>Bukan</button>
              <button type='submit' disabled={pendingKirimPasien} className='bg-primary1 p-1 w-[5rem] transition text-center rounded-[5px] font-normal text-[12px] text-white'>Ya, Tambah</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default TambahProfile;
