import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrapingAlert } from "@/hooks/useAlertManagement";
import { format } from "date-fns";
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface AlertDetailDialogProps {
  alert: ScrapingAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (alertId: string, status: any, notes?: string, userId?: string) => void;
  userId?: string;
}

export const AlertDetailDialog = ({ 
  alert, 
  open, 
  onOpenChange, 
  onUpdateStatus,
  userId 
}: AlertDetailDialogProps) => {
  const [newStatus, setNewStatus] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!alert) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'error':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'investigating':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleUpdateStatus = () => {
    if (!newStatus || !userId) return;
    onUpdateStatus(alert.id, newStatus, notes, userId);
    setNotes('');
    setNewStatus('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSeverityIcon(alert.severity)}
            Alert Details
          </DialogTitle>
          <DialogDescription>
            Detected at {format(new Date(alert.detected_at), 'PPpp')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Severity:</span>
              <Badge variant={getSeverityColor(alert.severity)}>
                {alert.severity}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge className="flex items-center gap-1">
                {getStatusIcon(alert.status)}
                {alert.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Type:</span>
              <Badge variant="outline">{alert.alert_type}</Badge>
            </div>
          </div>

          {/* Message */}
          <div>
            <h4 className="text-sm font-medium mb-1">Message</h4>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
          </div>

          {/* Details */}
          {alert.details && Object.keys(alert.details).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Details</h4>
              <div className="bg-muted p-3 rounded-md">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(alert.details, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-medium mb-2">Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Detected:</span>
                <span>{format(new Date(alert.detected_at), 'PPpp')}</span>
              </div>
              {alert.acknowledged_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Acknowledged:</span>
                  <span>{format(new Date(alert.acknowledged_at), 'PPpp')}</span>
                </div>
              )}
              {alert.resolved_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolved:</span>
                  <span>{format(new Date(alert.resolved_at), 'PPpp')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Resolution Notes */}
          {alert.resolution_notes && (
            <div>
              <h4 className="text-sm font-medium mb-1">Resolution Notes</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {alert.resolution_notes}
              </p>
            </div>
          )}

          {/* Update Status Section */}
          {alert.status !== 'resolved' && alert.status !== 'false_positive' && (
            <div className="pt-4 border-t space-y-3">
              <h4 className="text-sm font-medium">Update Status</h4>
              
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Add notes (optional for most statuses, required for resolved)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />

              <Button 
                onClick={handleUpdateStatus}
                disabled={!newStatus || (newStatus === 'resolved' && !notes)}
                className="w-full"
              >
                Update Status
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
