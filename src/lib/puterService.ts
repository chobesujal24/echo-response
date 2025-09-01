// Enhanced Puter AI service with optimized performance and better error handling
export interface PuterAIOptions {
  model?: string;
  context?: Array<{ role: string; content: string }>;
  max_tokens?: number;
  temperature?: number;
  memory?: boolean;
  stream?: boolean;
}

export interface ChatMemory {
  messages: Array<{ role: string; content: string; timestamp: Date }>;
  model: string;
  sessionId: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  category: string;
  status: 'live' | 'beta' | 'error';
  description: string;
  maxTokens: number;
  costTier: 'free' | 'low' | 'medium' | 'high';
}

export class PuterService {
  private static instance: PuterService;
  private chatMemory: Map<string, ChatMemory> = new Map();
  private isInitialized = false;
  private availableModels: Map<string, ModelInfo> = new Map();
  private modelTestResults: Map<string, boolean> = new Map();
  private initializationPromise: Promise<boolean> | null = null;
  
  // Optimized model definitions with correct Puter API model IDs
  private readonly MODEL_DEFINITIONS: ModelInfo[] = [
    // Featured Models - Fast and Reliable
    { 
      id: 'deepseek-chat', 
      name: 'DeepSeek Chat', 
      provider: 'DeepSeek', 
      category: 'Featured',
      status: 'live', 
      description: 'Fast conversational AI with excellent reasoning',
      maxTokens: 4000,
      costTier: 'low'
    },
    { 
      id: 'gpt-4o', 
      name: 'GPT-4o', 
      provider: 'OpenAI', 
      category: 'Featured',
      status: 'live', 
      description: 'Advanced multimodal AI with vision capabilities',
      maxTokens: 4000,
      costTier: 'medium'
    },
    { 
      id: 'claude-3-5-sonnet', 
      name: 'Claude 3.5 Sonnet', 
      provider: 'Anthropic', 
      category: 'Featured',
      status: 'live', 
      description: 'Excellent for analysis and creative writing',
      maxTokens: 4000,
      costTier: 'medium'
    },
    { 
      id: 'gemini-2.0-flash', 
      name: 'Gemini 2.0 Flash', 
      provider: 'Google', 
      category: 'Featured',
      status: 'live', 
      description: 'Google\'s latest fast multimodal model',
      maxTokens: 4000,
      costTier: 'low'
    },

    // Reasoning Models - For Complex Tasks
    { 
      id: 'deepseek-reasoner', 
      name: 'DeepSeek R1', 
      provider: 'DeepSeek', 
      category: 'Reasoning',
      status: 'live', 
      description: 'Advanced reasoning and problem-solving',
      maxTokens: 8000,
      costTier: 'medium'
    },
    { 
      id: 'o1', 
      name: 'o1', 
      provider: 'OpenAI', 
      category: 'Reasoning',
      status: 'live', 
      description: 'OpenAI\'s reasoning model for complex problems',
      maxTokens: 8000,
      costTier: 'high'
    },
    { 
      id: 'o1-pro', 
      name: 'o1 Pro', 
      provider: 'OpenAI', 
      category: 'Reasoning',
      status: 'live', 
      description: 'Professional reasoning model with enhanced capabilities',
      maxTokens: 8000,
      costTier: 'high'
    },

    // Advanced Models - Latest Technology
    { 
      id: 'gpt-5-chat-latest', 
      name: 'GPT-5 Chat', 
      provider: 'OpenAI', 
      category: 'Advanced',
      status: 'beta', 
      description: 'Next-generation conversational AI',
      maxTokens: 8000,
      costTier: 'high'
    },
    { 
      id: 'claude-opus-4', 
      name: 'Claude Opus 4', 
      provider: 'Anthropic', 
      category: 'Advanced',
      status: 'beta', 
      description: 'Most capable Claude model for complex tasks',
      maxTokens: 8000,
      costTier: 'high'
    },
    { 
      id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', 
      name: 'Llama 3.1 405B', 
      provider: 'Meta', 
      category: 'Advanced',
      status: 'live', 
      description: 'Largest open-source model with exceptional capabilities',
      maxTokens: 4000,
      costTier: 'medium'
    },

    // Code Generation
    { 
      id: 'codestral-latest', 
      name: 'Codestral', 
      provider: 'Mistral', 
      category: 'Code',
      status: 'live', 
      description: 'Specialized for code generation and programming',
      maxTokens: 4000,
      costTier: 'low'
    },

    // Fast Models - Quick Responses
    { 
      id: 'gpt-4o-mini', 
      name: 'GPT-4o Mini', 
      provider: 'OpenAI', 
      category: 'Fast',
      status: 'live', 
      description: 'Lightweight version of GPT-4o for quick responses',
      maxTokens: 2000,
      costTier: 'free'
    },
    { 
      id: 'gemini-1.5-flash', 
      name: 'Gemini 1.5 Flash', 
      provider: 'Google', 
      category: 'Fast',
      status: 'live', 
      description: 'Fast and efficient for everyday tasks',
      maxTokens: 2000,
      costTier: 'free'
    }
  ];
  
  static getInstance(): PuterService {
    if (!PuterService.instance) {
      PuterService.instance = new PuterService();
    }
    return PuterService.instance;
  }
  
  async initialize(): Promise<boolean> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<boolean> {
    try {
      console.log('Initializing Puter SDK...');
      
      // Wait for Puter SDK with timeout
      let attempts = 0;
      const maxAttempts = 25; // Reduced from 50 for faster initialization
      
      while (attempts < maxAttempts) {
        if (typeof (window as any).puter !== 'undefined' && 
            typeof (window as any).puter.ai !== 'undefined') {
          this.isInitialized = true;
          console.log('✓ Puter SDK initialized successfully');
          
          // Initialize model definitions
          this.initializeModelDefinitions();
          
          // Quick test of primary models only
          await this.quickModelTest();
          
          return true;
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Reduced delay
        attempts++;
      }
      
      console.warn('⚠ Puter SDK not available after timeout, using fallback mode');
      this.initializeModelDefinitions(); // Still initialize model definitions
      return false;
    } catch (error) {
      console.error('❌ Error initializing Puter SDK:', error);
      this.initializeModelDefinitions(); // Still initialize model definitions
      return false;
    }
  }

  private initializeModelDefinitions(): void {
    // Initialize all models as available by default
    this.MODEL_DEFINITIONS.forEach(model => {
      this.availableModels.set(model.id, model);
    });
    console.log(`📋 Initialized ${this.MODEL_DEFINITIONS.length} model definitions`);
  }
  
  private async quickModelTest(): Promise<void> {
    console.log('🧪 Testing primary models...');
    
    // Test only the most important models to reduce initialization time
    const primaryModels = ['deepseek-chat', 'gpt-4o', 'claude-3-5-sonnet', 'gemini-2.0-flash'];
    
    const testPromises = primaryModels.map(async (modelId) => {
      try {
        const startTime = Date.now();
        const response = await this.quickTest(modelId);
        const responseTime = Date.now() - startTime;
        
        if (response && response.length > 0 && !response.toLowerCase().includes('error')) {
          this.modelTestResults.set(modelId, true);
          const model = this.availableModels.get(modelId);
          if (model) {
            model.status = 'live';
            console.log(`✓ ${model.name} - Response time: ${responseTime}ms`);
          }
        } else {
          this.modelTestResults.set(modelId, false);
          const model = this.availableModels.get(modelId);
          if (model) {
            model.status = 'error';
            console.log(`✗ ${model.name} - Test failed`);
          }
        }
      } catch (error) {
        this.modelTestResults.set(modelId, false);
        const model = this.availableModels.get(modelId);
        if (model) {
          model.status = 'error';
        }
        console.warn(`✗ ${modelId} test failed:`, error);
      }
    });
    
    // Run tests in parallel but with timeout
    await Promise.allSettled(testPromises);
    
    const workingModels = Array.from(this.modelTestResults.entries())
      .filter(([_, working]) => working)
      .map(([modelId]) => modelId);
    
    console.log(`🎯 Working models: ${workingModels.join(', ')}`);
  }
  
  async quickTest(model: string): Promise<string> {
    try {
      // Use a very short test message for speed
      const response = await (window as any).puter.ai.chat('Hi', {
        model: model,
        max_tokens: 5, // Minimal tokens for speed
        temperature: 0.1
      });
      return this.extractResponseText(response);
    } catch (error) {
      throw error;
    }
  }
  
  async isAvailable(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      return typeof (window as any).puter !== 'undefined' && 
             typeof (window as any).puter.ai !== 'undefined';
    } catch (error) {
      console.error('Error checking Puter availability:', error);
      return false;
    }
  }
  
  // Optimized memory management
  addToMemory(sessionId: string, role: string, content: string, model: string) {
    const memoryKey = `${sessionId}-${model}`;
    
    if (!this.chatMemory.has(memoryKey)) {
      this.chatMemory.set(memoryKey, {
        messages: [],
        model: model,
        sessionId: sessionId
      });
    }
    
    const memory = this.chatMemory.get(memoryKey)!;
    memory.messages.push({ 
      role, 
      content, 
      timestamp: new Date() 
    });
    
    // Keep last 15 messages for better performance
    if (memory.messages.length > 15) {
      memory.messages = memory.messages.slice(-15);
    }
    
    // Debounced save to localStorage
    this.debouncedSaveMemory(memoryKey, memory);
  }

  private saveTimeouts: Map<string, NodeJS.Timeout> = new Map();
  
  private debouncedSaveMemory(memoryKey: string, memory: ChatMemory) {
    // Clear existing timeout
    const existingTimeout = this.saveTimeouts.get(memoryKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(`chat-memory-${memoryKey}`, JSON.stringify(memory));
        this.saveTimeouts.delete(memoryKey);
      } catch (error) {
        console.warn('Failed to save memory to localStorage:', error);
      }
    }, 500); // 500ms debounce
    
    this.saveTimeouts.set(memoryKey, timeout);
  }
  
  getMemory(sessionId: string, model: string): Array<{ role: string; content: string }> {
    const memoryKey = `${sessionId}-${model}`;
    
    // Try to load from localStorage first
    try {
      const saved = localStorage.getItem(`chat-memory-${memoryKey}`);
      if (saved) {
        const memory = JSON.parse(saved);
        this.chatMemory.set(memoryKey, memory);
        return memory.messages.map((m: any) => ({ role: m.role, content: m.content }));
      }
    } catch (error) {
      console.warn('Failed to load memory from localStorage:', error);
    }
    
    const memory = this.chatMemory.get(memoryKey);
    return memory ? memory.messages.map(m => ({ role: m.role, content: m.content })) : [];
  }
  
  clearMemory(sessionId: string, model?: string) {
    if (model) {
      const memoryKey = `${sessionId}-${model}`;
      this.chatMemory.delete(memoryKey);
      try {
        localStorage.removeItem(`chat-memory-${memoryKey}`);
      } catch (error) {
        console.warn('Failed to clear memory from localStorage:', error);
      }
    } else {
      const keysToDelete = Array.from(this.chatMemory.keys()).filter(key => key.startsWith(sessionId));
      keysToDelete.forEach(key => {
        this.chatMemory.delete(key);
        try {
          localStorage.removeItem(`chat-memory-${key}`);
        } catch (error) {
          console.warn('Failed to clear memory from localStorage:', error);
        }
      });
    }
  }
  
  async chat(message: string, options: PuterAIOptions = {}, sessionId?: string): Promise<string> {
    const startTime = Date.now();
    
    if (!await this.isAvailable()) {
      console.log('🔄 Puter SDK not available, using enhanced fallback');
      return this.getEnhancedFallbackResponse(message, options.model);
    }
    
    const defaultOptions: PuterAIOptions = {
      model: 'deepseek-chat',
      max_tokens: 1500, // Reduced for faster responses
      temperature: 0.7,
      memory: true,
      stream: false,
      ...options
    };
    
    try {
      console.log(`🚀 Sending to ${defaultOptions.model}:`, message.slice(0, 50) + '...');
      
      // Build optimized conversation context
      let conversationMessages: Array<{ role: string; content: string }> = [];
      
      if (defaultOptions.memory && sessionId && defaultOptions.model) {
        const memory = this.getMemory(sessionId, defaultOptions.model);
        // Use only last 6 messages for faster processing
        conversationMessages = [...memory.slice(-6)];
      }
      
      // Add current message
      conversationMessages.push({ role: 'user', content: message });
      
      const puterModel = defaultOptions.model!;
      let response;
      
      // Optimized API call with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 15 seconds')), 15000);
      });
      
      const apiCall = async () => {
        if (conversationMessages.length > 1) {
          // Use conversation format for context
          return await (window as any).puter.ai.chat(conversationMessages, {
            model: puterModel,
            max_tokens: defaultOptions.max_tokens,
            temperature: defaultOptions.temperature
          });
        } else {
          // Use simple format for single messages
          return await (window as any).puter.ai.chat(message, {
            model: puterModel,
            max_tokens: defaultOptions.max_tokens,
            temperature: defaultOptions.temperature
          });
        }
      };
      
      response = await Promise.race([apiCall(), timeoutPromise]);
      
      const responseTime = Date.now() - startTime;
      console.log(`⚡ Response received in ${responseTime}ms`);
      
      const responseText = this.extractResponseText(response);
      
      if (!responseText || responseText.length < 3) {
        throw new Error('Empty or invalid response received');
      }
      
      // Add to memory if enabled
      if (defaultOptions.memory && sessionId && defaultOptions.model) {
        this.addToMemory(sessionId, 'user', message, defaultOptions.model);
        this.addToMemory(sessionId, 'assistant', responseText, defaultOptions.model);
      }
      
      // Update model status based on performance
      const model = this.availableModels.get(defaultOptions.model);
      if (model && responseTime < 10000) {
        model.status = 'live';
      }
      
      return responseText;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`❌ Chat error after ${responseTime}ms:`, error);
      
      // Update model status
      const model = this.availableModels.get(defaultOptions.model!);
      if (model) {
        model.status = 'error';
      }
      
      return this.getEnhancedFallbackResponse(message, defaultOptions.model, error);
    }
  }

  // Optimized image processing
  async imageToText(imageUrl: string, prompt?: string, sessionId?: string): Promise<string> {
    if (!await this.isAvailable()) {
      return 'Image processing service not available. Please ensure the Puter SDK is loaded and try again.';
    }
    
    try {
      console.log('🖼️ Processing image with Puter AI');
      const startTime = Date.now();
      
      let response;
      
      // Optimized image processing with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Image processing timeout after 20 seconds')), 20000);
      });
      
      const imageCall = async () => {
        return await (window as any).puter.ai.chat(
          prompt || 'Describe this image in detail',
          imageUrl,
          false,
          { model: 'gpt-4o', max_tokens: 800 } // Reduced tokens for speed
        );
      };
      
      response = await Promise.race([imageCall(), timeoutPromise]);
      
      const responseTime = Date.now() - startTime;
      console.log(`🖼️ Image processed in ${responseTime}ms`);
      
      const responseText = this.extractResponseText(response);
      
      // Add to memory if sessionId provided
      if (sessionId) {
        this.addToMemory(sessionId, 'user', `[Image Analysis] ${prompt || 'Describe this image'}`, 'gpt-4o');
        this.addToMemory(sessionId, 'assistant', responseText, 'gpt-4o');
      }
      
      return responseText;
    } catch (error) {
      console.error('🖼️ Image processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `I apologize, but I'm unable to process the image at the moment. 

Error: ${errorMessage}

Please try again or use a different image format.`;
    }
  }

  // Enhanced image generation with better error handling
  async generateImage(prompt: string, options: {
    model?: string;
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
    sessionId?: string;
    testMode?: boolean;
  } = {}): Promise<{ imageUrl?: string; error?: string }> {
    if (!await this.isAvailable()) {
      return { error: 'Image generation service not available. Please ensure the Puter SDK is loaded and try again.' };
    }
    
    try {
      console.log('🎨 Generating image with DALL-E:', prompt.slice(0, 50) + '...');
      const startTime = Date.now();
      
      // Use test mode by default to avoid credits during development
      const testMode = options.testMode !== undefined ? options.testMode : false;
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Image generation timeout after 30 seconds')), 30000);
      });
      
      const imageCall = async () => {
        return await (window as any).puter.ai.txt2img(prompt, testMode);
      };
      
      const imageElement = await Promise.race([imageCall(), timeoutPromise]);
      
      if (!imageElement || !imageElement.src) {
        throw new Error('No image element received from DALL-E API');
      }
      
      const responseTime = Date.now() - startTime;
      console.log(`🎨 Image generated in ${responseTime}ms`);
      
      const imageUrl = imageElement.src;
      
      // Add to memory if sessionId provided
      if (options.sessionId) {
        this.addToMemory(options.sessionId, 'user', `[Image Generation] ${prompt}`, 'dall-e');
        this.addToMemory(options.sessionId, 'assistant', `Generated image: ${imageUrl}`, 'dall-e');
      }
      
      return { imageUrl };
      
    } catch (error) {
      console.error('🎨 Image generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { 
        error: `Failed to generate image: ${errorMessage}`
      };
    }
  }
  
  private getEnhancedFallbackResponse(message: string, model?: string, error?: any): string {
    const modelInfo = model ? this.getModelInfo(model) : null;
    const modelName = modelInfo ? modelInfo.name : 'AI Assistant';
    
    if (message.toLowerCase().includes('code') || message.toLowerCase().includes('program')) {
      return `I'd be happy to help with coding! However, I'm currently experiencing connectivity issues with the ${modelName} service.

Quick Coding Tips:
1. For debugging: Check syntax, indentation, and variable names
2. For new projects: Start with a basic structure and build incrementally
3. For algorithms: Break down the problem into smaller steps

Please try again in a moment when the connection is restored.`;
    }
    
    const fallbackResponses = [
      `Hello! I'm ${modelName} and I'd love to help with your question. However, I'm currently experiencing connectivity issues. Please try again in a moment!`,
      
      `Your message has been received! Unfortunately, there seems to be a temporary service issue with ${modelName}. I'm working to get back online shortly.`,
      
      `${modelName} here! I see your question and want to help, but I'm experiencing some technical difficulties. Please try again in a few moments.`,
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
  
  private extractResponseText(response: any): string {
    if (typeof response === 'string' && response.trim()) {
      return response.trim();
    }
    
    if (response && typeof response === 'object') {
      const possiblePaths = [
        response.message?.content,
        response.message?.content?.[0]?.text,
        response.text,
        response.content,
        response.message,
        response.data,
        response.choices?.[0]?.message?.content,
        response.response,
        response.output,
        response.result
      ];
      
      for (const text of possiblePaths) {
        if (typeof text === 'string' && text.trim()) {
          return text.trim();
        }
      }
    }
    
    if (response === null || response === undefined) {
      return 'No response received from AI service. Please try again.';
    }
    
    const stringResponse = String(response);
    if (!stringResponse || stringResponse === 'undefined' || stringResponse === 'null') {
      return 'Invalid response format from AI service. Please try again.';
    }
    
    return stringResponse;
  }
  
  // Enhanced model management
  getAvailableModels(): ModelInfo[] {
    return Array.from(this.availableModels.values());
  }
  
  getModelsByCategory(): Record<string, ModelInfo[]> {
    const models = this.getAvailableModels();
    const categories: Record<string, ModelInfo[]> = {};
    
    models.forEach(model => {
      if (!categories[model.category]) {
        categories[model.category] = [];
      }
      categories[model.category].push(model);
    });
    
    return categories;
  }
  
  getModelInfo(modelId: string): ModelInfo | undefined {
    return this.availableModels.get(modelId);
  }
  
  isModelWorking(modelId: string): boolean {
    return this.modelTestResults.get(modelId) === true;
  }
  
  getWorkingModels(): ModelInfo[] {
    return this.getAvailableModels().filter(model => 
      this.isModelWorking(model.id) || model.status === 'live'
    );
  }
  
  // Get recommended model based on task
  getRecommendedModel(task: 'chat' | 'code' | 'reasoning' | 'fast'): string {
    const recommendations = {
      chat: 'deepseek-chat',
      code: 'codestral-latest',
      reasoning: 'deepseek-reasoner',
      fast: 'gpt-4o-mini'
    };
    
    const recommended = recommendations[task];
    return this.isModelWorking(recommended) ? recommended : 'deepseek-chat';
  }
}

export const puterService = PuterService.getInstance();