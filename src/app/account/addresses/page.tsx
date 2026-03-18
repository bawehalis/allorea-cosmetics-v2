// src/app/account/addresses/page.tsx
// FIX: Removed `(form as any)[key]` — typed form state accessed directly.
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const COUNTRIES = [
  'Türkiye', 'Almanya', 'Fransa', 'İngiltere', 'Hollanda',
  'Belçika', 'İsveç', 'Norveç', 'Danimarka', 'İsviçre',
  'Amerika Birleşik Devletleri', 'Kanada', 'Avustralya',
]

interface Address {
  id:         string
  firstName:  string
  lastName:   string
  address1:   string
  address2?:  string
  city:       string
  state:      string
  postalCode: string
  country:    string
  phone?:     string
  isDefault:  boolean
}

interface AddressForm {
  firstName:  string
  lastName:   string
  address1:   string
  address2:   string
  city:       string
  state:      string
  postalCode: string
  country:    string
  phone:      string
}

const EMPTY_FORM: AddressForm = {
  firstName: '', lastName: '', address1: '', address2: '',
  city: '', state: '', postalCode: '', country: 'United States', phone: '',
}

const FIELDS: Array<{ label: string; key: keyof AddressForm; type: string; span?: boolean }> = [
  { label: 'First Name',              key: 'firstName',  type: 'text' },
  { label: 'Last Name',               key: 'lastName',   type: 'text' },
  { label: 'Address Line 1',          key: 'address1',   type: 'text', span: true },
  { label: 'Address Line 2 (optional)',key: 'address2',  type: 'text', span: true },
  { label: 'City',                    key: 'city',       type: 'text' },
  { label: 'State / Province',        key: 'state',      type: 'text' },
  { label: 'Postal Code',             key: 'postalCode', type: 'text' },
  { label: 'Phone (optional)',        key: 'phone',      type: 'tel' },
]
export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1', firstName: 'Sarah', lastName: 'Mitchell',
      address1: '123 Beauty Lane', city: 'New York', state: 'NY',
      postalCode: '10001', country: 'United States', isDefault: true,
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState<string | null>(null)
  const [form, setForm]         = useState<AddressForm>(EMPTY_FORM)

  const up = (key: keyof AddressForm, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const openNew = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    setEditId(addr.id)
    setForm({
      firstName:  addr.firstName,
      lastName:   addr.lastName,
      address1:   addr.address1,
      address2:   addr.address2 ?? '',
      city:       addr.city,
      state:      addr.state,
      postalCode: addr.postalCode,
      country:    addr.country,
      phone:      addr.phone ?? '',
    })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.firstName || !form.address1 || !form.city) return
    if (editId) {
      setAddresses(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a))
    } else {
      setAddresses(prev => [
        ...prev,
        { id: Date.now().toString(), ...form, isDefault: prev.length === 0 },
      ])
    }
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  const handleDelete  = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id))
  const setDefault    = (id: string) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-8">
          <nav className="font-body text-xs text-nude-400 mb-2">
            <Link href="/" className="hover:text-charcoal">Home</Link>
            {' / '}
            <Link href="/account" className="hover:text-charcoal">Account</Link>
            {' / '}
            Addresses
          </nav>
          <h1 className="font-display text-4xl font-light text-charcoal">Kayıtlı Adresler</h1>
        </div>
      </div>

      <div className="container-main py-10 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <p className="font-body text-sm text-nude-500">
            {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
          </p>
          <button onClick={openNew}
            className="btn-outline text-xs px-5 py-2.5 gap-2 flex items-center">
            <Plus size={14} /> Yeni Adres Ekle
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-nude-100 p-6 mb-6 rounded-lg">
            <h2 className="font-display text-xl font-light text-charcoal mb-5">
              {editId ? 'Edit Address' : 'New Address'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {FIELDS.map(({ label, key, type, span }) => (
                <div key={key} className={span ? 'col-span-2' : ''}>
                  <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => up(key, e.target.value)}
                    className="w-full input-field"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-1.5">
                  Country
                </label>
                <select
                  value={form.country}
                  onChange={e => up('country', e.target.value)}
                  className="w-full input-field bg-white"
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} className="btn-primary text-sm px-6 py-3">
                Adresi Kaydet
              </button>
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm px-6 py-3">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Address cards */}
        {addresses.length === 0 ? (
          <div className="text-center py-16 bg-white border border-nude-100">
            <MapPin size={40} className="text-nude-300 mx-auto mb-4" />
            <p className="font-display text-2xl font-light text-charcoal mb-2">Kayıtlı adres yok</p>
            <p className="font-body text-sm text-nude-500">Ödeme sürecinizi hızlandırmak için adres ekleyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id}
                className={cn('bg-white border p-5 relative', addr.isDefault ? 'border-charcoal' : 'border-nude-100')}>
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    <Check size={11} /> Default
                  </span>
                )}
                <p className="font-body font-semibold text-charcoal">
                  {addr.firstName} {addr.lastName}
                </p>
                <div className="font-body text-sm text-nude-600 mt-1 space-y-0.5">
                  <p>{addr.address1}</p>
                  {addr.address2 && <p>{addr.address2}</p>}
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  {addr.phone && <p className="text-nude-400">{addr.phone}</p>}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-nude-100">
                  <button onClick={() => openEdit(addr)}
                    className="flex items-center gap-1.5 text-xs text-nude-500 hover:text-charcoal transition-colors">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-1.5 text-xs text-nude-500 hover:text-red-500 transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)}
                      className="flex items-center gap-1.5 text-xs text-nude-500 hover:text-green-600 transition-colors ml-auto">
                      <Check size={12} /> Varsayılan Yap
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
