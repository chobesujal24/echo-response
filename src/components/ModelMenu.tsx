import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Sparkles, Brain, Code, Zap, Eye, Rocket } from "lucide-react";
import { puterService, ModelInfo } from "@/lib/puterService";

// Updated models from https://puter.com/puterai/chat/models
export const models = [
    // OpenAI Models
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", category: "Featured" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", category: "Fast" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", category: "Advanced" },
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI", category: "Advanced" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", category: "Fast" },
    { id: "o1", name: "o1", provider: "OpenAI", category: "Reasoning" },
    { id: "o1-mini", name: "o1 Mini", provider: "OpenAI", category: "Reasoning" },
    { id: "o1-pro", name: "o1 Pro", provider: "OpenAI", category: "Reasoning" },

    // Anthropic Models
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", category: "Featured" },
    { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", category: "Fast" },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", category: "Advanced" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic", category: "Advanced" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", category: "Fast" },

    // DeepSeek Models
    { id: "deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek", category: "Featured" },
    { id: "deepseek-reasoner", name: "DeepSeek R1", provider: "DeepSeek", category: "Reasoning" },

    // Google Models
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", category: "Featured" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", category: "Advanced" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google", category: "Fast" },

    // Meta Models
    { id: "llama-3.1-405b", name: "Llama 3.1 405B", provider: "Meta", category: "Advanced" },
    { id: "llama-3.1-70b", name: "Llama 3.1 70B", provider: "Meta", category: "Advanced" },
    { id: "llama-3.1-8b", name: "Llama 3.1 8B", provider: "Meta", category: "Fast" },
    { id: "llama-3-70b", name: "LLaMA 3 70B", provider: "Meta", category: "Advanced" },
    { id: "llama-3-8b", name: "LLaMA 3 8B", provider: "Meta", category: "Fast" },

    // Mistral Models
    { id: "mistral-large", name: "Mistral Large", provider: "Mistral", category: "Advanced" },
    { id: "mistral-7b", name: "Mistral 7B", provider: "Mistral", category: "Fast" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", provider: "Mistral", category: "Advanced" },
    { id: "mixtral-8x22b", name: "Mixtral 8x22B", provider: "Mistral", category: "Advanced" },
    { id: "codestral", name: "Codestral", provider: "Mistral", category: "Code" },

    // Other Models
    { id: "firellava-13b", name: "Firellava 13B", provider: "Community", category: "Vision" },
    { id: "phi-3-mini", name: "Phi-3 Mini", provider: "Microsoft", category: "Fast" },
];

interface ModelMenuProps {
    selectedModel: string;
    onSelectModel: (modelId: string) => void;
}

export const ModelMenu = ({ selectedModel, onSelectModel }: ModelMenuProps) => {
    const selectedModelData = models.find((m) => m.id === selectedModel);
    const selectedModelName = selectedModelData?.name || "Select Model";
    
    // Group models by category
    const modelsByCategory = models.reduce((acc, model) => {
        if (!acc[model.category]) {
            acc[model.category] = [];
        }
        acc[model.category].push(model);
        return acc;
    }, {} as Record<string, typeof models>);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Featured': return <Sparkles className="w-4 h-4 text-blue-400" />;
            case 'Reasoning': return <Brain className="w-4 h-4 text-purple-400" />;
            case 'Advanced': return <Rocket className="w-4 h-4 text-orange-400" />;
            case 'Code': return <Code className="w-4 h-4 text-green-400" />;
            case 'Vision': return <Eye className="w-4 h-4 text-pink-400" />;
            case 'Fast': return <Zap className="w-4 h-4 text-yellow-400" />;
            default: return <Sparkles className="w-4 h-4 text-gray-400" />;
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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="outline" 
                    className="flex items-center gap-3 min-w-[200px] justify-between bg-[#020105]/90 backdrop-blur-md border-[#FFFAFA]/30 hover:bg-[#FFFAFA]/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                    <div className="flex items-center gap-2">
                        {selectedModelData && getCategoryIcon(selectedModelData.category)}
                        <span className="text-[#FFFAFA] font-medium">{selectedModelName}</span>
                        {selectedModelData && (
                            <Badge variant="secondary" className={`text-xs ${getProviderColor(selectedModelData.provider)} bg-transparent border-current/30`}>
                                {selectedModelData.provider}
                            </Badge>
                        )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#FFFAFA]/60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-80 max-h-96 overflow-y-auto bg-[#020105]/95 backdrop-blur-md border-[#FFFAFA]/30 animate-in slide-in-from-top-2 duration-200"
                align="start"
            >
                {Object.entries(modelsByCategory).map(([category, categoryModels]) => (
                    <div key={category}>
                        <DropdownMenuLabel className="flex items-center gap-2 text-[#FFFAFA]/80 font-semibold">
                            {getCategoryIcon(category)}
                            {category}
                        </DropdownMenuLabel>
                        {categoryModels.map((model) => {
                            const modelInfo = puterService.getModelInfo(model.id);
                            const performance = puterService.getModelPerformance(model.id);
                            
                            return (
                                <DropdownMenuItem 
                                    key={model.id} 
                                    onSelect={() => onSelectModel(model.id)}
                                    className="flex items-center justify-between p-3 hover:bg-[#FFFAFA]/10 transition-all duration-200 cursor-pointer group"
                                >
                                    <div className="flex flex-col gap-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#FFFAFA] font-medium group-hover:text-blue-400 transition-colors">
                                                {model.name}
                                            </span>
                                            <Badge 
                                                variant="secondary" 
                                                className={`text-xs ${getProviderColor(model.provider)} bg-transparent border-current/30`}
                                            >
                                                {model.provider}
                                            </Badge>
                                        </div>
                                        {performance.responseTime && (
                                            <div className="flex items-center gap-2 text-xs text-[#FFFAFA]/60">
                                                <span>~{performance.responseTime}ms</span>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    performance.working ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                                                }`} />
                                            </div>
                                        )}
                                    </div>
                                    {selectedModel === model.id && (
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                        <DropdownMenuSeparator className="bg-[#FFFAFA]/20" />
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};