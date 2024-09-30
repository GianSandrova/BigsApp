'use client';
import { CaretLeft } from '@phosphor-icons/react';
import Link from 'next/link';
import React, { useState } from 'react'

const Bmi = () => {
  const [berat, setBerat] = useState('');
  const [tinggi, setTinggi] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  const handleHitung = () => {
    const beratFloat = parseFloat(berat);
    const tinggiFloat = parseFloat(tinggi) / 100;

    if (!isNaN(beratFloat) && !isNaN(tinggiFloat) && tinggiFloat !== 0) {
      const bmi = beratFloat / (tinggiFloat * tinggiFloat);
      setBmiResult(bmi);
    } else {
      setBmiResult(null);
    }
  };

  return (
    <>
      <div className='bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0'></div>
      <div className='px-2'>
        <section className='mt-5'>
          <Link href={'/home'} className='flex items-center p-1 font-bold text-lg gap-1 text-white'>
            <CaretLeft size={18} weight='bold' />
            <div className=''>
              Body Mass Index
            </div>
          </Link>
        </section>
        <section className='m-2 mt-4'>
          <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-3 mt-5'>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center pb-2 border-b-2">
                <div className="text-base">Body Mass Index</div>
              </div>
              <div className="grid grid-cols-1 gap-2 justify-between items-center">
                <div className="grid grid-cols-1 gap-1 text-sm">
                  <div className="font-medium">Berat Badan :</div>
                  <input type="text" placeholder='Berat dalam kg'
                    value={berat}
                    onChange={(e) => setBerat(e.target.value)}
                    className='w-full border border-abuabu rounded-md shadow p-1 focus:outline-none focus:border-primary1' />
                </div>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  <div className="font-medium">Tinggi Badan :</div>
                  <input type="text"
                    value={tinggi}
                    onChange={(e) => setTinggi(e.target.value)}
                    placeholder='Tinggi dalam cm' className='w-full border border-abuabu rounded-md shadow p-1 focus:outline-none focus:border-primary1' />
                </div>
                <div className="flex items-center pt-2">
                  <button type='submit' onClick={handleHitung} className='bg-primary1 p-1 w-full transition text-center rounded-[5px] font-normal text-[12px] text-white'>Hitung</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {bmiResult !== null && (
          <section className='m-2'>
            <div className='w-full h-full bg-white rounded-[5px] shadow-custom p-2 mt-5'>
              <div className='items-center text-center'>
                <div className="grid grid-cols-1">
                  <h3 className='font-normal text-lg'>Hasil Anda:</h3>
                  <h3 className={`font-semibold text-lg ${bmiResult < 18.5 ? 'text-orange-300' : bmiResult >= 18.5 && bmiResult <= 24.9 ? 'text-blue-800' : bmiResult >= 25.0 && bmiResult <= 29.9 ? 'text-green-800' : 'text-red-800'}`}>{bmiResult.toFixed(2)} | {bmiResult < 18.5 ? 'Berat Rendah' : bmiResult >= 18.5 && bmiResult <= 24.9 ? 'Berat Normal' : bmiResult >= 25.0 && bmiResult <= 29.9 ? 'Berat Berlebih' : 'Obesitas'}</h3>
                  <table className='mt-5'>
                    <thead className='border p-5'>
                      <tr>
                        <th>Indeks</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className='border'>
                      <tr>
                        <td>
                          <div>{`< `}18.5</div>
                        </td>
                        <td>
                          <div className='text-orange-300'>Berat Rendah</div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div>18.5 - 24.9</div>

                        </td>
                        <td>
                          <div className='text-blue-800'>Berat Normal</div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div>25.0 - 29.9</div>
                        </td>
                        <td>
                          <div className='text-green-800'>Berat Berlebih</div></td>
                      </tr>
                      <tr>
                        <td>
                          <div>{`> `}30.0</div>
                        </td>
                        <td>
                          <div className='text-red-800'>Obesitas</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default Bmi
