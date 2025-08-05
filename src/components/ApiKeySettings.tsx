import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySettingsProps {
  onApiKeySet: () => void;
}

export const ApiKeySettings = ({ onApiKeySet }: ApiKeySettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const existingKey = localStorage.getItem('openai_api_key');
    if (existingKey) {
      setHasExistingKey(true);
      setApiKey(existingKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setHasExistingKey(true);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved locally and securely.",
    });
    onApiKeySet();
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setHasExistingKey(false);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed from local storage.",
    });
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>OpenAI API Key Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">
            OpenAI API Key {hasExistingKey && <span className="text-green-600">(Saved)</span>}
          </Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Your API key is stored locally in your browser and never sent to our servers.
            Get your API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenAI Platform
            </a>
          </p>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSaveApiKey} className="flex-1">
            {hasExistingKey ? 'Update API Key' : 'Save API Key'}
          </Button>
          {hasExistingKey && (
            <Button variant="outline" onClick={handleClearApiKey}>
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};