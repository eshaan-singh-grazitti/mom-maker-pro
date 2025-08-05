import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  ListTodo, 
  Edit3, 
  Save, 
  Mail,
  Plus,
  X,
  Calendar,
  User
} from 'lucide-react';
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

interface MeetingMinutesEditorProps {
  data: MeetingData;
  onSave: (data: MeetingData) => void;
  onSendEmail: (data: MeetingData, emails: string[]) => void;
}

export const MeetingMinutesEditor = ({ data, onSave, onSendEmail }: MeetingMinutesEditorProps) => {
  const [editingData, setEditingData] = useState<MeetingData>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(editingData);
    setIsEditing(false);
    toast({
      title: "Meeting minutes saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const addAttendee = () => {
    setEditingData(prev => ({
      ...prev,
      attendees: [...prev.attendees, '']
    }));
  };

  const updateAttendee = (index: number, value: string) => {
    setEditingData(prev => ({
      ...prev,
      attendees: prev.attendees.map((attendee, i) => i === index ? value : attendee)
    }));
  };

  const removeAttendee = (index: number) => {
    setEditingData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  const addAgendaItem = () => {
    setEditingData(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  const updateAgendaItem = (index: number, value: string) => {
    setEditingData(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }));
  };

  const removeAgendaItem = (index: number) => {
    setEditingData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const addDecision = () => {
    setEditingData(prev => ({
      ...prev,
      decisions: [...prev.decisions, '']
    }));
  };

  const updateDecision = (index: number, value: string) => {
    setEditingData(prev => ({
      ...prev,
      decisions: prev.decisions.map((decision, i) => i === index ? value : decision)
    }));
  };

  const removeDecision = (index: number) => {
    setEditingData(prev => ({
      ...prev,
      decisions: prev.decisions.filter((_, i) => i !== index)
    }));
  };

  const addActionItem = () => {
    setEditingData(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, {
        id: Date.now().toString(),
        task: '',
        owner: '',
        deadline: ''
      }]
    }));
  };

  const updateActionItem = (index: number, field: keyof ActionItem, value: string) => {
    setEditingData(prev => ({
      ...prev,
      actionItems: prev.actionItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeActionItem = (index: number) => {
    setEditingData(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter((_, i) => i !== index)
    }));
  };

  const addEmailAddress = () => {
    if (newEmail && !emailAddresses.includes(newEmail)) {
      setEmailAddresses(prev => [...prev, newEmail]);
      setNewEmail('');
    }
  };

  const removeEmailAddress = (email: string) => {
    setEmailAddresses(prev => prev.filter(e => e !== email));
  };

  const handleSendEmail = () => {
    if (emailAddresses.length === 0) {
      toast({
        title: "No email addresses",
        description: "Please add at least one email address.",
        variant: "destructive"
      });
      return;
    }
    
    onSendEmail(editingData, emailAddresses);
    setShowEmailDialog(false);
    toast({
      title: "Meeting minutes sent",
      description: `Minutes sent to ${emailAddresses.length} recipients.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meeting Minutes</h2>
          <p className="text-muted-foreground">Review and edit before sending</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={isEditing ? "success" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
          <Button
            variant="gradient"
            onClick={() => setShowEmailDialog(true)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Meeting Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Meeting Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Meeting Title</label>
              {isEditing ? (
                <Input
                  value={editingData.meetingTitle}
                  onChange={(e) => setEditingData(prev => ({ ...prev, meetingTitle: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm">{editingData.meetingTitle}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Date</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editingData.meetingDate}
                  onChange={(e) => setEditingData(prev => ({ ...prev, meetingDate: e.target.value }))}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1 text-sm">{new Date(editingData.meetingDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Attendees</span>
              <Badge variant="secondary">{editingData.attendees.length}</Badge>
            </div>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addAttendee}>
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {editingData.attendees.map((attendee, index) => (
              <div key={index} className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {isEditing ? (
                  <>
                    <Input
                      value={attendee}
                      onChange={(e) => updateAttendee(index, e.target.value)}
                      placeholder="Attendee name"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttendee(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <span className="flex-1">{attendee}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agenda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Agenda</span>
            </div>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addAgendaItem}>
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {editingData.agenda.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-sm text-muted-foreground mt-2 flex-shrink-0">{index + 1}.</span>
                {isEditing ? (
                  <>
                    <Textarea
                      value={item}
                      onChange={(e) => updateAgendaItem(index, e.target.value)}
                      placeholder="Agenda item"
                      className="flex-1 min-h-[60px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAgendaItem(index)}
                      className="mt-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <p className="flex-1 text-sm">{item}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discussion Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Discussion Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editingData.summary}
              onChange={(e) => setEditingData(prev => ({ ...prev, summary: e.target.value }))}
              className="min-h-[120px]"
              placeholder="Meeting discussion summary..."
            />
          ) : (
            <p className="text-sm leading-relaxed">{editingData.summary}</p>
          )}
        </CardContent>
      </Card>

      {/* Decisions Made */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Decisions Made</span>
            </div>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addDecision}>
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {editingData.decisions.map((decision, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                {isEditing ? (
                  <>
                    <Textarea
                      value={decision}
                      onChange={(e) => updateDecision(index, e.target.value)}
                      placeholder="Decision made"
                      className="flex-1 min-h-[60px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDecision(index)}
                      className="mt-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <p className="flex-1 text-sm">{decision}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ListTodo className="w-5 h-5" />
              <span>Action Items</span>
              <Badge variant="secondary">{editingData.actionItems.length}</Badge>
            </div>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addActionItem}>
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editingData.actionItems.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Textarea
                        value={item.task}
                        onChange={(e) => updateActionItem(index, 'task', e.target.value)}
                        placeholder="Action item description"
                        className="min-h-[60px]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={item.owner}
                          onChange={(e) => updateActionItem(index, 'owner', e.target.value)}
                          placeholder="Owner"
                        />
                        <Input
                          type="date"
                          value={item.deadline}
                          onChange={(e) => updateActionItem(index, 'deadline', e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActionItem(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm">{item.task}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span><strong>Owner:</strong> {item.owner}</span>
                      <span><strong>Due:</strong> {new Date(item.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      {showEmailDialog && (
        <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-strong max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Meeting Minutes</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Addresses</label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email address"
                    onKeyPress={(e) => e.key === 'Enter' && addEmailAddress()}
                  />
                  <Button onClick={addEmailAddress} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {emailAddresses.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipients:</label>
                  <div className="flex flex-wrap gap-2">
                    {emailAddresses.map((email) => (
                      <Badge key={email} variant="secondary" className="flex items-center space-x-1">
                        <span>{email}</span>
                        <button onClick={() => removeEmailAddress(email)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendEmail}>
                  Send Minutes
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};