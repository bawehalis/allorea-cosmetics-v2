// src/app/admin/urgency/page.tsx
'use client'
import { useState } from 'react'
import { Flame, Users, AlertCircle, Save, CheckCircle, Eye } from 'lucide-react'

interface UrgencyConfig {
  buyers24hEnabled: boolean
  buyers24hCount:   number
  stockWarningEnabled: boolean
  stockWarningThreshold: number
  viewersEnabled:   boolean
  viewersCount:     number
  customText:       string
  customTextEnabled: boolean
}

const DEFAULT: UrgencyConfig = {
  buyers24hEnabled:    true,
  buyers24hCount:      128,
  stockWarningEnabled: true,
  stockWarningThreshold: 20,
  viewersEnabled:      true,
  viewersCount:        23,
  customText:          '🔥 Bu ürün trend! Hızlı karar verin.',
  customTextEnabled:   false,
}

export default function AdminUrgencyPage() {
  const [cfg,   setCfg]   = useState<UrgencyConfig>(DEFAULT)
  const [saved, setSaved] = useState(false)

  const upd = (k: keyof UrgencyConfig, v: any) => setCfg(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Toggle = ({ label, field, sub }: { label: string; field: keyof UrgencyConfig; sub?: string }) => (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5">
        <input type="checkbox" className="sr-only" checked={!!cfg[field]}
          onChange={e => upd(field, e.target.checked)} />
        <div className={`w-10 h-5 rounded-full transition-colors ${cfg[field] ? 'bg-brand-600' : 'bg-gray-200'}`} />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${cfg[field] ? 'translate-x-5' : ''}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </label>
  )

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">FOMO Ayarları</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ürün sayfasındaki aciliyet göstergelerini yönet</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
          {saved ? <><CheckCircle size={16} /> Kaydedildi</> : <><Save size={16} /> Kaydet</>}
        </button>
      </div>

      {/* Önizleme */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Eye size={16} /> Anlık Önizleme
        </h2>
        <div className="space-y-2 max-w-sm">
          {cfg.buyers24hEnabled && (
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
              <Flame size={14} className="text-amber-500 shrink-0" />
              <p className="text-xs font-semibold text-amber-800">
                Son 24 saatte <span className="font-black text-amber-900">{cfg.buyers24hCount}</span> kişi satın aldı
              </p>
            </div>
          )}
          {cfg.stockWarningEnabled && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-red-700">Stokta sadece {cfg.stockWarningThreshold} adet kaldı!</p>
                <p className="text-[10px] text-red-500 mt-0.5">Kritik stok seviyesi</p>
              </div>
            </div>
          )}
          {cfg.viewersEnabled && (
            <div className="flex items-center gap-2 text-nude-600">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <Users size={12} className="text-green-600" />
              <p className="text-xs font-medium">Şu an <span className="font-bold text-charcoal">{cfg.viewersCount}</span> kişi bu ürünü inceliyor</p>
            </div>
          )}
          {cfg.customTextEnabled && (
            <div className="bg-brand-50 border border-brand-200 rounded-xl px-3.5 py-2.5">
              <p className="text-xs font-semibold text-brand-800">{cfg.customText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Ayarlar */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">

        {/* 24s alım */}
        <div className="p-5 space-y-4">
          <Toggle label="24 Saatlik Satın Alma Sayısı" field="buyers24hEnabled"
            sub="'Son 24 saatte X kişi satın aldı' mesajını göster" />
          {cfg.buyers24hEnabled && (
            <div className="ml-13">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Gösterilecek Sayı</label>
              <input type="number" min={1} max={9999}
                value={cfg.buyers24hCount}
                onChange={e => upd('buyers24hCount', +e.target.value)}
                className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              <p className="text-xs text-gray-400 mt-1">Gerçekçi görünen bir rakam seçin (50–300 arası önerilir)</p>
            </div>
          )}
        </div>

        {/* Stok uyarısı */}
        <div className="p-5 space-y-4">
          <Toggle label="Stok Uyarısı" field="stockWarningEnabled"
            sub="Kritik stok seviyesinde kırmızı uyarı göster" />
          {cfg.stockWarningEnabled && (
            <div className="ml-13">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Uyarı Eşiği (adet)</label>
              <input type="number" min={1} max={999}
                value={cfg.stockWarningThreshold}
                onChange={e => upd('stockWarningThreshold', +e.target.value)}
                className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              <p className="text-xs text-gray-400 mt-1">Bu miktarın altında olan ürünlerde uyarı gösterilir</p>
            </div>
          )}
        </div>

        {/* Anlık izleyici */}
        <div className="p-5 space-y-4">
          <Toggle label="Anlık İzleyici Sayısı" field="viewersEnabled"
            sub="'Şu an X kişi inceliyor' göstergesi" />
          {cfg.viewersEnabled && (
            <div className="ml-13">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Gösterilecek Sayı</label>
              <input type="number" min={1} max={999}
                value={cfg.viewersCount}
                onChange={e => upd('viewersCount', +e.target.value)}
                className="w-32 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          )}
        </div>

        {/* Özel metin */}
        <div className="p-5 space-y-4">
          <Toggle label="Özel Mesaj Bandı" field="customTextEnabled"
            sub="Ürün sayfasında ek bir bildirim mesajı göster" />
          {cfg.customTextEnabled && (
            <div className="ml-13">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Mesaj</label>
              <input type="text"
                value={cfg.customText}
                onChange={e => upd('customText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
