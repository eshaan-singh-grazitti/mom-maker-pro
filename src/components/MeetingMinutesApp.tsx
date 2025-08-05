import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ProcessingStatus } from './ProcessingStatus';
import { MeetingMinutesEditor } from './MeetingMinutesEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const simulateProcessing = async () => {
    setIsProcessing(true);
    setCurrentStep('processing');
    
    const steps = [
      { step: 'upload', duration: 1000, progress: 20 },
      { step: 'transcription', duration: 3000, progress: 40 },
      { step: 'diarization', duration: 2000, progress: 60 },
      { step: 'extraction', duration: 2000, progress: 80 },
      { step: 'generation', duration: 1500, progress: 100 }
    ];

    for (const { step, duration, progress: stepProgress } of steps) {
      setProcessingStep(step);
      setProgress(stepProgress);
      await new Promise(resolve => setTimeout(resolve, duration));
    }

    // Generate mock meeting data
    const mockData: MeetingData = {
      meetingTitle: "Weekly Team Standup",
      meetingDate: new Date().toISOString().split('T')[0],
      attendees: [
        "Sarah Johnson (Product Manager)",
        "Mike Chen (Lead Developer)",
        "Emma Wilson (UX Designer)",
        "Alex Rodriguez (Marketing Lead)"
      ],
      agenda: [
        "Project progress review and milestone updates",
        "Technical challenges and solutions discussion",
        "Marketing campaign launch timeline",
        "Resource allocation for Q2 initiatives"
      ],
      summary: "The team discussed significant progress on the Q1 project deliverables. Mike highlighted that the backend API development is 90% complete, ahead of schedule. Emma presented the final UI designs which received positive feedback from stakeholders. Alex confirmed the marketing campaign will launch next Tuesday with all assets approved. The team addressed concerns about resource allocation for the upcoming Q2 initiatives and agreed on a phased approach to manage workload effectively.",
      decisions: [
        "Approved final UI designs for production release",
        "Confirmed marketing campaign launch date for next Tuesday",
        "Adopted phased approach for Q2 resource allocation",
        "Extended backend API testing phase by one week for quality assurance"
      ],
      actionItems: [
        {
          id: "1",
          task: "Complete backend API testing and deployment to staging environment",
          owner: "Mike Chen",
          deadline: "2024-03-15"
        },
        {
          id: "2",
          task: "Finalize marketing assets and coordinate with design team for last-minute adjustments",
          owner: "Alex Rodriguez",
          deadline: "2024-03-12"
        },
        {
          id: "3",
          task: "Conduct user acceptance testing on new UI components",
          owner: "Emma Wilson",
          deadline: "2024-03-18"
        },
        {
          id: "4",
          task: "Prepare Q2 resource allocation proposal and present to leadership",
          owner: "Sarah Johnson",
          deadline: "2024-03-20"
        }
      ]
    };

    setMeetingData(mockData);
    setIsProcessing(false);
    setCurrentStep('editing');
    
    toast({
      title: "Processing complete!",
      description: "Your meeting minutes have been generated and are ready for review.",
    });
  };

  const handleFileUpload = async (file: File, type: 'audio' | 'transcript') => {
    console.log('File uploaded:', file.name, 'Type:', type);
    await simulateProcessing();
  };

  const handleTranscriptInput = async (text: string) => {
    console.log('Transcript provided:', text.substring(0, 100) + '...');
    await simulateProcessing();
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