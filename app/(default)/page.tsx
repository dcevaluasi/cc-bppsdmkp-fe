import Image from 'next/image'
import Link from 'next/link';

export default function page() {
  return (
    <main className="flex h-screen flex-col items-center justify-between ">
      {/* Background Image */}
      <Image
        className="absolute z-0 top-0 bottom-0 left-0 right-0 w-full h-full object-cover"
        src="/landing/bg_dashboard.png"
        alt="Dashboard BPPSDM KP"
        width={0}
        height={0}
        priority
      />

      <div className="flex flex-col min-h-screen py-10 w-full max-w-5xl mx-auto z-10 relative gap-16 ">
        <div className="flex gap-4 items-center w-full mt-10">
          <Image
            className=""
            src="/logo-kkp-white.png"
            alt="Logo BPPSDM KP"
            width={80}
            height={80}
            priority
          />
          <p className="uppercase text-base leading-none text-gray-100">
            BADAN PENYULUHAN DAN<br />
            PENGEMBANGAN SUMBER DAYA MANUSIA<br />
            KELAUTAN DAN PERIKANAN
          </p>
        </div>

        <div className="flex flex-col gap-5 w-full">
          <h1 className="text-3xl md:text-6xl text-right text-gray-100">
            Welcome To<br />
            <span className="font-semibold">
              BPPSDM KP<span className="text-[#93B824]">Single Window</span>
            </span>

            {/* <span className="font-semibold">
              BPPSDM KP<span className="text-blue-500">Single Window</span>
            </span> */}
          </h1>

          <DashboardServices />
        </div>

      </div>
    </main>
  )
}

const services = [
  {
    id: 1,
    title: 'Integrated Human Resources Intelligent Platform',
    desc: 'Integrated Human Resources Intelligent Platform',
    href: '/auth/login',
    img: '/landing/logo_command_center.png',
    width: 600,
    height: 600
  },
  {
    id: 2,
    title: 'e-LATAR',
    desc: 'e-LATAR',
    href: 'https://elatar-bppsdm.kkp.go.id/',
    img: '/landing/logo_elatar.png',
    width: 600,
    height: 600
  },
  {
    id: 3,
    title: 'DIGILUH',
    desc: 'DIGILUH',
    href: 'https://simluh.kkp.solusinegeri.com/login',
    img: '/landing/logo_digiluh.png',
    width: 200,
    height: 200
  },
  {
    id: 4,
    title: 'Smart Fisheries Village',
    desc: 'Smart Fisheries Village',
    href: 'https://def-sfv.apap-project.me/',
    img: '/landing/logo_sfv.png',
    width: 200,
    height: 200
  },
  {
    id: 5,
    title: 'PENTARU - Penerimaan Calon Peserta Didik Baru',
    desc: 'PENTARU - Penerimaan Calon Peserta Didik Baru',
    href: 'https://pentaru.kkp.go.id/',
    img: '/landing/logo_pentaru.png',
    width: 200,
    height: 200
  },
  {
    id: 6,
    title: 'E-LAUT - Elektronik Layanan Pelatihan Utama Terpadu',
    desc: 'E-LAUT - Elektronik Layanan Pelatihan Utama Terpadu',
    href: 'https://elaut-bppsdm.kkp.go.id/',
    img: '/landing/logo_elaut.png',
    width: 100,
    height: 100
  }
]

function DashboardServices() {
  return (
    <div className="h-fit flex items-center justify-center p-6 bg-gradient-to-br from-sky-50 to-rose-50">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              target={item.id == 1 ? '' : '_blank'}
              className="group block rounded-2xl overflow-hidden text-current transform transition-all duration-300 hover:-translate-y-1 h-full"
            >
              <div className="relative flex items-center justify-center p-4 h-full">

                {/* Frosted overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"></div>

                {/* Content */}
                <div className="relative z-10 p-9 h-full">
                  <Image
                    className={`h-[${item.height}px] w-[${item.width}px]`}
                    src={item.img}
                    alt={item.desc}
                    width={item.width}
                    height={item.height}
                    priority
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
