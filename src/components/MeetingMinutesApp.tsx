import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ProcessingStatus } from './ProcessingStatus';
import { MeetingMinutesEditor } from './MeetingMinutesEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateMeetingMinutes } from '@/lib/supabase';

interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
}

interface MeetingData {
  attendees: string[];
  agenda: string[];
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
  meetingTitle: string;
  meetingDate: string;
}

type AppStep = 'upload' | 'processing' | 'editing';

export const MeetingMinutesApp = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const { toast } = useToast();

  const processWithAI = async (transcript: string, meetingTitle?: string) => {
    setIsProcessing(true);
    setCurrentStep('processing');
    
    try {
      // Step 1: Upload/Validation
      setProcessingStep('upload');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: AI Processing
      setProcessingStep('extraction');
      setProgress(60);
      
      const data = await generateMeetingMinutes(
        transcript, 
        meetingTitle || "Meeting Minutes",
        new Date().toISOString().split('T')[0]
      );

      // Step 3: Finalizing
      setProcessingStep('generation');
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      setMeetingData(data);
      setIsProcessing(false);
      setCurrentStep('editing');
      
      toast({
        title: "Processing complete!",
        description: "Your meeting minutes have been generated and are ready for review.",
      });
    } catch (error) {
      console.error('Error processing meeting:', error);
      setIsProcessing(false);
      setCurrentStep('upload');
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File, type: 'audio' | 'transcript') => {
    if (type === 'transcript') {
      const text = await file.text();
      await processWithAI(text, file.name.replace(/\.[^/.]+$/, ""));
    } else {
      toast({
        title: "Audio processing not implemented",
        description: "Audio transcription is not yet implemented. Please upload a text transcript instead.",
        variant: "destructive",
      });
    }
  };

  const handleTranscriptInput = async (text: string) => {
    await processWithAI(text);
  };

  const handleSaveMeeting = (data: MeetingData) => {
    setMeetingData(data);
    console.log('Meeting data saved:', data);
  };

  const handleSendEmail = (data: MeetingData, emails: string[]) => {
    console.log('Sending email to:', emails);
    console.log('Meeting data:', data);
    // In a real app, this would send emails via an API
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setMeetingData(null);
    setIsProcessing(false);
    setProcessingStep('');
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">AI Meeting Minutes Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your meeting recordings or transcripts into professional minutes with AI-powered automation
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'upload' && (
            <Card className="shadow-medium">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h2 className="text-xl font-semibold mb-2">Get Started</h2>
                  <p className="text-muted-foreground">
                    Upload your meeting audio file or paste a transcript to generate professional minutes
                  </p>
                </div>
                
                <FileUpload
                  onFileUpload={handleFileUpload}
                  onTranscriptInput={handleTranscriptInput}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 'processing' && (
            <ProcessingStatus
              isProcessing={isProcessing}
              currentStep={processingStep}
              progress={progress}
            />
          )}

          {currentStep === 'editing' && meetingData && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleStartOver}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>
              
              <MeetingMinutesEditor
                data={meetingData}
                onSave={handleSaveMeeting}
                onSendEmail={handleSendEmail}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Powered by AI • Secure • Professional</p>
        </div>
      </div>
    </div>
  );
};