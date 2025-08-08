import { useState } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebRTC } from '@/hooks/use-webrtc';

export function VoiceChat() {
  const [showVideoCall, setShowVideoCall] = useState(false);
  
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

  const handleStartVoiceCall = () => {
    startCall(false);
  };

  const handleStartVideoCall = () => {
    setShowVideoCall(true);
    startCall(true);
  };

  const handleEndCall = () => {
    endCall();
    setShowVideoCall(false);
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
          // Call Start Interface
          <div className="text-center space-y-6">
            <div className="glassmorphism-light rounded-full w-32 h-32 flex items-center justify-center mb-8">
              <Mic className="w-16 h-16 text-white opacity-70" />
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleStartVoiceCall}
                className="bg-river-blue hover:bg-river-light text-white px-8 py-3 text-lg"
                data-testid="start-voice-call"
              >
                <Phone className="w-5 h-5 mr-2" />
                音声通話を開始
              </Button>
              
              <Button
                onClick={handleStartVideoCall}
                className="bg-mountain-gray hover:bg-mountain-light text-white px-8 py-3 text-lg"
                data-testid="start-video-call"
              >
                <Video className="w-5 h-5 mr-2" />
                ビデオ通話を開始
              </Button>
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
                  <p className="text-white opacity-70">通話時間: 00:00</p>
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
