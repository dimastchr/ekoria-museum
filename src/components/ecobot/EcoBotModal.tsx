import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, RotateCcw } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';
import { findOfflineEcoBotAnswer } from '../../data/offlineEcoBotKnowledge';
import { SoundToggle } from '../common/SoundToggle';
import oziAvatar from '../../assets/images/avatar_ozi_robot_1794244205679.jpg';
import naraAvatar from '../../assets/images/avatar_nara_explorer_1794244206279.jpg';

interface Message {
  id: string;
  sender: 'ozi' | 'student';
  text: string;
  timestamp: string;
  /** Greeting / system lines are not sent to Gemini as conversation history. */
  isSystem?: boolean;
}

const OFFLINE_PREFIX = 'Maaf, Ozi sedang tidak tersambung ke internet, jadi Ozi belum bisa menjawab dengan lengkap.';

interface EcoBotModalProps {
  onClose: () => void;
  initialQuery?: string;
}

const PRESET_QUESTIONS = [
  'Mengapa elang tidak memakan padi?',
  'Apa akibatnya jika ular di sawah diburu habis?',
  'Kenapa terumbu karang di laut bisa memutih?',
  'Apa bedanya jamur pengurai dengan tumbuhan hijau?',
  'Mengapa padang rumput Baluran banyak dihuni banteng?',
  'Bagaimana cara kerja rantai makanan di hutan?'
];

export const EcoBotModal: React.FC<EcoBotModalProps> = ({ onClose, initialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ozi',
      text: 'Halo, penjelajah cilik! Aku Ozi, robot pemandu sains IPAS untukmu. Tanyakan apa saja tentang ekosistem, rantai makanan, atau makhluk hidup di alam, ya! 🌱 Apa yang ingin kamu ketahui hari ini?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    }
  ]);
  const [inputText, setInputText] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sentInitialRef = useRef(false);
  useEffect(() => {
    if (initialQuery && !sentInitialRef.current) {
      sentInitialRef.current = true;
      handleSendMessage(initialQuery);
    }
    // Stop Ozi's voice when the chat closes
    return () => audioManager.stopSpeaking();
  }, []);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    audioManager.playClick();
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Short conversation history (without greeting/system lines) so Ozi understands follow-ups
    const history = messages
      .filter((m) => !m.isSystem)
      .slice(-8)
      .map((m) => ({ role: m.sender === 'student' ? 'user' : 'model', text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    let botReply: string | null = null;
    let isOfflineReply = false;

    try {
      // Call Server-Side Express API (/api/ecobot/chat) — the Gemini key stays on the server
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 35000);
      try {
        const response = await fetch('/api/ecobot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend, history }),
          signal: controller.signal
        });
        const data = await response.json().catch(() => null);
        if (data && typeof data.reply === 'string' && data.reply.trim()) {
          // Gemini answer, or the server's own friendly message (e.g. "pelan-pelan" rate limit)
          botReply = data.reply.trim();
        } else if (data?.fallbackNeeded) {
          console.warn('Ozi server could not reach Gemini:', data.reason || data.error);
        }
      } catch (err) {
        console.warn('Ozi server unreachable:', err);
      } finally {
        window.clearTimeout(timer);
      }

      // Offline fallback only when the API truly failed — and say so honestly
      if (!botReply) {
        isOfflineReply = true;
        const match = findOfflineEcoBotAnswer(textToSend);
        botReply = match
          ? `${OFFLINE_PREFIX} Tapi Ozi punya catatan yang mirip dengan pertanyaanmu: ${match}`
          : `${OFFLINE_PREFIX} Coba tanyakan lagi sebentar lagi, atau tanyakan kepada gurumu, ya! 🌱`;
      }

      const botMsg: Message = {
        id: `ozi-${Date.now()}`,
        sender: 'ozi',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // Offline notices are not real conversation turns for Gemini
        isSystem: isOfflineReply
      };

      setMessages((prev) => [...prev, botMsg]);

      // Speak the answer with Ozi's voice (audioManager stays silent when sound is muted)
      if (!audioManager.getIsMuted()) {
        audioManager.speak(botReply);
      }
    } catch (err) {
      console.error('Error getting Ozi answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    audioManager.playClick();
    audioManager.stopSpeaking();
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'ozi',
        text: 'Percakapan dimulai lagi dari awal! Aku Ozi, siap menjawab pertanyaan tentang materi IPAS Bab 3: Ekosistem. Ayo, tanyakan apa saja!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* OZI DIALOG MODAL CARD WITH SPRING POP-UP */}
      <div className="bg-[#F6F1E3] text-[#0F3D2E] rounded-3xl w-full max-w-xl h-[90dvh] max-h-[680px] shadow-2xl border-2 border-[#3FA34D] flex flex-col overflow-hidden relative font-sans animate-pop-spring animate-glow-ring">
        
        {/* HEADER */}
        <div className="bg-[#0F3D2E] text-white p-4 flex items-center justify-between border-b border-[#1B5E3F]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={oziAvatar} 
                alt="Robot Ozi" 
                className="w-11 h-11 rounded-full border-2 border-[#F5C518] object-cover bg-white animate-ozi-bounce"
              />
              <span className="w-3.5 h-3.5 rounded-full bg-[#8BC34A] border-2 border-[#0F3D2E] absolute bottom-0 right-0 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-black text-base text-white">Ozi</h3>
                <span className="bg-[#F5C518] text-[#0F3D2E] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Pemandu Sains
                </span>
              </div>
              <p className="text-[11px] text-[#8BC34A]">
                Robot bulat putih • Mata biru menyala • Daun hijau di dada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <SoundToggle variant="dark" />

            <button
              onClick={handleResetChat}
              className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[#1B5E3F] text-emerald-200 transition"
              title="Mulai Ulang Percakapan"
              aria-label="Mulai ulang percakapan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                audioManager.stopSpeaking();
                onClose();
              }}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 hover:bg-rose-900/60 text-white transition ml-1"
              title="Tutup Obrolan"
              aria-label="Tutup obrolan Ozi"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* CHAT MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF7F0]">
          {messages.map((msg) => {
            const isOzi = msg.sender === 'ozi';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isOzi ? 'justify-start' : 'justify-end'}`}
              >
                {isOzi && (
                  <img
                    src={oziAvatar}
                    alt="Ozi"
                    className="w-8 h-8 rounded-full border border-[#F5C518] bg-white shrink-0 mt-1"
                  />
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs md:text-sm leading-relaxed shadow-sm ${
                    isOzi
                      ? 'bg-white text-[#0F3D2E] border border-[#E8DEC9] rounded-tl-sm'
                      : 'bg-[#1B5E3F] text-white rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className={`text-[9px] mt-1.5 text-right ${isOzi ? 'text-gray-400' : 'text-emerald-200'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {!isOzi && (
                  <img
                    src={naraAvatar}
                    alt="Nara"
                    className="w-8 h-8 rounded-full border border-[#3FA34D] object-cover shrink-0 mt-1"
                  />
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#52796F] p-2 bg-white/70 rounded-xl max-w-xs border border-[#E8DEC9]">
              <img src={oziAvatar} alt="Ozi" className="w-6 h-6 rounded-full animate-bounce" />
              <span>Ozi sedang berpikir...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* PRESET QUESTIONS CAROUSEL */}
        <div className="p-2.5 bg-[#F6F1E3] border-t border-[#E8DEC9] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-[#52796F] uppercase shrink-0 pl-1">
            Contoh:
          </span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bg-white hover:bg-emerald-50 text-[#0F3D2E] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#E8DEC9] whitespace-nowrap shrink-0 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* INPUT BOX */}
        <div className="p-3.5 bg-white border-t border-[#E8DEC9] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tulis pertanyaanmu tentang ekosistem..."
            className="flex-1 bg-[#F6F1E3] text-[#0F3D2E] placeholder:text-gray-400 text-xs md:text-sm px-4 py-2.5 rounded-2xl border border-[#E8DEC9] focus:outline-none focus:ring-2 focus:ring-[#3FA34D]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`p-2.5 rounded-2xl bg-[#F5C518] text-[#0F3D2E] font-bold shadow transition cursor-pointer ${
              inputText.trim() && !isLoading ? 'hover:bg-[#ffe066] active:scale-95' : 'opacity-50 cursor-not-allowed'
            }`}
            title="Kirim Pertanyaan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
