"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Datetime from "react-datetime";
import { Calendar, CaretLeft, X } from "@phosphor-icons/react";
import Avatar from "@/public/assets/images/5s.png";
import { Modal } from "@/components/modal";
import { Search } from "@/components/search";
import {
  UseGetDoctor,
  UseGetJadwalDoctor,
  UseGetJadwalDoctorByDay,
} from "@/service/pendukung.service";
import { UseGetProfileByFaskes } from "@/service/pasien.service";
import { LoadingPage, LoadingJadwal } from "@/components/loading";
import { checkUserAuthentication } from "@/service/auth.service";
import { UsePostPerjanjianByProfile } from "@/service/perjanjian.service";
import Offline from "@/components/offline";
import moment from "moment";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DokterById = ({ params }) => {
  const router = useRouter();
  const pathName = usePathname();

  const [search, setSearch] = useState("");
  const [idDokter, setIdDokter] = useState(null);
  const [open, setOpen] = useState(false);
  const [openJadwal, setOpenJadwal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingToastId, setLoadingToastId] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoadingJadwal, setIsLoadingJadwal] = useState(false);
  const [defaultDate, setDefaultDate] = useState(moment().add(1, "days"));

  const { isUser, isValid } = checkUserAuthentication();

  const { data, isLoading } = UseGetDoctor(params.id_poli);
  // const { data: dataJadwalDokter, isLoading: isLoadingJadwal, isFetching, refetch: refetchJadwalDokter } = UseGetJadwalDoctor(idDokter);
  // const { data: dataJadwalDokterHari, isLoading: isLoadingJadwalHari, refetch: refetchBuatJanji } = UseGetJadwalDoctorByDay(idDokter, selectedDate);
  const {
    data: dataProfile,
    isLoadingDataProfile,
    isError: isErrorDataProfile,
  } = UseGetProfileByFaskes();
  const response = dataProfile?.data;
  console.log("Ini profilenya" + response);

  const filterData = () => {
    if (!data?.data) return [];
    return data.data.data.filter((item) => {
      return item.nama_dokter.toLowerCase().includes(search.toLowerCase());
    });
  };

  const handleCloseJadwal = () => setOpenJadwal(false);
  const handleClose = () => setOpen(false);

  const handleOpenJadwal = (jadwal) => {
    setIsLoadingJadwal(true);
    setSelectedSchedule(jadwal);
    setOpenJadwal(true);
    setIsLoadingJadwal(false);
  };

  const handleBuatJanji = (dokter) => {
    if (!isValid) {
      toast.error("Untuk membuat janji, anda harus login terlebih dahulu.");
    } else {
      setSelectedDoctor(dokter);
      setIdDokter(dokter.id);
      setSelectedSchedule(dokter.jadwal); // Set the schedule directly from the doctor's data
      setOpen(true);
    }
  };

  useEffect(() => {
    const tomorrow = moment().add(1, "days");
    setDefaultDate(tomorrow);
    setSelectedDate(tomorrow.format("YYYY-MM-DD"));

    if (selectedDoctor) {
      const tomorrowDay = convertDayToIndonesian(tomorrow.format("dddd"));
      const filteredSchedule = selectedDoctor.jadwal.filter(
        (jadwal) => jadwal.hari.toLowerCase() === tomorrowDay.toLowerCase()
      );
      setSelectedSchedule(filteredSchedule);
    }
  }, [selectedDoctor]);

  const convertDayToIndonesian = (englishDay) => {
    const dayMap = {
      Sunday: "Minggu",
      Monday: "Senin",
      Tuesday: "Selasa",
      Wednesday: "Rabu",
      Thursday: "Kamis",
      Friday: "Jumat",
      Saturday: "Sabtu",
    };
    return dayMap[englishDay] || englishDay;
  };

  const handleDateChange = (date) => {
    try {
      if (date && moment(date).isValid()) {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        const selectedDayEnglish = moment(date).format("dddd");
        const selectedDayIndonesian =
          convertDayToIndonesian(selectedDayEnglish);
        setDefaultDate(moment(date));
        setSelectedDate(formattedDate);
        console.log("Tanggal yang dipilih:", formattedDate);
        console.log("Hari yang dipilih:", selectedDayIndonesian);

        if (selectedDoctor) {
          const filteredSchedule = selectedDoctor.jadwal.filter(
            (jadwal) =>
              jadwal.hari.toLowerCase() === selectedDayIndonesian.toLowerCase()
          );
          setSelectedSchedule(filteredSchedule);
        }
      } else {
        console.error("Tanggal tidak valid");
        setSelectedDate(null);
        setSelectedSchedule([]);
      }
    } catch (error) {
      console.error("Error saat memproses tanggal:", error);
      setSelectedDate(null);
      setSelectedSchedule([]);
    }
  };

  const validDate = (current) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return current.isAfter(currentDate);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
    const year = date.getFullYear();

    return `${year}-${month}-${day}`; // Format YYYY-MM-DD
  };

  // // Fungsi onSubmit
  // const onSubmit = (e) => {
  //     e.preventDefault();

  //     const formData = new FormData(e.target);
  //     const tanggal = selectedDate; // Asumsikan ini adalah string tanggal
  //     const id_jadwal_praktek = formData.get('id_jadwal_praktek');
  //     const nik = formData.get('nik');

  //     if (!tanggal || !id_jadwal_praktek || !nik) {
  //         toast.error('Mohon lengkapi semua data');
  //         return;
  //     }

  //     setLoadingToastId(toast.loading('Mengirim data...'));

  //     // Temukan jadwal yang dipilih
  //     const selectedJadwal = selectedSchedule.find(s => s.id_jadwal_praktek === parseInt(id_jadwal_praktek));

  //     // Format tanggal
  //     const formattedDate = formatDate(tanggal);

  //     // Buat objek data untuk dikirim
  //     const requestData = {
  //         id_jadwal_praktek: parseInt(id_jadwal_praktek),
  //         waktu_registrasi_perjanjian: `${formattedDate} ${selectedJadwal.waktu_praktek}`,
  //         nik: nik
  //     };

  //     console.log("Request Data:", requestData);

  //     storePerjanjian(requestData);
  //     resetForm();
  // };

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const tanggal = selectedDate; // Asumsikan ini adalah string tanggal
    const id_jadwal_praktek = formData.get("id_jadwal_praktek");
    const nik = formData.get("nik");

    if (!tanggal || !id_jadwal_praktek || !nik) {
      toast.error("Mohon lengkapi semua data");
      return;
    }

    setLoadingToastId(toast.loading("Mengirim data..."));

    // Temukan jadwal yang dipilih
    const selectedJadwal = selectedSchedule.find(
      (s) => s.id_jadwal_praktek === parseInt(id_jadwal_praktek)
    );

    // Format tanggal
    const formattedDate = formatDate(tanggal);

    // Buat objek data untuk dikirim
    const requestData = {
      id_jadwal_praktek: parseInt(id_jadwal_praktek),
      waktu_registrasi_perjanjian: `${formattedDate} ${selectedJadwal.waktu_praktek}`,
      no_rm: nik, // Updated
    };

    console.log("Request Data:", requestData);

    storePerjanjian(requestData);
    resetForm();
  };

  const { mutate: storePerjanjian, isPending: isPendingStorePerjanjian } =
    UsePostPerjanjianByProfile({
      onSuccess: (data) => {
        toast.dismiss(loadingToastId);
        if (data.data.status === 200) {
          toast.success("Anda berhasil membuat perjanjian!");
          router.push(`/poliklinik/dokter/${params.id_poli}`);
        } else {
          // Jika ada pesan khusus dari backend, tampilkan
          toast.warning(
            data.data.msg ||
              "Perjanjian berhasil dibuat, tetapi ada catatan tambahan."
          );
        }
      },
      onError: (error) => {
        toast.dismiss(loadingToastId);
        toast.error(error.message || "Terjadi Kesalahan!");
      },
    });

  const resetForm = () => {
    setSelectedDate("");
    setIdDokter(null);
    setOpen(false);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Offline />
      <div className="bg-primary1 w-full h-[200px] -z-10 absolute top-0 left-0 right-0"></div>
      <div className="px-2">
        <section className="mt-5">
          <Link
            href={"/poliklinik"}
            className="flex items-center p-1 font-medium text-lg gap-1 text-white"
          >
            <CaretLeft size={18} weight="bold" />
            <div className="">Dokter</div>
          </Link>
        </section>
        <section className="m-2 mt-4">
          <Search
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Cari Dokter"
          />
        </section>
        <section className="px-2">
          <div
            className="grid grid-cols-1 gap-3 overflow-y-auto scrollbar-hide mt-5 h-full"
            style={{ maxHeight: "calc(100vh - 24vh)" }}
          >
            {filterData()?.map((item, index) => (
              <div
                key={index}
                className={`bg-white h-full w-full items-center p-2 transition-all shadow-custom rounded-[5px] cursor-pointer`}
              >
                <div className="flex items-center">
                  <div className="rounded-full overflow-hidden h-10 w-10 bg-center bg-cover flex justify-center">
                    <Image
                      src={Avatar}
                      alt={item.nama_dokter}
                      height={40}
                      width={40}
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="items-center ml-2">
                    <div className="font-medium text-sm">
                      {item.nama_dokter}
                    </div>
                    <div className="text-abutext font-normal text-kecil">
                      <span className="capitalize">
                        {item.nama_departemen.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
                {pathName.includes("dokter") && (
                  <div className="flex justify-end gap-1">
                    <div
                      onClick={() => handleOpenJadwal(item.jadwal)}
                      className="bg-primary1 p-1 w-[5rem] transition text-center rounded-[5px] font-normal text-kecil text-white"
                    >
                      Lihat Jadwal
                    </div>
                    <div
                      onClick={() => handleBuatJanji(item)}
                      className="bg-primary1 p-1 w-[5rem] transition text-center rounded-[5px] font-normal text-kecil text-white"
                    >
                      Buat Janji
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Modal open={openJadwal} onClose={handleCloseJadwal}>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center pb-2 border-b-2">
                  <div className="text-base">Jadwal Dokter</div>
                  <X onClick={handleCloseJadwal} size={24} weight="bold" />
                </div>
                <div className="grid grid-cols-1 gap-2 justify-between items-center">
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    <table>
                      <thead className="border">
                        <tr>
                          <th>Hari</th>
                          <th>Jam</th>
                        </tr>
                      </thead>
                      <tbody className="border text-center">
                        {isLoadingJadwal && <LoadingJadwal />}
                        {selectedSchedule &&
                          selectedSchedule.map((jadwal, jadwalIndex) => (
                            <tr key={jadwalIndex}>
                              <td>{jadwal.hari}</td>
                              <td>{jadwal.waktu_praktek}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end gap-2 items-center pt-3">
                  <button
                    onClick={handleCloseJadwal}
                    className="bg-primary1 p-1 w-[5rem] transition text-center rounded-[5px] font-normal text-[12px] text-white"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </Modal>
            <Modal open={open} onClose={handleClose}>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center pb-2 border-b-2">
                  <div className="text-base">
                    Buat Janji dengan {selectedDoctor?.nama_dokter}
                  </div>
                  <X onClick={handleClose} size={24} weight="bold" />
                </div>
                <form onSubmit={onSubmit}>
                  <div className="grid grid-cols-1 gap-2 justify-between items-center">
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      <div className="font-medium">Pilih Tanggal</div>
                      <div className="flex items-center w-full">
                        <div className="relative w-full">
                          <Datetime
                            isValidDate={validDate}
                            value={defaultDate}
                            onChange={handleDateChange}
                            className="w-full appearance-none focus:outline-none shadow border rounded-md p-1 border-abuabu"
                            inputProps={{
                              style: { outline: "none", width: "100%" },
                              placeholder: "Pilih Tanggal",
                              name: "tanggal_booking",
                            }}
                            dateFormat="DD/MM/YYYY"
                            timeFormat={false}
                            name="tanggal boking"
                          />
                          <span className="absolute inset-y-0 right-0 pr-2 flex items-center top-8 transform -translate-y-[17px]">
                            <Calendar size={26} className="text-abuabu" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      <input
                        type="hidden"
                        value={params.id_poli}
                        name="id_departemen"
                      />
                      <input type="hidden" value={1} name="id_penjamin" />
                      <div className="font-medium">Pilih Jam Praktek</div>
                      <select
                        name="id_jadwal_praktek"
                        className="w-full border border-abuabu rounded-md shadow p-1 focus:outline-none focus:border-primary1"
                      >
                        <option
                          value=""
                          disabled
                          className="md:max-w-2xl md:h-full md:w-48 md:flex"
                        >
                          -- Pilih Jadwal Praktek --
                        </option>
                        {selectedSchedule && selectedSchedule.length > 0 ? (
                          selectedSchedule.map((jadwal, index) => (
                            <option
                              key={index}
                              value={jadwal.id_jadwal_praktek}
                            >
                              {jadwal.hari} - {jadwal.waktu_praktek}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            Tidak ada jadwal tersedia untuk hari ini
                          </option>
                        )}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      <div className="font-medium">Pilih Profil</div>
                      <select
                        name="nik"
                        className="w-full border border-abuabu rounded-md shadow p-1 focus:outline-none focus:border-primary1"
                        id=""
                      >
                        <option value="" disabled>
                          -- Pilih Profil --
                        </option>
                        {response?.map((item, i) => (
                          <option value={item.no_rm} key={i}>
                            {item.nama_lengkap}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 items-center pt-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="bg-primary1 p-1 w-[5rem] transition text-center rounded-[5px] font-normal text-[12px] text-white"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-primary1 p-1 w-[5rem] transition text-center rounded-[5px] font-normal text-[12px] text-white"
                    >
                      Buat Janji
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </section>
      </div>
    </>
  );
};

export default DokterById;
