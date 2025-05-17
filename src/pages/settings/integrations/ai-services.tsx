import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/ui/container';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronRight, Layers, Settings } from 'lucide-react';
import { aiService, AIServiceConfig } from '@/services/aiService';

export default function AIServicesPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'openai' | 'gemini'>('openai');
  const [configs, setConfigs] = useState<{
    openai?: AIServiceConfig;
    gemini?: AIServiceConfig;
  }>({});

  const { register, handleSubmit, reset, watch, setValue } = useForm<AIServiceConfig>({
    defaultValues: {
      service_name: 'openai',
      api_key: '',
      is_active: false,
    },
  });

  useEffect(() => {
    loadConfigs();
    // Check if user is admin here if needed
  }, []);

  useEffect(() => {
    const currentConfig = configs[activeTab];
    if (currentConfig) {
      reset(currentConfig);
    } else {
      reset({
        service_name: activeTab,
        api_key: '',
        is_active: false,
      });
    }
  }, [activeTab, configs, reset]);

  const loadConfigs = async () => {
    try {
      setIsLoading(true);
      const openaiConfig = await aiService.getAIServiceConfig('openai');
      const geminiConfig = await aiService.getAIServiceConfig('gemini');

      const newConfigs: any = {};
      if (openaiConfig) {
        newConfigs.openai = openaiConfig;
      }
      if (geminiConfig) {
        newConfigs.gemini = geminiConfig;
      }

      setConfigs(newConfigs);
    } catch (error) {
      console.error('Error loading AI configs:', error);
      toast.error('Failed to load AI service configurations');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AIServiceConfig) => {
    try {
      setIsLoading(true);
      await aiService.saveAIServiceConfig({
        ...data,
        service_name: activeTab,
      });
      await loadConfigs();
      toast.success(`${activeTab.toUpperCase()} configuration saved successfully`);
    } catch (error) {
      console.error('Error saving AI config:', error);
      toast.error(`Failed to save ${activeTab.toUpperCase()} configuration`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/integrations">
              <Layers className="h-4 w-4 mr-1" />
              Integration Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/ai-services" isCurrentPage>
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              AI Services
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI Services Configuration</h1>
            <p className="text-muted-foreground">Configure AI providers for workout and diet plan generation</p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'openai' | 'gemini')}
          className="space-y-4"
        >
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="openai" className="flex-1">OpenAI</TabsTrigger>
            <TabsTrigger value="gemini" className="flex-1">Google Gemini</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'openai' ? 'OpenAI' : 'Google Gemini'} Configuration
                </CardTitle>
                <CardDescription>
                  Enter your API key and enable the service to start generating AI-powered plans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key</Label>
                  <Input
                    id="api_key"
                    type="password"
                    placeholder={`Enter your ${activeTab === 'openai' ? 'OpenAI' : 'Gemini'} API key`}
                    {...register('api_key', { required: true })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {activeTab === 'openai' 
                      ? 'Get your API key from https://platform.openai.com/api-keys'
                      : 'Get your API key from https://aistudio.google.com/app/apikey'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={watch('is_active')}
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                  />
                  <Label htmlFor="is_active">
                    {watch('is_active') ? 'Active' : 'Inactive'}
                  </Label>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Tabs>
      </div>
    </Container>
  );
}
