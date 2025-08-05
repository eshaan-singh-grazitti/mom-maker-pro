import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileAudio, FileText, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File, type: 'audio' | 'transcript') => void;
  onTranscriptInput: (text: string) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileUpload, onTranscriptInput, isProcessing }: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transcriptText, setTranscriptText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check file type and size
    const isAudio = file.type.startsWith('audio/');
    const isText = file.type === 'text/plain' || file.name.endsWith('.txt');
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 100MB",
        variant: "destructive"
      });
      return;
    }

    if (!isAudio && !isText) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (.mp3, .wav, .m4a) or text file (.txt)",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    
    if (isText) {
      // Read text file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileUpload(file, 'transcript');
        onTranscriptInput(content);
      };
      reader.readAsText(file);
    } else {
      onFileUpload(file, 'audio');
    }
  }, [onFileUpload, onTranscriptInput, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg'],
      'text/plain': ['.txt']
    },
    multiple: false,
    disabled: isProcessing
  });

  const handleTranscriptSubmit = () => {
    if (!transcriptText.trim()) {
      toast({
        title: "Empty transcript",
        description: "Please enter a meeting transcript",
        variant: "destructive"
      });
      return;
    }
    onTranscriptInput(transcriptText);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setTranscriptText('');
  };

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === 'upload' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('upload')}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant={activeTab === 'text' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('text')}
          className="flex-1"
        >
          <FileText className="w-4 h-4 mr-2" />
          Paste Text
        </Button>
      </div>

      {activeTab === 'upload' && (
        <Card className="p-6">
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-smooth
                ${isDragActive 
                  ? 'border-primary bg-primary/5 shadow-medium' 
                  : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
                }
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop your file here' : 'Upload meeting audio or transcript'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Support for MP3, WAV, M4A audio files or TXT transcript files (max 100MB)
                  </p>
                </div>
                <Button variant="outline" disabled={isProcessing}>
                  Choose File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {uploadedFile.type.startsWith('audio/') ? (
                    <FileAudio className="w-5 h-5 text-primary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFile} disabled={isProcessing}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {uploadedFile.type.startsWith('audio/') && (
                <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Audio file uploaded successfully. Processing will begin once you click "Process Meeting".
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'text' && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Meeting Transcript</label>
              <p className="text-xs text-muted-foreground mt-1">
                Paste your meeting transcript below
              </p>
            </div>
            <textarea
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              className="w-full h-64 p-3 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleTranscriptSubmit} 
              disabled={!transcriptText.trim() || isProcessing}
              className="w-full"
            >
              Process Transcript
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};