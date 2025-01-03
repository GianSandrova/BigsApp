'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Logo from '@/components/logo';
import DaftarKlinik from '@/components/daftarklinik';
import { useGetAllFaskes } from '@/service/klinik.service';
import { useAuthToken } from '@/hooks/useAuthToken';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const token = useAuthToken();
  const { data, isLoading, error } = useGetAllFaskes();
  const [selectedFaskes, setSelectedFaskes] = useState(null);
  const router = useRouter();

  // Fungsi untuk menyimpan faskes ID
  const saveFaskesId = (faskes) => {
    if (faskes && faskes.id) {
      localStorage.setItem('selectedFaskesId', faskes.id);
    }
  };

  useEffect(() => {
    if (data && data.data && data.data.data && Array.isArray(data.data.data) && data.data.data.length > 0) {
      setSelectedFaskes(data.data.data[0]);
      saveFaskesId(data.data.data[0]); // Simpan faskes ID default
    }
  }, [data]);

  const handleFaskesChange = (faskes) => {
    setSelectedFaskes(faskes);
    saveFaskesId(faskes); // Simpan faskes ID saat pilihan berubah
  };

  function handleClick() {
    if (selectedFaskes) {
      saveFaskesId(selectedFaskes);
      router.push('/'); 
    } else {
      alert('Silakan pilih klinik terlebih dahulu');
    }
  }
  

  const faskesOptions = useMemo(() => {
    return data?.data?.data || [];
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Listbox value={selectedFaskes} onChange={handleFaskesChange}>
      {({ open }) => (
        <>
          <section className='pt-5'>
            <div className='flex flex-row items-center justify-between px-4'>
              <div className='w-1/4'>
                <Logo />
              </div>
              <div className='w-1/2 text-center'>
                <h2 className='text-xl font-bold'>Nusalima Medika</h2>
              </div>
              <div className='w-1/4'></div>
            </div>
          </section>
          <section className=''>
            <div className='grid grid-cols-1 gap-2 justify-between items-center p-3 text-center mt-5'>
              <h2>Selamat datang di Nusalima Medika</h2>
              <p>Sebelum melanjutkan harap pilih dulu klinik yang ingin dituju</p>
            </div>
          </section>
          <section className='flex justify-center'>
            <div className='p-1 font-bold text-lg text-center text-black'>Pilih Klinik</div>
          </section>
          <section>
            <div className="relative mt-2 flex justify-center">
              <div className="w-1/2 relative">
                <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{selectedFaskes?.nama_faskes || 'Pilih Faskes'}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>

                <ListboxOptions
                  className="absolute z-50 mt-1 w-full max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {faskesOptions.map((faskes) => (
                    <ListboxOption
                      key={faskes.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={faskes}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                              {faskes.nama_faskes}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </div>
          </section>
          <section>
            <div className="flex justify-center pt-2 w-full">
              <button type='submit' onClick={handleClick} className='bg-primary1 p-1 w-1/2 transition text-center rounded-[5px] font-normal text-[12px] text-white'>Next</button>
            </div>
          </section>

          <section>
            <div className="mt-20 flex justify-center text-center">Lokasi Klinik</div>
            <DaftarKlinik />
          </section>
        </>
      )}
    </Listbox>
  )
}