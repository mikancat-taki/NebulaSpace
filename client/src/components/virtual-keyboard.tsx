import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Delete, Space } from 'lucide-react';

export function VirtualKeyboard() {
  const [text, setText] = useState('');
  const [isShift, setIsShift] = useState(false);
  const [isJapanese, setIsJapanese] = useState(true);

  const japaneseLayout = [
    ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り'],
    ['る', 'れ', 'ろ', 'わ', 'を', 'ん', '、', '。', '！', '？']
  ];

  const englishLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const currentLayout = isJapanese ? japaneseLayout : englishLayout;

  const handleKeyPress = (key: string) => {
    if (isShift && !isJapanese) {
      setText(prev => prev + key.toUpperCase());
    } else {
      setText(prev => prev + key);
    }
    setIsShift(false);
  };

  const handleSpace = () => {
    setText(prev => prev + ' ');
  };

  const handleBackspace = () => {
    setText(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setText('');
  };

  const handleEnter = () => {
    setText(prev => prev + '\n');
  };

  const toggleLanguage = () => {
    setIsJapanese(!isJapanese);
    setIsShift(false);
  };

  const toggleShift = () => {
    setIsShift(!isShift);
  };

  return (
    <section className="flex-1 flex flex-col glassmorphism">
      <div className="glassmorphism border-b border-white border-opacity-10 p-4">
        <h2 className="text-white text-xl font-semibold" data-testid="keyboard-title">
          仮想キーボード
        </h2>
        <p className="text-white opacity-70 text-sm">
          {isJapanese ? '日本語入力モード' : '英語入力モード'}
        </p>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        {/* Text Area */}
        <div className="mb-6">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isJapanese ? "ここに文字が表示されます..." : "Text will appear here..."}
            className="glassmorphism-light border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60 min-h-[150px] text-lg"
            data-testid="keyboard-textarea"
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Button
              onClick={toggleLanguage}
              className={`${isJapanese ? 'bg-river-blue' : 'bg-mountain-gray'} hover:bg-opacity-80 text-white`}
              data-testid="toggle-language"
            >
              {isJapanese ? 'あ' : 'A'}
            </Button>
            
            {!isJapanese && (
              <Button
                onClick={toggleShift}
                className={`${isShift ? 'bg-river-blue' : 'bg-mountain-gray'} hover:bg-opacity-80 text-white`}
                data-testid="toggle-shift"
              >
                Shift
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleClear}
              variant="destructive"
              data-testid="clear-text"
            >
              全消去
            </Button>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="glassmorphism-light rounded-lg p-4 flex-1">
          <div className="grid gap-2 max-w-4xl mx-auto" data-testid="virtual-keyboard">
            {currentLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1">
                {row.map((key) => (
                  <Button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className="glassmorphism-light border-white border-opacity-20 text-white hover:bg-opacity-30 min-w-[40px] h-12 text-lg font-medium"
                    data-testid={`key-${key}`}
                  >
                    {isShift && !isJapanese ? key.toUpperCase() : key}
                  </Button>
                ))}
              </div>
            ))}
            
            {/* Bottom row with special keys */}
            <div className="flex justify-center gap-1 mt-2">
              <Button
                onClick={handleSpace}
                className="glassmorphism-light border-white border-opacity-20 text-white hover:bg-opacity-30 px-8 h-12"
                data-testid="space-key"
              >
                <Space className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handleEnter}
                className="glassmorphism-light border-white border-opacity-20 text-white hover:bg-opacity-30 px-6 h-12"
                data-testid="enter-key"
              >
                改行
              </Button>
              
              <Button
                onClick={handleBackspace}
                className="glassmorphism-light border-white border-opacity-20 text-white hover:bg-opacity-30 px-6 h-12"
                data-testid="backspace-key"
              >
                <Delete className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
