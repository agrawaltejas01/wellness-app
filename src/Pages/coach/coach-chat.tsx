import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai/react";
import { useMutation } from "@tanstack/react-query";
import { navigate, RouteComponentProps } from "@reach/router";
import { userDetailsAtom } from "../../atoms/atom";
import { queryCoach } from "../../apis/coach/coach";
import { ChatMessage } from "../../types/coach";
import { errorToast } from "../../components/Toast";
import { Mixpanel } from "../../mixpanel/init";

const CoachChat: React.FC<RouteComponentProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userDetails] = useAtom(userDetailsAtom);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = userDetails?.id ||
    JSON.parse(localStorage.getItem('zenfitx-user-details') || '{}').id;

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem('zenfitx-coach-chat-history');
    if (saved) {
      const { messages: savedMessages } = JSON.parse(saved);
      setMessages(savedMessages);
    } else {
      // Welcome message
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm your AI wellness coach. How can I help you today?",
        timestamp: new Date()
      }]);
    }
    Mixpanel.track('ai_coach_page_viewed', { user_id: userId });
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages
  const saveMessages = (msgs: ChatMessage[]) => {
    localStorage.setItem('zenfitx-coach-chat-history', JSON.stringify({
      messages: msgs,
      lastUpdated: new Date()
    }));
  };

  const { mutate: _queryCoach, isPending } = useMutation({
    mutationFn: queryCoach,
    onSuccess: (result) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: result.summary,
        timestamp: new Date()
      };
      setMessages(prev => {
        const updated = [...prev, assistantMessage];
        saveMessages(updated);
        return updated;
      });
      Mixpanel.track('ai_coach_response_received', { user_id: userId });
    },
    onError: () => {
      errorToast("Failed to get response from AI Coach");
      setMessages(prev => prev.filter(m => !m.isLoading));
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      saveMessages(updated);
      return updated;
    });

    Mixpanel.track('ai_coach_query_sent', {
      user_id: userId,
      query_length: inputValue.length
    });

    _queryCoach({
      user_query: inputValue,
      user_id: "pratik",
      n_results: 5
    });

    setInputValue('');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate('/')}>←</button>
          <h1 className="text-2xl font-bold"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            AI Coach
          </h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
              style={{ wordBreak: 'break-word' }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t p-4 pb-safe">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-green-500"
            placeholder="Ask your AI Coach..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isPending}
          />
          <button
            className="bg-green-500 text-white rounded-full px-6 py-2 disabled:opacity-50 min-w-[44px] min-h-[44px]"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isPending}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachChat;
