
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { getAgriculturalAdvice, getInventoryAnalysis } from '../services/geminiService';

interface ZaraiExpertProps {
  products: Product[];
}

const ZaraiExpert: React.FC<ZaraiExpertProps> = ({ products }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Salam! Main aapka Zarai Expert hoon. Aap kis fasal ya product ke baray me poochna chahte hain? (I am your Agri Expert. What crop or product do you want to ask about?)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchInsights = async () => {
      const data = await getInventoryAnalysis(products);
      setInsights(data.insights);
    };
    fetchInsights();
  }, [products]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const botResponse = await getAgriculturalAdvice(userMsg, products);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full max-h-[80vh]">
      {/* AI Insights Sidebar */}
      <div className="lg:col-span-1 flex flex-col space-y-4">
        <div className="bg-gradient-to-br from-green-700 to-green-900 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <i className="fas fa-lightbulb mr-2 text-yellow-300"></i>
            Business Insights
          </h3>
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm bg-white/10 p-3 rounded-lg border border-white/20 italic">
                "{insight}"
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
           <img src="https://picsum.photos/seed/farmer/200/200" alt="Agri" className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-green-100" />
           <p className="text-xs text-gray-500">Helping Ishrat Ullah Khan grow since 2024</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Zarai Assistant</h4>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Online Analysis</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-green-700 text-white rounded-tr-none shadow-md' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none animate-pulse flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Sawal poochain... (Ask a question about pests or crops)"
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-green-700 hover:bg-green-800 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-md"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZaraiExpert;
