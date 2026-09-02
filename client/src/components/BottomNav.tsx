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
    <nav className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:bottom-4 z-40 w-full sm:max-w-md bg-white/95 backdrop-blur-xl border-t sm:border border-slate-200/80 sm:rounded-full shadow-lg sm:shadow-2xl pb-[env(safe-area-inset-bottom,0.5rem)] sm:pb-0 transition-all">
      <div className="flex items-center justify-around px-3 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={`
                flex-1 flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-2xl sm:rounded-full transition-all cursor-pointer
                ${isActive ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <div className="relative">
                <span
                  className={`
                    inline-flex items-center justify-center w-10 h-8 rounded-xl sm:rounded-full transition-colors
                    ${isActive ? 'bg-orange-50 text-orange-600' : 'bg-transparent text-slate-400'}
                  `}
                >
                  <Icon
                    className="w-5 h-5 transition-transform"
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                </span>
                {tab.badge !== undefined && (
                  <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-utility font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`
                  text-[11px] font-display tracking-tight transition-colors
                  ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}
                `}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
