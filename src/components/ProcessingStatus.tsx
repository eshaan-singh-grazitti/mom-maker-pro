import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, AudioWaveform, FileText, Users, Lightbulb, CheckSquare, Clock } from 'lucide-react';

interface ProcessingStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProcessingStatusProps {
  isProcessing: boolean;
  currentStep: string;
  progress: number;
}

export const ProcessingStatus = ({ isProcessing, currentStep, progress }: ProcessingStatusProps) => {
  const steps: ProcessingStep[] = [
    {
      id: 'upload',
      label: 'Processing audio file',
      icon: AudioWaveform,
      status: currentStep === 'upload' ? 'processing' : 
             ['transcription', 'diarization', 'extraction', 'generation'].includes(currentStep) ? 'completed' : 'pending'
    },
    {
      id: 'transcription',
      label: 'Generating transcript',
      icon: FileText,
      status: currentStep === 'transcription' ? 'processing' : 
             ['diarization', 'extraction', 'generation'].includes(currentStep) ? 'completed' : 'pending'
    },
    {
      id: 'diarization',
      label: 'Identifying speakers',
      icon: Users,
      status: currentStep === 'diarization' ? 'processing' : 
             ['extraction', 'generation'].includes(currentStep) ? 'completed' : 'pending'
    },
    {
      id: 'extraction',
      label: 'Extracting key information',
      icon: Lightbulb,
      status: currentStep === 'extraction' ? 'processing' : 
             currentStep === 'generation' ? 'completed' : 'pending'
    },
    {
      id: 'generation',
      label: 'Generating meeting minutes',
      icon: CheckSquare,
      status: currentStep === 'generation' ? 'processing' : 'pending'
    }
  ];

  if (!isProcessing && currentStep === '') {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Processing Meeting</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${step.status === 'completed' 
                    ? 'bg-success text-success-foreground' 
                    : step.status === 'processing'
                    ? 'bg-primary text-primary-foreground animate-pulse'
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : step.status === 'processing' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`
                    text-sm font-medium
                    ${step.status === 'completed' 
                      ? 'text-success' 
                      : step.status === 'processing'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                    }
                  `}>
                    {step.label}
                  </p>
                  {step.status === 'processing' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      This may take a few moments...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};