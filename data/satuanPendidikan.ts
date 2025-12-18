export type SatuanPendidikan = {
  id: number
  satuan_pendidikan: string
  lat: number
  lng: number
  image: string
}

export const SATUAN_PENDIDIKAN = [
  {
    id: 0,
    satuan_pendidikan: 'Pusat Pendidikan KP',
    lat: -0, // Example coordinates for Jakarta
    lng: 0,
    image: 'link_to_image_1.jpg',
  },
  {
    id: 1,
    satuan_pendidikan: 'Politeknik AUP',
    lat: -6.29364700275255, // Example coordinates for Jakarta
    lng: 106.83592402245853,
    image: 'link_to_image_1.jpg',
  },
  {
    id: 2,
    satuan_pendidikan: 'Politeknik KP Sidoarjo',
    lat: -7.397278801799742,
    lng: 112.79000349733717,
    image: 'link_to_image_2.jpg',
  },

  {
    id: 3,
    satuan_pendidikan: 'Politeknik KP Bitung',
    lat: 1.4593917042343285,
    lng: 125.21365397582687,
    image: 'link_to_image_3.jpg',
  },

  {
    id: 4,
    satuan_pendidikan: 'Politeknik KP Sorong',
    lat: -0.8288244208613316,
    lng: 131.23524670467114,
    image: 'link_to_image_4.jpg',
  },
  {
    id: 5,
    satuan_pendidikan: 'Politeknik KP Karawang',
    lat: -6.283688713044108,
    lng: 107.3034991684864,
    image: 'link_to_image_5.jpg',
  },
  {
    id: 6,
    satuan_pendidikan: 'Politeknik KP Bone',
    lat: -4.478478838639347,
    lng: 120.38023080709479,
    image: 'link_to_image_6.jpg',
  },
  {
    id: 7,
    satuan_pendidikan: 'Politeknik KP Kupang',
    lat: -10.222068919145048,
    lng: 123.51261228388972,
    image: 'link_to_image_7.jpg',
  },

  {
    id: 8,
    satuan_pendidikan: 'Politeknik KP Dumai',
    lat: 1.693668563937888,
    lng: 101.41424663215554,
    image: 'link_to_image_8.jpg',
  },

  {
    id: 9,
    satuan_pendidikan: 'Politeknik KP Pangandaran',
    lat: -7.678974242072445,
    lng: 108.68252424151959,
    image: 'link_to_image_9.jpg',
  },

  {
    id: 10,
    satuan_pendidikan: 'Politeknik KP Jembrana',
    lat: -8.390532523667353,
    lng: 114.57901379865604,
    image: 'link_to_image_10.jpg',
  },

  {
    id: 11,
    satuan_pendidikan: 'AK-KP Wakatobi',
    lat: -5.333832923713851,
    lng: 123.62372977772296,
    image: 'link_to_image_11.jpg',
  },
]

export const getSatuanPendidikanById = (id: number) => {
  const institution = SATUAN_PENDIDIKAN.find((item) => item.id === id)
  return institution ? institution.satuan_pendidikan : null // Returns null if not found
}
