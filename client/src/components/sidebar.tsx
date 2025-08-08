import { MessageCircle, Mic, Video, StickyNote, Keyboard, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navigationItems = [
    { id: 'chat', icon: MessageCircle, label: 'テキストチャット', emoji: '💬' },
    { id: 'voice', icon: Mic, label: 'ボイスチャット', emoji: '🎤' },
    { id: 'video', icon: Video, label: 'リモート会議', emoji: '📹' },
    { id: 'memo', icon: StickyNote, label: 'メモ', emoji: '📝' },
    { id: 'keyboard', icon: Keyboard, label: '仮想キーボード', emoji: '⌨️' },
    { id: 'tools', icon: Settings, label: 'その他ツール', emoji: '🛠️' },
  ];

  return (
    <aside className="w-16 lg:w-64 glassmorphism border-r border-white border-opacity-10 p-4">
      <nav className="space-y-4">
        {navigationItems.map((item) => (
          <div
            key={item.id}
            className={`glassmorphism-light rounded-lg p-3 hover:bg-opacity-20 transition-all cursor-pointer ${
              activeTab === item.id ? 'bg-opacity-30 border-river-blue' : ''
            }`}
            onClick={() => onTabChange(item.id)}
            data-testid={`nav-${item.id}`}
          >
            <div className="text-white font-medium hidden lg:block">
              {item.label}
            </div>
            <div className="text-white text-center lg:hidden text-xl">
              {item.emoji}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
