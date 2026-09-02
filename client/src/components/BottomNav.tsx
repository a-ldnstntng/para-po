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
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[430px] bg-white/90 backdrop-blur-xl border-t border-hairline pb-[env(safe-area-inset-bottom,0.5rem)] lg:shadow-[0_0_60px_-15px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-around px-3 pt-2 pb-1">
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
                flex-1 flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-2xl transition-colors cursor-pointer
                ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink-muted'}
              `}
            >
              <div className="relative">
                {/* Icon chip: soft rounded square behind the icon */}
                <span
                  className={`
                    inline-flex items-center justify-center w-11 h-8 rounded-xl transition-colors
                    ${isActive ? 'bg-accent-soft' : 'bg-transparent'}
                  `}
                >
                  {/* Filled/solid only on the active tab; outline otherwise */}
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors ${
                      isActive ? 'text-accent-strong' : 'text-current'
                    }`}
                    fill={isActive ? 'currentColor' : 'none'}
                    strokeWidth={isActive ? 1.75 : 2}
                  />
                </span>
                {tab.badge !== undefined && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-strong text-white text-[9px] font-utility font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`
                  text-[11px] font-display tracking-tight transition-colors
                  ${isActive ? 'text-ink font-bold' : 'text-ink-soft font-medium'}
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
