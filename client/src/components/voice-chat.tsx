import { useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Copy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebRTC } from '@/hooks/use-webrtc';
import { useToast } from '@/hooks/use-toast';

export function VoiceChat() {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const { toast } = useToast();
  
  const {
    isCallActive,
    isVideoEnabled,
    isAudioEnabled,
    localVideoRef,
    remoteVideoRef,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo
  } = useWebRTC();

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createRoom = (isVideo = false) => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setCurrentRoom(newRoomCode);
    setIsCreatingRoom(true);
    setShowVideoCall(isVideo);
    startCall(isVideo);
    
    toast({
      title: "ルームを作成しました",
      description: `ルームコード: ${newRoomCode}`,
    });
  };

  const joinRoom = (isVideo = false) => {
    if (!joinRoomCode.trim()) {
      toast({
        title: "エラー",
        description: "ルームコードを入力してください。",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentRoom(joinRoomCode.trim().toUpperCase());
    setIsJoiningRoom(true);
    setShowVideoCall(isVideo);
    startCall(isVideo);
    
    toast({
      title: "ルームに参加しました",
      description: `ルームコード: ${joinRoomCode.trim().toUpperCase()}`,
    });
  };

  const handleEndCall = () => {
    endCall();
    setShowVideoCall(false);
    setCurrentRoom('');
    setRoomCode('');
    setJoinRoomCode('');
    setIsCreatingRoom(false);
    setIsJoiningRoom(false);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: "コピーしました",
      description: "ルームコードがクリップボードにコピーされました。",
    });
  };

  return (
    <section className="flex-1 flex flex-col glassmorphism">
      <div className="glassmorphism border-b border-white border-opacity-10 p-4">
        <h2 className="text-white text-xl font-semibold" data-testid="voice-chat-title">
          ボイス・ビデオチャット
        </h2>
        <p className="text-white opacity-70 text-sm">
          {isCallActive ? '通話中' : '通話を開始してください'}
        </p>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        {!isCallActive ? (
          // Room Setup Interface
          <div className="text-center space-y-8 max-w-md mx-auto">
            <div className="glassmorphism-light rounded-full w-32 h-32 flex items-center justify-center mb-8 mx-auto">
              <Users className="w-16 h-16 text-white opacity-70" />
            </div>
            
            {/* Create Room Section */}
            <div className="glassmorphism-light rounded-lg p-6 space-y-4">
              <h3 className="text-white text-lg font-medium">ルームを作成</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => createRoom(false)}
                  className="bg-river-blue hover:bg-river-light text-white px-6 py-3 w-full"
                  data-testid="create-voice-room"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  音声通話ルーム作成
                </Button>
                
                <Button
                  onClick={() => createRoom(true)}
                  className="bg-mountain-gray hover:bg-mountain-light text-white px-6 py-3 w-full"
                  data-testid="create-video-room"
                >
                  <Video className="w-5 h-5 mr-2" />
                  ビデオ通話ルーム作成
                </Button>
              </div>
            </div>

            {/* Join Room Section */}
            <div className="glassmorphism-light rounded-lg p-6 space-y-4">
              <h3 className="text-white text-lg font-medium">ルームに参加</h3>
              <Input
                value={joinRoomCode}
                onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                placeholder="ルームコードを入力 (例: ABC123)"
                className="glassmorphism-light border-white border-opacity-20 text-white text-center"
                maxLength={6}
                data-testid="room-code-input"
              />
              <div className="space-y-3">
                <Button
                  onClick={() => joinRoom(false)}
                  disabled={!joinRoomCode.trim()}
                  className="bg-river-blue hover:bg-river-light text-white px-6 py-3 w-full"
                  data-testid="join-voice-room"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  音声通話で参加
                </Button>
                
                <Button
                  onClick={() => joinRoom(true)}
                  disabled={!joinRoomCode.trim()}
                  className="bg-mountain-gray hover:bg-mountain-light text-white px-6 py-3 w-full"
                  data-testid="join-video-room"
                >
                  <Video className="w-5 h-5 mr-2" />
                  ビデオ通話で参加
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Active Call Interface
          <div className="flex-1 w-full flex flex-col">
            {showVideoCall && (
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Local Video */}
                <div className="glassmorphism-light rounded-lg overflow-hidden relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-64 lg:h-96 object-cover"
                    data-testid="local-video"
                  />
                  <div className="absolute top-2 left-2 glassmorphism text-white text-sm px-2 py-1 rounded">
                    あなた
                  </div>
                </div>
                
                {/* Remote Video */}
                <div className="glassmorphism-light rounded-lg overflow-hidden relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 lg:h-96 object-cover"
                    data-testid="remote-video"
                  />
                  <div className="absolute top-2 left-2 glassmorphism text-white text-sm px-2 py-1 rounded">
                    相手
                  </div>
                </div>
              </div>
            )}

            {!showVideoCall && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="glassmorphism-light rounded-full w-32 h-32 flex items-center justify-center mb-4">
                    <Mic className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white text-xl font-medium">音声通話中</p>
                  <p className="text-white opacity-70">ルーム: {currentRoom}</p>
                  {roomCode && (
                    <div className="glassmorphism-light rounded-lg p-4 mt-4 max-w-xs mx-auto">
                      <p className="text-white text-sm mb-2">ルームコード</p>
                      <div className="flex items-center space-x-2">
                        <code className="text-white text-lg font-mono bg-black bg-opacity-30 px-3 py-1 rounded">
                          {roomCode}
                        </code>
                        <Button
                          onClick={copyRoomCode}
                          size="sm"
                          className="bg-mountain-gray hover:bg-mountain-light"
                          data-testid="copy-room-code"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Call Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={toggleAudio}
                variant={isAudioEnabled ? "default" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12"
                data-testid="toggle-audio"
              >
                {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              {showVideoCall && (
                <Button
                  onClick={toggleVideo}
                  variant={isVideoEnabled ? "default" : "destructive"}
                  size="lg"
                  className="rounded-full w-12 h-12"
                  data-testid="toggle-video"
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
              )}

              <Button
                onClick={handleEndCall}
                variant="destructive"
                size="lg"
                className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600"
                data-testid="end-call"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
