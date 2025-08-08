import { useState } from 'react';
import { Calculator, Languages, Search, Music, FileText, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ToolsPanelProps {
  activeTool: string | null;
  onToolSelect: (tool: string | null) => void;
}

export function ToolsPanel({ activeTool, onToolSelect }: ToolsPanelProps) {
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');
  const [translatorText, setTranslatorText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState('');
  const [textEditorContent, setTextEditorContent] = useState('');

  const tools = [
    { id: 'translator', icon: Languages, label: '翻訳ツール', emoji: '🌐' },
    { id: 'calculator', icon: Calculator, label: '計算機', emoji: '📊' },
    { id: 'search', icon: Search, label: '検索ツール', emoji: '🔍' },
    { id: 'textEditor', icon: FileText, label: 'テキストエディタ', emoji: '📝' },
    { id: 'imageEditor', icon: Image, label: 'デザインツール', emoji: '🎨' },
    { id: 'musicPlayer', icon: Music, label: '音楽プレイヤー', emoji: '🎵' },
  ];

  const calculate = () => {
    try {
      // Simple calculator using eval (in real app, use a proper math parser)
      const result = eval(calculatorInput.replace(/[^0-9+\-*/().]/g, ''));
      setCalculatorResult(result.toString());
    } catch (error) {
      setCalculatorResult('エラー');
    }
  };

  const translate = () => {
    // Simple mock translation (in real app, use translation API)
    const translations: { [key: string]: string } = {
      'hello': 'こんにちは',
      'thank you': 'ありがとう',
      'good morning': 'おはよう',
      'good night': 'おやすみ',
      'how are you': '元気ですか',
      'こんにちは': 'hello',
      'ありがとう': 'thank you',
      'おはよう': 'good morning',
      'おやすみ': 'good night',
      '元気ですか': 'how are you'
    };
    
    const result = translations[translatorText.toLowerCase()] || 
                  `翻訳: ${translatorText} (リアル翻訳APIが必要です)`;
    setTranslatedText(result);
  };

  const search = () => {
    // Mock search results
    setSearchResults(`検索結果: "${searchQuery}" に関する情報が見つかりました。
    
1. Wikipedia - ${searchQuery}の詳細情報
2. Google - ${searchQuery}に関連するサイト
3. YouTube - ${searchQuery}の動画
4. News - ${searchQuery}のニュース

注意: これはモック検索です。実際のAPIが必要です。`);
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case 'calculator':
        return (
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">計算機</h3>
            <Input
              value={calculatorInput}
              onChange={(e) => setCalculatorInput(e.target.value)}
              placeholder="計算式を入力 (例: 2+2*3)"
              className="glassmorphism-light border-white border-opacity-20 text-white"
              data-testid="calculator-input"
            />
            <Button
              onClick={calculate}
              className="bg-river-blue hover:bg-river-light text-white w-full"
              data-testid="calculate-button"
            >
              計算
            </Button>
            {calculatorResult && (
              <div className="glassmorphism-light rounded-lg p-4">
                <p className="text-white">結果: {calculatorResult}</p>
              </div>
            )}
          </div>
        );

      case 'translator':
        return (
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">翻訳ツール</h3>
            <Textarea
              value={translatorText}
              onChange={(e) => setTranslatorText(e.target.value)}
              placeholder="翻訳したいテキストを入力"
              className="glassmorphism-light border-white border-opacity-20 text-white min-h-[100px]"
              data-testid="translator-input"
            />
            <Button
              onClick={translate}
              className="bg-river-blue hover:bg-river-light text-white w-full"
              data-testid="translate-button"
            >
              翻訳
            </Button>
            {translatedText && (
              <div className="glassmorphism-light rounded-lg p-4">
                <p className="text-white">{translatedText}</p>
              </div>
            )}
          </div>
        );

      case 'search':
        return (
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">検索ツール</h3>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索キーワードを入力"
              className="glassmorphism-light border-white border-opacity-20 text-white"
              data-testid="search-input"
            />
            <Button
              onClick={search}
              className="bg-river-blue hover:bg-river-light text-white w-full"
              data-testid="search-button"
            >
              検索
            </Button>
            {searchResults && (
              <div className="glassmorphism-light rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-white text-sm whitespace-pre-wrap">{searchResults}</pre>
              </div>
            )}
          </div>
        );

      case 'textEditor':
        return (
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">テキストエディタ</h3>
            <Textarea
              value={textEditorContent}
              onChange={(e) => setTextEditorContent(e.target.value)}
              placeholder="テキストを入力..."
              className="glassmorphism-light border-white border-opacity-20 text-white min-h-[300px]"
              data-testid="text-editor"
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => setTextEditorContent('')}
                variant="destructive"
                data-testid="clear-editor"
              >
                クリア
              </Button>
              <Button
                onClick={() => navigator.clipboard.writeText(textEditorContent)}
                className="bg-mountain-gray hover:bg-mountain-light text-white"
                data-testid="copy-text"
              >
                コピー
              </Button>
            </div>
            <div className="text-white text-sm opacity-70">
              文字数: {textEditorContent.length}
            </div>
          </div>
        );

      case 'imageEditor':
        return (
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">デザインツール</h3>
            <div className="glassmorphism-light rounded-lg p-8 text-center">
              <Image className="w-16 h-16 text-white opacity-50 mx-auto mb-4" />
              <p className="text-white opacity-70 mb-4">
                簡単な画像編集ツール
              </p>
              <p className="text-white text-sm opacity-50">
                このツールは開発中です。将来的には基本的な画像編集機能を提供予定です。
              </p>
            </div>
          </div>
        );

      case 'musicPlayer':
        return (
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">音楽プレイヤー</h3>
            <div className="glassmorphism-light rounded-lg p-8 text-center">
              <Music className="w-16 h-16 text-white opacity-50 mx-auto mb-4" />
              <p className="text-white opacity-70 mb-4">
                音楽再生機能
              </p>
              <div className="space-y-2">
                <Button className="bg-mountain-gray hover:bg-mountain-light text-white w-full" disabled>
                  ⏯️ 再生/一時停止
                </Button>
                <Button className="bg-mountain-gray hover:bg-mountain-light text-white w-full" disabled>
                  ⏹️ 停止
                </Button>
                <Button className="bg-mountain-gray hover:bg-mountain-light text-white w-full" disabled>
                  📁 ファイルを選択
                </Button>
              </div>
              <p className="text-white text-sm opacity-50 mt-4">
                このツールは開発中です。音楽ファイルの再生機能を提供予定です。
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <section className="flex-1 flex flex-col glassmorphism">
        <div className="glassmorphism border-b border-white border-opacity-10 p-4">
          <h2 className="text-white text-xl font-semibold">その他ツール</h2>
          <p className="text-white opacity-70 text-sm">便利なツールを利用できます</p>
        </div>
        
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="glassmorphism-light rounded-lg p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer"
                onClick={() => onToolSelect(tool.id)}
                data-testid={`tool-${tool.id}`}
              >
                <div className="text-4xl mb-4">{tool.emoji}</div>
                <h3 className="text-white text-lg font-medium mb-2">{tool.label}</h3>
                <p className="text-white opacity-70 text-sm">クリックで開く</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Modal */}
      <Dialog open={!!activeTool} onOpenChange={() => onToolSelect(null)}>
        <DialogContent className="glassmorphism border-white border-opacity-20 max-w-2xl" data-testid="tool-modal">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold flex justify-between items-center">
              {tools.find(t => t.id === activeTool)?.label || 'ツール'}
              <button 
                onClick={() => onToolSelect(null)}
                className="text-white opacity-70 hover:opacity-100"
                data-testid="close-tool"
              >
                <X className="w-6 h-6" />
              </button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {renderToolContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}