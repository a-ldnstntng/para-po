import { Bus, Train, Coins, Clock, Sparkles, ShieldCheck } from 'lucide-react';

interface TransitHubProps {
  onSelectRoute: (prompt: string) => void;
}

const POPULAR_CORRIDORS = [
  {
    title: 'EDSA Carousel Busway',
    tag: '24/7 Bus',
    badge: 'Express Lane',
    prompt: 'Mula Monumento, sumakay ng EDSA Carousel Bus papuntang PITX.',
    icon: Bus,
    iconBg: 'bg-amber-50 text-amber-600',
    description: 'Dedicated busway mula Monumento hanggang PITX Parañaque.',
  },
  {
    title: 'LRT-2 East Extension',
    tag: 'Train Rail',
    badge: 'Iwas Traffic',
    prompt: 'Galing Recto Station, mag-LRT-2 diretso hanggang Antipolo Masinag.',
    icon: Train,
    iconBg: 'bg-purple-50 text-purple-600',
    description: 'Mabilis na byahe mula Maynila (Recto/Pureza/Cubao) pa-Antipolo.',
  },
  {
    title: 'Fairview - Buendia UV',
    tag: 'UV Express',
    badge: 'Aircon',
    prompt: 'Galing SM Fairview, sumakay ng UV Express papuntang Buendia Taft.',
    icon: Bus,
    iconBg: 'bg-cyan-50 text-cyan-600',
    description: 'Commonwealth Avenue direct van corridor pa-Makati at Manila.',
  },
  {
    title: 'Ayala BGC Express Bus',
    tag: 'BGC Bus',
    badge: 'Point-to-Point',
    prompt: 'Mula MRT-3 Ayala Station, sumakay ng BGC Bus papuntang Market! Market! BGC.',
    icon: Bus,
    iconBg: 'bg-emerald-50 text-emerald-600',
    description: 'Direct aircon hop mula EDSA Ayala papasok sa Bonifacio Global City.',
  },
];

const FARE_RATES = [
  { mode: 'Traditional Jeep', base: '₱13.00', succ: '+₱1.80/km', desc: 'First 4 km' },
  { mode: 'Modern PUV', base: '₱15.00', succ: '+₱2.20/km', desc: 'Aircon / CCTV' },
  { mode: 'City Bus', base: '₱15.00', succ: '+₱2.65/km', desc: 'Aircon Bus' },
  { mode: 'MRT-3 / LRT', base: '₱13-₱35', succ: 'Distance based', desc: 'Beep Card' },
];

export default function TransitHub({ onSelectRoute }: TransitHubProps) {
  return (
    <section className="w-full space-y-4 pt-1">
      {/* 1. FARE MATRIX QUICK REFERENCE (iOS Card Group) */}
      <div className="ios-card p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">
                Opisyal na Pamasahe sa NCR
              </h3>
              <p className="text-[11px] font-body text-slate-400">
                LTFRB standard rates guide (2026)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-body font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
            Updated
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FARE_RATES.map((f, i) => (
            <div key={i} className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-wider block">
                  {f.mode}
                </span>
                <div className="font-display font-extrabold text-base text-slate-900 mt-0.5">
                  {f.base}
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/50 text-[10px] font-body text-slate-500 font-medium flex items-center justify-between">
                <span>{f.succ}</span>
                <span className="text-slate-400">{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. POPULAR METRO MANILA TRANSIT CORRIDORS */}
      <div className="ios-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900">
                Mga Sikat na Ruta sa NCR
              </h3>
              <p className="text-[11px] font-body text-slate-400">
                I-tap para makita ang kumpletong sakayan
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {POPULAR_CORRIDORS.map((c, i) => {
            const IconComp = c.icon;
            return (
              <button
                key={i}
                onClick={() => onSelectRoute(c.prompt)}
                type="button"
                className="bg-slate-50/70 hover:bg-slate-100/90 border border-slate-100 hover:border-slate-300 rounded-2xl p-3.5 text-left transition-all cursor-pointer flex items-start gap-3 group"
              >
                <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-display font-bold text-xs text-slate-900 truncate">
                      {c.title}
                    </span>
                    <span className="text-[9px] font-body font-semibold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-full flex-shrink-0">
                      {c.badge}
                    </span>
                  </div>
                  <p className="text-[11px] font-body text-slate-400 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. COMMUTER ADVISORY & REMINDERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="ios-card p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-xs text-slate-900 block">
              Rush Hour Hours sa Metro
            </span>
            <p className="text-[11px] font-body text-slate-400 mt-0.5 leading-relaxed">
              Mabigat ang traffic tuwing <strong>6:30 AM – 9:00 AM</strong> at <strong>5:00 PM – 8:30 PM</strong>. Maglaan ng dagdag 20–30 mins.
            </p>
          </div>
        </div>

        <div className="ios-card p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-xs text-slate-900 block">
              20% Discount sa Pamasahe
            </span>
            <p className="text-[11px] font-body text-slate-400 mt-0.5 leading-relaxed">
              May 20% discount ang mga <strong>Estudyante, Senior Citizens, at PWDs</strong> sa lahat ng PUVs, bus, at tren.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
