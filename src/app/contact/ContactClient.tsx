'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Check } from 'lucide-react'

export default function ContactClient() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <div className="container-main py-16">
      <h1 className="text-3xl mb-6">İletişim</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          placeholder="Ad"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border p-3"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border p-3"
        />
        <input
          placeholder="Konu"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
          className="w-full border p-3"
        />
        <textarea
          placeholder="Mesaj"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full border p-3"
        />

        <button className="btn-primary px-6 py-3">Gönder</button>
      </form>
    </div>
  )
}
