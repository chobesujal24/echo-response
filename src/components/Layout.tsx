import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { EnhancedChatContainer } from "./EnhancedChatContainer";
import { SettingsDialog } from "./SettingsDialog";
import { Button } from "@/components/ui/button";
import { Settings, Sparkles, Zap, Brain, Code, Rocket, Eye, Globe, Cpu, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { puterService, ModelInfo } from "../lib/puterService";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Layout() {
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [selectedModel, setSelectedModel] = useState('deepseek-chat');
  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modelCategories, setModelCategories] = useState<Record<string, ModelInfo[]>>({});
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  useEffect(() => {
    // Initialize Puter service and load models
    const initializeModels = async () => {
      setIsLoadingModels(true);
      try {
        console.log('🔄 Initializing AI models...');
        await puterService.initialize();
        
        // Get models by category
        const categories = puterService.getModelsByCategory();
        setModelCategories(categories);
        
        // Set default model to fastest working model
        const fastestModel = puterService.getFastestModel();
        setSelectedModel(fastestModel);
        
        console.log('✅ Models loaded successfully');
        toast({
          title: "AI Models Ready",
          description: `${Object.keys(categories).length} model categories loaded`,
        });
      } catch (error) {
        console.error('❌ Failed to initialize models:', error);
        toast({
          title: "Model Loading Error",
          description: "Some AI models may not be available. Using fallback mode.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingModels(false);
      }
    };

    initializeModels();
  }, [toast]);
  // FIXED: New Chat Handler - Creates proper unique ID and triggers chat container update
  const handleNewChat = () => {
    const newChatId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Layout: Creating new chat with ID:', newChatId);
    setCurrentChatId(newChatId);
    
    // Clear any existing chat state
    localStorage.removeItem(`chat-messages-${currentChatId}`);
    
    // Trigger a page refresh for the chat container to reset
    window.dispatchEvent(new CustomEvent('newChatCreated', { detail: { chatId: newChatId } }));
  };

  const handleLoadChat = (chatId: string) => {
    console.log('Layout: Loading chat with ID:', chatId);
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    try {
      // Remove from chat sessions
      const savedChats = localStorage.getItem('chat-sessions');
      if (savedChats) {
        const sessions = JSON.parse(savedChats);
        const filteredSessions = sessions.filter((s: any) => s.id !== chatId);
        localStorage.setItem('chat-sessions', JSON.stringify(filteredSessions));
      }

      // Remove from chat history
      const savedHistory = localStorage.getItem('chat-history');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        const filteredHistory = history.filter((h: any) => h.id !== chatId);
        localStorage.setItem('chat-history', JSON.stringify(filteredHistory));
      }

      // Remove chat messages
      localStorage.removeItem(`chat-messages-${chatId}`);

      // If current chat is being deleted, start a new chat
      if (currentChatId === chatId) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleChatUpdate = (chatId: string, title: string, messageCount: number) => {
    console.log('Chat updated:', { chatId, title, messageCount });
  };

  const getModelBadgeColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'beta': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'testing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Featured': return <Sparkles className="w-4 h-4 text-blue-400" />;
      case 'Reasoning': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'Advanced': return <Rocket className="w-4 h-4 text-orange-400" />;
      case 'Code': return <Code className="w-4 h-4 text-green-400" />;
      case 'Fast': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Vision': return <Eye className="w-4 h-4 text-pink-400" />;
      case 'Next-Gen': return <Cpu className="w-4 h-4 text-cyan-400" />;
      default: return <Globe className="w-4 h-4 text-gray-400" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'OpenAI': return 'text-green-400';
      case 'Anthropic': return 'text-orange-400';
      case 'DeepSeek': return 'text-blue-400';
      case 'Google': return 'text-red-400';
      case 'Meta': return 'text-purple-400';
      case 'Mistral': return 'text-yellow-400';
      case 'Microsoft': return 'text-cyan-400';
      case 'Community': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'beta': return <Clock className="w-3 h-3 text-yellow-400" />;
      case 'testing': return <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />;
      case 'error': return <AlertCircle className="w-3 h-3 text-red-400" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const formatResponseTime = (time?: number) => {
    if (!time) return '';
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  // Enhanced Models Menu Component
  const ModelsMenu = ({ selectedModel, onModelChange }: { selectedModel: string; onModelChange: (model: string) => void }) => {
    const selectedModelInfo = puterService.getModelInfo(selectedModel);
    const performance = selectedModelInfo ? puterService.getModelPerformance(selectedModel) : null;
    return (
      <Select value={selectedModel} onValueChange={onModelChange} open={modelMenuOpen} onOpenChange={setModelMenuOpen}>
        <SelectTrigger className="w-full bg-[#020105]/90 border-[#FFFAFA]/30 text-[#FFFAFA] hover:bg-[#FFFAFA]/10 focus:ring-2 focus:ring-[#FFFAFA]/30 transition-all duration-300 hover:border-[#FFFAFA]/50 backdrop-blur-md">
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center gap-2">
              {selectedModelInfo && getStatusIcon(selectedModelInfo.status)}
              <SelectValue placeholder={isLoadingModels ? "Loading models..." : "Select AI Model"} />
            </div>
            {performance?.responseTime && (
              <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                {formatResponseTime(performance.responseTime)}
              </Badge>
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#020105]/98 border-[#FFFAFA]/30 backdrop-blur-xl max-h-96 w-[400px] shadow-2xl animate-in slide-in-from-top-2 duration-300">
          {isLoadingModels ? (
            <div className="p-4 text-center">
              <RefreshCw className="w-6 h-6 text-[#FFFAFA]/60 animate-spin mx-auto mb-2" />
              <p className="text-[#FFFAFA]/60 text-sm">Loading AI models...</p>
            </div>
          ) : Object.entries(modelCategories).map(([category, models]) => (
            <div key={category}>
              <div className="px-3 py-3 text-xs font-semibold text-[#FFFAFA]/70 uppercase tracking-wider border-b border-[#FFFAFA]/10 bg-[#FFFAFA]/5 flex items-center gap-2 sticky top-0 backdrop-blur-sm">
                {getCategoryIcon(category)}
                <span>{category}</span>
                <Badge className="ml-auto bg-[#FFFAFA]/10 text-[#FFFAFA]/60 border-[#FFFAFA]/20 text-xs">
                  {models.length}
                </Badge>
              </div>
              {models.map((model) => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="text-[#FFFAFA] hover:bg-[#FFFAFA]/10 focus:bg-[#FFFAFA]/10 cursor-pointer py-4 px-3 transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{model.name}</span>
                        {getStatusIcon(model.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${getProviderColor(model.provider)}`}>
                          {model.provider}
                        </span>
                        {model.responseTime && (
                          <span className="text-xs text-[#FFFAFA]/50">
                            • {formatResponseTime(model.responseTime)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#FFFAFA]/50 mt-1 line-clamp-1">{model.description}</p>
                      <div className="flex gap-1 mt-2">
                        {model.capabilities.slice(0, 3).map((cap) => (
                          <Badge key={cap} className="text-xs px-1.5 py-0.5 bg-[#FFFAFA]/10 text-[#FFFAFA]/60 border-[#FFFAFA]/20">
                            {cap}
                          </Badge>
                        ))}
                        {model.capabilities.length > 3 && (
                          <Badge className="text-xs px-1.5 py-0.5 bg-[#FFFAFA]/10 text-[#FFFAFA]/60 border-[#FFFAFA]/20">
                            +{model.capabilities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={`text-xs ${getModelBadgeColor(model.status)} px-2 py-1 shrink-0`}>
                      {model.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        {/* UPDATED: Sidebar with New Conversation button moved inside */}
        <div className="hidden lg:block">
          <AppSidebar 
            onNewChat={handleNewChat} 
            onLoadChat={handleLoadChat} 
            onDeleteChat={handleDeleteChat} 
            currentChatId={currentChatId} 
            darkMode={darkMode} 
            onToggleDarkMode={handleToggleDarkMode} 
          />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <AppSidebar 
            onNewChat={handleNewChat} 
            onLoadChat={handleLoadChat} 
            onDeleteChat={handleDeleteChat} 
            currentChatId={currentChatId} 
            darkMode={darkMode} 
            onToggleDarkMode={handleToggleDarkMode} 
          />
        </div>
        
        {/* UPDATED: Full-width chat container with models menu positioned beside sidebar */}
        <div className="flex-1 flex flex-col h-screen relative">
          {/* Enhanced Models Menu positioned beside sidebar */}
          <div className="absolute top-4 left-4 lg:left-6 z-30 flex items-center gap-3 animate-fade-in">
            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden">
              <SidebarTrigger className="h-10 w-10 rounded-xl bg-[#020105]/90 backdrop-blur-md border border-[#FFFAFA]/30 hover:bg-[#FFFAFA]/10 transition-all duration-300 hover:scale-105" />
            </div>
            
            {/* Enhanced Models Menu Container */}
            <div className="flex items-center gap-4 bg-[#020105]/95 backdrop-blur-md border border-[#FFFAFA]/30 rounded-xl px-4 py-3 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-[#020105]/98 hover:scale-[1.02]">
              {/* Model Icon with Status */}
              <div className="relative">
                <div className="w-8 h-8 rounded-lg border border-[#FFFAFA]/30 bg-gradient-to-br from-[#FFFAFA]/20 to-[#FFFAFA]/5 flex items-center justify-center backdrop-blur-sm transition-all duration-300">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-sm"></div>
                </div>
                {!isLoadingModels && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#020105] animate-pulse"></div>
                )}
              </div>
              
              {/* Model Info */}
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-sm font-medium text-[#FFFAFA]">AI Model</span>
                <span className="text-xs text-[#FFFAFA]/60 truncate">
                  {isLoadingModels ? 'Loading...' : `${Object.keys(modelCategories).length} categories available`}
                </span>
              </div>
              
              {/* Model Selector */}
              <div className="w-64 relative">
                <ModelsMenu selectedModel={selectedModel} onModelChange={setSelectedModel} />
              </div>
              
              {/* Performance Indicator */}
              {!isLoadingModels && selectedModel && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[#FFFAFA]/10 rounded-lg border border-[#FFFAFA]/20">
                      {(() => {
                        const performance = puterService.getModelPerformance(selectedModel);
                        const isWorking = puterService.isModelWorking(selectedModel);
                        return (
                          <>
                            <div className={`w-2 h-2 rounded-full ${isWorking ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                            <span className="text-xs text-[#FFFAFA]/70 font-medium">
                              {performance.responseTime ? formatResponseTime(performance.responseTime) : 'Testing...'}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#020105]/95 border-[#FFFAFA]/30 text-[#FFFAFA]">
                    <p>Model response time</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* UPDATED: Main Content - Full Screen Chat (no header constraints) */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full">
              <EnhancedChatContainer 
                currentChatId={currentChatId} 
                selectedModel={selectedModel}
                onChatUpdate={handleChatUpdate} 
              />
            </div>
          </main>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </SidebarProvider>
  );
}