import { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, PhoneOff, Mic, Volume2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VAPI_PUBLIC_KEY = '602440a9-daf6-4dac-9501-f7e7311de665';
const ASSISTANT_ID = '2c1ebf69-cd16-4719-a7e1-d2e52de66f9b';

interface VoiceDemoProps {
  compact?: boolean;
}

export default function VoiceDemo({ compact = false }: VoiceDemoProps) {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    // Initialize Vapi
    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
    setVapi(vapiInstance);

    // Listen for call events
    vapiInstance.on('call-start', () => {
      setIsCallActive(true);
      setIsConnecting(false);
      setTranscript(['AI: Thanks for calling! How can I help you today?']);
    });

    vapiInstance.on('call-end', () => {
      setIsCallActive(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message: any) => {
      if (message.type === 'transcript' && message.transcript) {
        const speaker = message.role === 'assistant' ? 'AI' : 'You';
        setTranscript(prev => [...prev, `${speaker}: ${message.transcript}`]);
      }
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startCall = async () => {
    if (!vapi) return;

    try {
      setIsConnecting(true);
      setTranscript([]);
      await vapi.start(ASSISTANT_ID);
    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  // Compact version for hero section
  if (compact) {
    return (
      <div className="space-y-3">
        {/* Call Button */}
        <AnimatePresence mode="wait">
          {!isCallActive && !isConnecting ? (
            <Button
              onClick={startCall}
              size="lg"
              className="w-full group shadow-lg"
              variant="default"
            >
              <Phone className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              Start Demo Call
            </Button>
          ) : isConnecting ? (
            <Button size="lg" disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/50">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  Call Active
                </span>
                {isSpeaking && <Volume2 className="w-4 h-4 text-green-600 animate-pulse ml-2" />}
              </div>
              <Button
                onClick={endCall}
                size="lg"
                variant="destructive"
                className="w-full"
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </Button>
            </div>
          )}
        </AnimatePresence>

        {/* Compact Transcript */}
        {transcript.length > 0 && (
          <div className="p-3 rounded-lg bg-secondary/30 border border-border max-h-32 overflow-y-auto text-xs space-y-1">
            {transcript.slice(-3).map((line, idx) => (
              <p
                key={idx}
                className={line.startsWith('AI:') ? 'text-primary font-medium' : 'text-foreground'}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {!isCallActive && !isConnecting && (
          <p className="text-xs text-center text-muted-foreground">
            ✨ Try asking about pricing or availability
          </p>
        )}
      </div>
    );
  }

  // Full version for dedicated section
  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 md:p-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            🎙️ Talk to Our AI Receptionist
          </h3>
          <p className="text-muted-foreground">
            Experience our AI in action - no signup required!
          </p>
        </div>

        {/* Call Button */}
        <div className="flex justify-center mb-6">
          <AnimatePresence mode="wait">
            {!isCallActive && !isConnecting ? (
              <motion.div
                key="start"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Button
                  onClick={startCall}
                  size="lg"
                  className="relative group px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Phone className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Start Demo Call
                </Button>
              </motion.div>
            ) : isConnecting ? (
              <motion.div
                key="connecting"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Button
                  size="lg"
                  disabled
                  className="px-8 py-6 text-lg font-semibold"
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      Call Active
                    </span>
                  </div>
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/50"
                    >
                      <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-sm font-medium">Speaking...</span>
                    </motion.div>
                  )}
                </div>
                <Button
                  onClick={endCall}
                  size="lg"
                  variant="destructive"
                  className="px-8 py-6 text-lg font-semibold"
                >
                  <PhoneOff className="mr-2 h-5 w-5" />
                  End Call
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions */}
        {!isCallActive && !isConnecting && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-muted-foreground">
              Try asking:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                'How much for a full detail?',
                'What is your availability?',
                'Do you do ceramic coating?',
              ].map((question, idx) => (
                <div
                  key={idx}
                  className="text-xs text-center px-3 py-2 rounded-lg bg-secondary/50 text-muted-foreground border border-border"
                >
                  "{question}"
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border max-h-48 overflow-y-auto"
          >
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Live Transcript:
            </p>
            <div className="space-y-2">
              {transcript.map((line, idx) => (
                <p
                  key={idx}
                  className={`text-sm ${
                    line.startsWith('AI:')
                      ? 'text-primary font-medium'
                      : 'text-foreground'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>✨ Powered by Vapi AI • Works in your browser</p>
          <p className="mt-1">No phone number or signup required</p>
        </div>
      </div>
    </Card>
  );
}
