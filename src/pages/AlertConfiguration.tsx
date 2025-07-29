import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Volume2, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Trash2,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AlertConfiguration = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      name: "High Volume Alert",
      type: "volume",
      condition: "greater_than",
      value: "10000",
      isActive: true,
      soundEnabled: true,
      emailEnabled: false
    },
    {
      id: 2,
      name: "Delta Imbalance",
      type: "delta",
      condition: "greater_than",
      value: "500",
      isActive: true,
      soundEnabled: true,
      emailEnabled: true
    },
    {
      id: 3,
      name: "Price Level Break",
      type: "price",
      condition: "crosses_above",
      value: "4570.00",
      isActive: false,
      soundEnabled: false,
      emailEnabled: true
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    name: "",
    type: "volume",
    condition: "greater_than",
    value: "",
    isActive: true,
    soundEnabled: true,
    emailEnabled: false
  });

  const alertTypes = [
    { value: "volume", label: "Volume", icon: Volume2 },
    { value: "delta", label: "Delta", icon: TrendingUp },
    { value: "price", label: "Price", icon: Target },
    { value: "imbalance", label: "Order Imbalance", icon: AlertTriangle }
  ];

  const conditions = {
    volume: [
      { value: "greater_than", label: "Greater than" },
      { value: "less_than", label: "Less than" }
    ],
    delta: [
      { value: "greater_than", label: "Greater than" },
      { value: "less_than", label: "Less than" },
      { value: "absolute_greater", label: "Absolute value greater than" }
    ],
    price: [
      { value: "crosses_above", label: "Crosses above" },
      { value: "crosses_below", label: "Crosses below" },
      { value: "touches", label: "Touches level" }
    ],
    imbalance: [
      { value: "bullish", label: "Bullish imbalance" },
      { value: "bearish", label: "Bearish imbalance" },
      { value: "ratio_greater", label: "Ratio greater than" }
    ]
  };

  const handleCreateAlert = () => {
    if (!newAlert.name || !newAlert.value) {
      toast({
        title: "Invalid Alert",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const alert = {
      ...newAlert,
      id: alerts.length + 1
    };

    setAlerts([...alerts, alert]);
    setNewAlert({
      name: "",
      type: "volume",
      condition: "greater_than",
      value: "",
      isActive: true,
      soundEnabled: true,
      emailEnabled: false
    });

    toast({
      title: "Alert Created",
      description: `Alert "${alert.name}" has been created successfully.`,
    });
  };

  const handleToggleAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "Alert has been removed successfully.",
    });
  };

  const handleUpdateAlert = (id: number, field: string, value: any) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, [field]: value } : alert
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alert Configuration</h1>
          <p className="text-muted-foreground">
            Configure custom alerts for order flow events and market conditions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Settings className="w-3 h-3" />
            {alerts.filter(a => a.isActive).length} Active
          </Badge>
        </div>
      </div>

      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Alert
          </CardTitle>
          <CardDescription>
            Set up custom alerts for specific market conditions and order flow events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alert-name">Alert Name</Label>
              <Input
                id="alert-name"
                placeholder="Enter alert name..."
                value={newAlert.name}
                onChange={(e) => setNewAlert({...newAlert, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alert-type">Alert Type</Label>
              <Select value={newAlert.type} onValueChange={(value) => setNewAlert({...newAlert, type: value, condition: conditions[value as keyof typeof conditions][0].value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {alertTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-condition">Condition</Label>
              <Select value={newAlert.condition} onValueChange={(value) => setNewAlert({...newAlert, condition: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions[newAlert.type as keyof typeof conditions]?.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-value">Value</Label>
              <Input
                id="alert-value"
                placeholder="Enter threshold value..."
                value={newAlert.value}
                onChange={(e) => setNewAlert({...newAlert, value: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="sound-enabled"
                checked={newAlert.soundEnabled}
                onCheckedChange={(checked) => setNewAlert({...newAlert, soundEnabled: checked})}
              />
              <Label htmlFor="sound-enabled" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Sound Alert
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="email-enabled"
                checked={newAlert.emailEnabled}
                onCheckedChange={(checked) => setNewAlert({...newAlert, emailEnabled: checked})}
              />
              <Label htmlFor="email-enabled">Email Notification</Label>
            </div>
          </div>

          <Button onClick={handleCreateAlert} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </CardContent>
      </Card>

      {/* Existing Alerts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Active Alerts</h2>
        
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts configured yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert) => {
              const AlertIcon = alertTypes.find(t => t.value === alert.type)?.icon || Bell;
              return (
                <Card key={alert.id} className={`transition-all duration-200 ${alert.isActive ? 'border-primary/50 bg-primary/5' : 'border-muted'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${alert.isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                          <AlertIcon className={`w-4 h-4 ${alert.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{alert.name}</CardTitle>
                          <CardDescription>
                            {alertTypes.find(t => t.value === alert.type)?.label} {conditions[alert.type as keyof typeof conditions]?.find(c => c.value === alert.condition)?.label.toLowerCase()} {alert.value}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.isActive ? (
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={() => handleToggleAlert(alert.id)}
                          />
                          <Label className="text-sm">Enabled</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={alert.soundEnabled}
                            onCheckedChange={(checked) => handleUpdateAlert(alert.id, 'soundEnabled', checked)}
                          />
                          <Label className="text-sm flex items-center gap-1">
                            <Bell className="w-3 h-3" />
                            Sound
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={alert.emailEnabled}
                            onCheckedChange={(checked) => handleUpdateAlert(alert.id, 'emailEnabled', checked)}
                          />
                          <Label className="text-sm">Email</Label>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Statistics</CardTitle>
          <CardDescription>Overview of your alert configuration and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{alerts.length}</div>
              <div className="text-sm text-muted-foreground">Total Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-profit">{alerts.filter(a => a.isActive).length}</div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{alerts.filter(a => a.soundEnabled).length}</div>
              <div className="text-sm text-muted-foreground">Sound Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{alerts.filter(a => a.emailEnabled).length}</div>
              <div className="text-sm text-muted-foreground">Email Enabled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertConfiguration;
