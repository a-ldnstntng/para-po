import { useState } from 'react';
import { Home, User, MessageSquare, Check, ArrowUpRight, ShieldCheck, MapPin } from 'lucide-react';
import type { UserProfile } from '../lib/userProfile';

interface ProfileTabProps {
  profile: UserProfile;
  onSaveProfile: (updates: Partial<UserProfile>) => void;
}

const COMMON_HOME_SUGGESTIONS = [
  'SJDM, Bulacan',
  'Antipolo, Rizal',
  'Fairview, Quezon City',
  'Bacoor, Cavite',
  'Caloocan North',
  'Marikina City',
];

export default function ProfileTab({ profile, onSaveProfile }: ProfileTabProps) {
  const [name, setName] = useState(profile.name || '');
  const [homeLocation, setHomeLocation] = useState(profile.homeLocation || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveProfile({
      name: name.trim(),
      homeLocation: homeLocation.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSelectHomeSuggestion = (loc: string) => {
    setHomeLocation(loc);
    onSaveProfile({ homeLocation: loc });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto min-h-[75vh] flex flex-col justify-center py-6 sm:py-10 space-y-6">
      {/* Title & Description */}
      <div className="text-left px-1 space-y-1">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Profile & Mga Setting
        </h2>
        <p className="font-body text-xs sm:text-sm text-slate-500 leading-relaxed">
          I-set ang iyong default na pinanggagalingan para mabilis mag-search ng ruta.
        </p>
      </div>

      {/* 1. PROFILE & DEFAULT HOME ORIGIN CARD */}
      <div className="ios-card p-6 sm:p-8 space-y-5 bg-white border border-slate-200/90 shadow-md">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-display font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>Pangalan o Palayaw</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Halimbawa: Juan Dela Cruz"
              className="w-full bg-slate-50/70 hover:bg-white border border-slate-300 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-3 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-orange-500/15 transition-all shadow-2xs"
            />
          </div>

          {/* Bahay Ko (Default Origin) */}
          <div>
            <label className="block text-xs font-display font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Home className="w-4 h-4 text-orange-500" />
              <span>Bahay Ko (Default na Pinanggagalingan)</span>
            </label>
            <input
              type="text"
              value={homeLocation}
              onChange={(e) => setHomeLocation(e.target.value)}
              placeholder="Halimbawa: SJDM, Bulacan o Antipolo, Rizal"
              className="w-full bg-slate-50/70 hover:bg-white border border-slate-300 focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-3 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-3 focus:ring-orange-500/15 transition-all shadow-2xs"
            />
            <p className="text-xs font-body text-slate-500 mt-2 leading-relaxed">
              Kapag naka-set ito, <strong>"Saan ka pupunta?"</strong> na lang ang itatanong ng app at automatic itong gagamitin bilang iyong simula.
            </p>

            {/* Quick Home Suggestions */}
            <div className="pt-2">
              <span className="text-[11px] font-body text-slate-400 font-medium block mb-2">
                Pumili sa mga sikat na lokasyon:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {COMMON_HOME_SUGGESTIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleSelectHomeSuggestion(loc)}
                    className="suggestion-pill text-xs py-1.5 px-3 bg-white border border-slate-300 hover:border-orange-500 hover:text-orange-600 shadow-2xs"
                  >
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span className="font-semibold">{loc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button Row */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              type="submit"
              className="btn-sakay-primary !py-2.5 !px-6 !text-xs !rounded-xl"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Nai-save Na!</span>
                </>
              ) : (
                <span>I-save ang Profile</span>
              )}
            </button>

            {homeLocation && (
              <button
                type="button"
                onClick={() => {
                  setHomeLocation('');
                  onSaveProfile({ homeLocation: '' });
                }}
                className="btn-transit-secondary !py-2.5 !px-4 !text-xs !rounded-xl"
              >
                Alisin ang Bahay Ko
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 2. FEEDBACK & REPORT SECTION */}
      <div className="ios-card p-5 sm:p-6 space-y-3 bg-white border border-slate-200/90 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900">
              Tulong at Ulat sa Datos
            </h3>
            <p className="text-xs font-body text-slate-400">
              May nagbago bang pamasahe o rutang sarado na?
            </p>
          </div>
        </div>

        <div className="pt-1">
          <a
            href="mailto:support@parapo.ph?subject=Ulat%20sa%20Ruta%20o%20Pamasahe%20ng%20Para%20Po"
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-3.5 text-slate-800 font-body text-xs font-semibold flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Magsumite ng feedback o pagwawasto sa ruta</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

      {/* 3. BRANDING FOOTER */}
      <div className="pt-2 text-center space-y-1">
        <p className="font-display font-extrabold text-xs text-slate-700 uppercase tracking-wide">
          PARA PO! — NCR Commute Guide
        </p>
        <p className="font-body text-xs text-slate-400">
          Ginawa para sa mga estudyante at commuter ng Pilipinas
        </p>
      </div>
    </div>
  );
}
