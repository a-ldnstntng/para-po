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
    <div className="w-full max-w-xl lg:max-w-2xl mx-auto space-y-4 pt-2">
      {/* Title */}
      <div className="px-1 text-left">
        <h2 className="font-display font-bold text-xl text-slate-900 tracking-tight">
          Profile & Mga Setting
        </h2>
        <p className="font-body text-xs text-slate-400 mt-0.5">
          I-set ang iyong default na tirahan para mas mabilis mag-search
        </p>
      </div>

      {/* 1. PROFILE & DEFAULT HOME ORIGIN CARD */}
      <div className="ios-card p-5 sm:p-6 space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-display font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Pangalan o Palayaw</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Halimbawa: Juan"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>

          {/* Bahay Ko (Default Origin) */}
          <div>
            <label className="block text-xs font-display font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-orange-500" />
              <span>Bahay Ko (Default na Pinanggagalingan)</span>
            </label>
            <input
              type="text"
              value={homeLocation}
              onChange={(e) => setHomeLocation(e.target.value)}
              placeholder="Halimbawa: SJDM, Bulacan o Antipolo, Rizal"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            <p className="text-[11px] font-body text-slate-400 mt-1">
              Kapag naka-set ito, "Saan ka pupunta?" na lang ang itatanong ng app at automatic itong gagamitin bilang origin.
            </p>

            {/* Quick Home Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              {COMMON_HOME_SUGGESTIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelectHomeSuggestion(loc)}
                  className="suggestion-pill text-[11px] py-1 px-2.5"
                >
                  <MapPin className="w-2.5 h-2.5 text-slate-400" />
                  <span>{loc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="btn-sakay-primary !py-2 !px-4 !text-xs"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
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
                className="btn-transit-secondary !py-2 !px-3 !text-xs"
              >
                Alisin ang Bahay Ko
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 2. FEEDBACK & REPORT SECTION */}
      <div className="ios-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900">
              Tulong at Ulat sa Datos
            </h3>
            <p className="text-[11px] font-body text-slate-400">
              May nagbago bang pamasahe o rutang sarado na?
            </p>
          </div>
        </div>

        <div className="pt-1">
          <a
            href="mailto:support@parapo.ph?subject=Ulat%20sa%20Ruta%20o%20Pamasahe%20ng%20Para%20Po"
            className="w-full bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 rounded-2xl p-3 text-slate-800 font-body text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Magsumite ng feedback o pagwawasto</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* 3. QUIET BRANDING INFO */}
      <div className="py-4 text-center space-y-1">
        <p className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-wide">
          PARA PO! — NCR Commute Guide
        </p>
        <p className="font-body text-[11px] text-slate-400">
          Ginawa para sa mga estudyante at commuter ng Pilipinas
        </p>
      </div>
    </div>
  );
}
