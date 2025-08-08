import { useState } from 'react';
import { Mic, StickyNote } from 'lucide-react';
import { NatureBackground } from '@/components/nature-background';
import { TimeWidget } from '@/components/time-widget';
import { Sidebar } from '@/components/sidebar';
import { ChatArea } from '@/components/chat-area';
import { CalendarModal } from '@/components/calendar-modal';
import { MemoModal } from '@/components/memo-modal';
import { VoiceChat } from '@/components/voice-chat';
import { VirtualKeyboard } from '@/components/virtual-keyboard';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatArea />;
      case 'voice':
      case 'video':
        return <VoiceChat />;
      case 'memo':
        return (
          <section className="flex-1 flex flex-col glassmorphism">
            <div className="glassmorphism border-b border-white border-opacity-10 p-4">
              <h2 className="text-white text-xl font-semibold">メモ</h2>
              <p className="text-white opacity-70 text-sm">メモを作成・編集できます</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Button
                onClick={() => setIsMemoOpen(true)}
                className="bg-river-blue hover:bg-river-light text-white px-8 py-4 text-lg"
                data-testid="open-memo-modal"
              >
                <StickyNote className="w-6 h-6 mr-2" />
                メモ帳を開く
              </Button>
            </div>
          </section>
        );
      case 'keyboard':
        return <VirtualKeyboard />;
      case 'tools':
        return (
          <section className="flex-1 flex flex-col glassmorphism">
            <div className="glassmorphism border-b border-white border-opacity-10 p-4">
              <h2 className="text-white text-xl font-semibold">その他ツール</h2>
              <p className="text-white opacity-70 text-sm">便利なツールを利用できます</p>
            </div>
            <div className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glassmorphism-light rounded-lg p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                  <div className="text-4xl mb-4">🌐</div>
                  <h3 className="text-white text-lg font-medium mb-2">翻訳ツール</h3>
                  <p className="text-white opacity-70 text-sm">多言語翻訳機能</p>
                </div>
                
                <div className="glassmorphism-light rounded-lg p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-white text-lg font-medium mb-2">デザインツール</h3>
                  <p className="text-white opacity-70 text-sm">簡単な画像編集</p>
                </div>
                
                <div className="glassmorphism-light rounded-lg p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-white text-lg font-medium mb-2">計算機</h3>
                  <p className="text-white opacity-70 text-sm">高機能計算機</p>
                </div>
                
                <div className="glassmorphism-light rounded-lg p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-white text-lg font-medium mb-2">テキストエディタ</h3>
                  <p className="text-white opacity-70 text-sm">リッチテキスト編集</p>
                </div>
                
                <div className="glassmorphism-light rounded-lg p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-white text-lg font-medium mb-2">検索ツール</h3>
                  <p className="text-white opacity-70 text-sm">ウェブ検索機能</p>
                </div>
                
                <div className="glassmorphism-light rounded-lg p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer">
                  <div className="text-4xl mb-4">🎵</div>
                  <h3 className="text-white text-lg font-medium mb-2">音楽プレイヤー</h3>
                  <p className="text-white opacity-70 text-sm">音楽再生機能</p>
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return <ChatArea />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NatureBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-between items-center">
          <TimeWidget onClick={() => setIsCalendarOpen(true)} />
          
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold tracking-wider" data-testid="app-title">
              Nebula-space
            </h1>
            <p className="text-white opacity-70 text-sm">自然の中でつながる</p>
          </div>

          <div className="glassmorphism rounded-lg p-3 border border-white border-opacity-20">
            <div className="w-8 h-8 glassmorphism-light rounded-full"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          {renderMainContent()}
        </main>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 space-y-3 z-20">
          <Button
            className="w-12 h-12 bg-river-blue hover:bg-river-light text-white rounded-full shadow-lg hover:shadow-xl transition-all animate-float"
            style={{animationDelay: '0.5s'}}
            onClick={() => setActiveTab('voice')}
            data-testid="quick-voice-button"
          >
            <Mic className="w-5 h-5" />
          </Button>
          
          <Button
            className="w-12 h-12 bg-mountain-gray hover:bg-mountain-light text-white rounded-full shadow-lg hover:shadow-xl transition-all animate-float"
            style={{animationDelay: '1s'}}
            onClick={() => setIsMemoOpen(true)}
            data-testid="quick-memo-button"
          >
            <StickyNote className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
      />
      
      <MemoModal 
        isOpen={isMemoOpen} 
        onClose={() => setIsMemoOpen(false)} 
      />
    </div>
  );
}
