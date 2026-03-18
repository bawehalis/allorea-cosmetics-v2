import { Metadata } from 'next'
import { MapPin, Clock, Phone } from 'lucide-react'

export const metadata: Metadata = { title: 'Mağaza Bul' }

const STORES = [
  { city: 'New York',   address: '432 5. Cadde, Midtown Manhattan',         hours: 'Pzt–Cmt 10:00–20:00, Paz 11:00–18:00', phone: '+1 212 555 0101', country: 'ABD' },
  { city: 'Los Angeles',address: '265 N Rodeo Drive, Beverly Hills',         hours: 'Pzt–Cmt 10:00–20:00, Paz 11:00–19:00', phone: '+1 310 555 0142', country: 'ABD' },
  { city: 'Londra',     address: '15 Bond Street, Mayfair',                  hours: 'Pzt–Cmt 10:00–19:00, Paz 12:00–18:00', phone: '+44 20 7946 0101', country: 'Birleşik Krallık' },
  { city: 'Paris',      address: '22 Rue du Faubourg Saint-Honoré',          hours: 'Pzt–Cmt 10:00–19:00, Paz Kapalı',      phone: '+33 1 42 65 01 01', country: 'Fransa' },
  { city: 'Dubai',      address: 'Kat 2, Dubai Mall, Downtown',              hours: 'Her gün 10:00–22:00',                  phone: '+971 4 555 0101', country: 'BAE' },
  { city: 'Singapur',   address: '391 Orchard Road, Ngee Ann City',          hours: 'Her gün 10:00–22:00',                  phone: '+65 6555 0101', country: 'Singapur' },
]

export default function StoresPage() {
  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-nude-100 py-16 border-b border-nude-200">
        <div className="container-main text-center">
          <p className="section-subtitle">Butiklerimiz</p>
          <h1 className="font-display text-5xl font-light text-charcoal">Mağaza Bul</h1>
          <p className="font-body text-nude-500 mt-4">Kişisel güzellik danışmanlığı için sizi bekliyoruz.</p>
        </div>
      </div>
      <div className="container-main py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORES.map(store => (
            <div key={store.city} className="bg-white border border-nude-100 p-6 hover:border-nude-300 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-brand-600" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-light text-charcoal">{store.city}</h2>
                  <p className="font-body text-xs text-nude-400 uppercase tracking-wider">{store.country}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-nude-400 mt-0.5 shrink-0" />
                  <p className="font-body text-sm text-nude-600">{store.address}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={13} className="text-nude-400 mt-0.5 shrink-0" />
                  <p className="font-body text-sm text-nude-600">{store.hours}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone size={13} className="text-nude-400 mt-0.5 shrink-0" />
                  <a href={`tel:${store.phone}`} className="font-body text-sm text-nude-600 hover:text-brand-600 transition-colors">{store.phone}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
