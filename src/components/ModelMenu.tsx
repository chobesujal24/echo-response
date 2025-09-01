import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// The models are from https://puter.com/puterai/chat/models
export const models = [
    { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    { id: "claude-3-opus", name: "Claude 3 Opus" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
    { id: "firellava-13b", name: "Firellava 13B" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "llama-3-70b", name: "LLaMA 3 70B" },
    { id: "llama-3-8b", name: "LLaMA 3 8B" },
    { id: "mistral-7b", name: "Mistral 7B" },
    { id: "mistral-large", name: "Mistral Large" },
    { id: "mixtral-8x22b", name: "Mixtral 8x22B" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B" },
    { id: "phi-3-mini", name: "Phi-3 Mini" },
];

interface ModelMenuProps {
    selectedModel: string;
    onSelectModel: (modelId: string) => void;
}

export const ModelMenu = ({ selectedModel, onSelectModel }: ModelMenuProps) => {
    const selectedModelName = models.find((m) => m.id === selectedModel)?.name || "Select Model";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    {selectedModelName}
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {models.map((model) => (
                    <DropdownMenuItem key={model.id} onSelect={() => onSelectModel(model.id)}>
                        {model.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

