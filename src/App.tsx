/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Palette, Type, MessageSquare, Layout, Loader2, Send, Download, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ColorItem {
  name: string;
  hex: string;
  explanation: string;
}

interface StyleGuide {
  voice: string;
  colors: ColorItem[];
  typography: string;
  layout: string;
}

export default function App() {
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<StyleGuide | null>(null);
  
  const voiceRef = useRef<HTMLDivElement>(null);
  const colorsRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const generateGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessType.trim()) return;

    setLoading(true);
    try {
      const prompt = `Você é um especialista em design e comunicação digital.
O usuário informou o seguinte tipo de negócio ou projeto web: "${businessType}".

Gere um Guia de Estilo completo. RESPONDA APENAS COM UM OBJETO JSON no seguinte formato:
{
  "voice": "Texto descrevendo o tom de voz e 2 exemplos de frases",
  "colors": [
    { "name": "Nome da Cor", "hex": "#HEX", "explanation": "Explicação do porquê desta cor" },
    ... (total de 4 cores)
  ],
  "typography": "Sugestão de uma fonte para títulos e uma para o corpo (Google Fonts) e explicação",
  "layout": "Descrição do estilo dos botões, cabeçalho e se o layout é minimalista ou visual"
}

Responda em português. Não inclua blocos de código markdown (\`\`\`json), apenas o JSON puro.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (response.text) {
        const cleanedText = response.text.replace(/```json|```/g, "").trim();
        const parsedGuide = JSON.parse(cleanedText) as StyleGuide;
        setGuide(parsedGuide);
      }
    } catch (error) {
      console.error("Error generating guide:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-[#1a1a1a] font-sans selection:bg-indigo-500 selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-indigo-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Sparkles size={22} /> 
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-600">Mestre dos Layouts</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">
              AI Design Engine v2.0
            </div>
            {guide && (
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 active:scale-95"
              >
                <Download size={16} />
                Exportar PDF
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6"
          >
            Inteligência Artificial Criativa
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
          >
            Design que <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500">conecta</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Transforme sua ideia em uma marca memorável com guias de estilo gerados instantaneamente.
          </motion.p>
        </section>

        {/* Input Form */}
        <section className="max-w-3xl mx-auto mb-24">
          <form onSubmit={generateGuide} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white border border-indigo-100 rounded-[2rem] p-2 shadow-2xl shadow-indigo-100">
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="Qual o seu projeto? (Ex: Estúdio de Yoga)"
                className="flex-1 bg-transparent px-8 py-5 text-xl font-medium focus:outline-none placeholder:text-slate-300"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !businessType.trim()}
                className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-xl shadow-indigo-100 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={24} /> Criar Guia</>}
              </button>
            </div>
          </form>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {["Agência de Viagens", "App de Receitas", "Marca de Skates"].map((tag) => (
              <button
                key={tag}
                onClick={() => setBusinessType(tag)}
                className="text-sm font-bold px-5 py-2.5 rounded-2xl bg-white border border-indigo-50 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-slate-500 hover:text-indigo-600 shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {guide && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              {/* Sidebar Navigation */}
              <div className="lg:col-span-3 sticky top-32 hidden lg:block print:hidden">
                <div className="bg-white/50 backdrop-blur-md border border-white rounded-3xl p-6 shadow-xl shadow-indigo-50">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 px-2">Navegação</h3>
                  <nav className="space-y-2">
                    {[
                      { id: 'voz', label: 'Tom de Voz', icon: MessageSquare, ref: voiceRef },
                      { id: 'cores', label: 'Paleta de Cores', icon: Palette, ref: colorsRef },
                      { id: 'tipo', label: 'Tipografia', icon: Type, ref: typeRef },
                      { id: 'layout', label: 'Componentes', icon: Layout, ref: layoutRef },
                    ].map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => scrollToSection(item.ref)}
                        className="w-full flex items-center justify-between group px-4 py-4 rounded-2xl bg-white border border-transparent hover:border-indigo-100 hover:bg-indigo-50/50 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <item.icon size={18} />
                          </div>
                          <span className="font-bold text-slate-600 group-hover:text-indigo-600">{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9 space-y-12 print:col-span-12">
                {/* Tom de Voz */}
                <div ref={voiceRef} className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-indigo-100 border border-white scroll-mt-32 group/section relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <MessageSquare size={28} />
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter">Tom de Voz</h2>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="opacity-0 group-hover/section:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 print:hidden"
                    >
                      <Download size={14} /> Exportar
                    </button>
                  </div>
                  <div className="prose prose-indigo max-w-none text-lg text-slate-600 leading-relaxed">
                    <ReactMarkdown>{guide.voice}</ReactMarkdown>
                  </div>
                </div>

                {/* Paleta de Cores */}
                <div ref={colorsRef} className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-indigo-100 border border-white scroll-mt-32 group/section relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                        <Palette size={28} />
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter">Paleta de Cores</h2>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="opacity-0 group-hover/section:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-rose-50 hover:text-rose-600 print:hidden"
                    >
                      <Download size={14} /> Exportar
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {guide.colors.map((color, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group/color"
                      >
                        <div 
                          className="w-full aspect-video rounded-3xl shadow-inner mb-6 transition-transform group-hover/color:scale-[1.02] duration-500 border border-black/5 relative overflow-hidden"
                          style={{ backgroundColor: color.hex }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/color:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="px-2">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-black tracking-tight">{color.name}</h3>
                            <code className="px-3 py-1 bg-slate-100 rounded-lg font-mono text-sm font-bold text-slate-500 uppercase">{color.hex}</code>
                          </div>
                          <p className="text-slate-500 leading-relaxed font-medium">{color.explanation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tipografia */}
                <div ref={typeRef} className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-indigo-100 border border-white scroll-mt-32 group/section relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                        <Type size={28} />
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter">Tipografia</h2>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="opacity-0 group-hover/section:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-amber-50 hover:text-amber-600 print:hidden"
                    >
                      <Download size={14} /> Exportar
                    </button>
                  </div>
                  <div className="prose prose-indigo max-w-none text-lg text-slate-600 leading-relaxed">
                    <ReactMarkdown>{guide.typography}</ReactMarkdown>
                  </div>
                </div>

                {/* Componentes */}
                <div ref={layoutRef} className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-indigo-100 border border-white scroll-mt-32 group/section relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <Layout size={28} />
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter">Componentes e Layout</h2>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="opacity-0 group-hover/section:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs hover:bg-emerald-50 hover:text-emerald-600 print:hidden"
                    >
                      <Download size={14} /> Exportar
                    </button>
                  </div>
                  <div className="prose prose-indigo max-w-none text-lg text-slate-600 leading-relaxed">
                    <ReactMarkdown>{guide.layout}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!guide && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-slate-300"
          >
            <div className="w-24 h-24 border-4 border-dashed border-indigo-100 rounded-[2rem] flex items-center justify-center mb-8">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <p className="text-xl font-bold tracking-tight">Pronto para começar sua jornada criativa?</p>
            <p className="text-sm font-medium mt-2">Digite seu projeto acima para gerar o guia.</p>
          </motion.div>
        )}
      </main>

      <footer className="border-t border-indigo-50 py-16 mt-32 bg-white/50 print:hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 font-bold text-xl opacity-40">
            <div className="w-8 h-8 bg-slate-400 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <span>Mestre dos Layouts</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-8 text-sm font-bold text-slate-400 mb-2">
              <a href="#" className="hover:text-indigo-600 transition-colors">Termos</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Suporte</a>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center md:text-right">
              Criado por Raul Sampaio, Pedro Sampaio e Luan Carneiro
            </div>
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              © 2026 Mestre dos Layouts. Powered by Gemini 3.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
