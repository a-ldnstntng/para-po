import { Compass, Clock, User } from 'lucide-react';

export type TabType = 'search' | 'byahe_ko' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  savedCount?: number;
}

export default function BottomNav({
  activeTab,
  onChangeTab,
  savedCount = 0,
}: BottomNavProps) {
  const tabs = [
    {
      id: 'search' as TabType,
      label: 'Search',
      icon: Compass,
    },
    {
      id: 'byahe_ko' as TabType,
      label: 'Byahe Ko',
      icon: Clock,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'profile' as TabType,
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/80 shadow-lg pb-[env(safe-area-inset-bottom,0.5rem)]">
      <div className="max-w-xl lg:max-w-2xl mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              type="button"
              className={`
                flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer relative
                ${isActive ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] font-utility font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-display font-bold mt-1 tracking-tight ${isActive ? 'text-orange-600' : 'text-slate-500 font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
