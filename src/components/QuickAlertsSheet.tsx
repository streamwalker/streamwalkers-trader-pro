import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Bell, TrendingUp, BarChart3, Target, Volume2, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickAlert {
  id: string;
  name: string;
  type: string;
  symbol: string;
  condition: string;
  value: string;
  soundEnabled: boolean;
  emailEnabled: boolean;
}

interface QuickAlertsSheetProps {
  children: React.ReactNode;
}

export const QuickAlertsSheet = ({ children }: QuickAlertsSheetProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [newAlert, setNewAlert] = useState({
    name: "",
    type: "price",
    symbol: "ES",
    condition: "above",
    value: "",
    soundEnabled: true,
    emailEnabled: false
  });

  const symbols = ["ES", "NQ", "YM", "RTY"];
  
  const alertTemplates = [
    {
      id: "price_break",
      name: "Price Breakout",
      description: "Alert when price breaks above/below key levels",
      icon: TrendingUp,
      defaultType: "price",
      defaultCondition: "above"
    },
    {
      id: "vix_spike",
      name: "VIX Volatility Alert",
      description: "Alert on high volatility conditions",
      icon: Activity,
      defaultType: "vix",
      defaultCondition: "above"
    },
    {
      id: "volume_surge",
      name: "Volume Surge",
      description: "Alert on unusual volume activity",
      icon: Volume2,
      defaultType: "volume",
      defaultCondition: "above"
    },
    {
      id: "support_resistance",
      name: "Key Level Touch",
      description: "Alert when price approaches support/resistance",
      icon: Target,
      defaultType: "price",
      defaultCondition: "near"
    },
    {
      id: "rsi_signal",
      name: "RSI Overbought/Oversold",
      description: "Alert on RSI extreme conditions",
      icon: BarChart3,
      defaultType: "rsi",
      defaultCondition: "above"
    }
  ];

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id);
    setNewAlert(prev => ({
      ...prev,
      name: template.name,
      type: template.defaultType,
      condition: template.defaultCondition,
      value: getDefaultValue(template.defaultType)
    }));
  };

  const getDefaultValue = (type: string) => {
    switch (type) {
      case "price": return "5800";
      case "vix": return "25";
      case "volume": return "100000";
      case "rsi": return "70";
      default: return "";
    }
  };

  const createAlert = () => {
    if (!newAlert.name || !newAlert.value) {
      toast({
        title: "Incomplete Alert",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate creating the alert
    const alert: QuickAlert = {
      id: Date.now().toString(),
      ...newAlert
    };

    toast({
      title: "Alert Created",
      description: `${alert.name} alert has been set for ${alert.symbol}.`,
    });

    // Reset form
    setNewAlert({
      name: "",
      type: "price",
      symbol: "ES",
      condition: "above",
      value: "",
      soundEnabled: true,
      emailEnabled: false
    });
    setSelectedTemplate("");
    setOpen(false);
  };

  const getConditionOptions = (type: string) => {
    switch (type) {
      case "price":
        return [
          { value: "above", label: "Above" },
          { value: "below", label: "Below" },
          { value: "near", label: "Near (±0.5%)" }
        ];
      case "volume":
        return [
          { value: "above", label: "Above" },
          { value: "surge", label: "Surge (300%+)" }
        ];
      case "rsi":
        return [
          { value: "above", label: "Above (Overbought)" },
          { value: "below", label: "Below (Oversold)" }
        ];
      case "vix":
        return [
          { value: "above", label: "Above" },
          { value: "below", label: "Below" }
        ];
      default:
        return [{ value: "above", label: "Above" }];
    }
  };

  const getValueLabel = (type: string) => {
    switch (type) {
      case "price": return "Price Level";
      case "volume": return "Volume Threshold";
      case "rsi": return "RSI Level (0-100)";
      case "vix": return "VIX Level";
      default: return "Value";
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Quick Alert Setup
          </SheetTitle>
          <SheetDescription>
            Create custom alerts for market conditions and price movements.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Alert Templates */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Alert Templates</Label>
            <div className="grid gap-2">
              {alertTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{template.name}</div>
                          <div className="text-xs text-muted-foreground">{template.description}</div>
                        </div>
                        {selectedTemplate === template.id && (
                          <Badge variant="default" className="text-xs">Selected</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Alert Configuration */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Alert Configuration</Label>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="alertName">Alert Name</Label>
                <Input
                  id="alertName"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter alert name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Symbol</Label>
                  <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert(prev => ({ ...prev, symbol: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {symbols.map(symbol => (
                        <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Alert Type</Label>
                  <Select value={newAlert.type} onValueChange={(value) => setNewAlert(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                      <SelectItem value="rsi">RSI</SelectItem>
                      <SelectItem value="vix">VIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={newAlert.condition} onValueChange={(value) => setNewAlert(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getConditionOptions(newAlert.type).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{getValueLabel(newAlert.type)}</Label>
                  <Input
                    value={newAlert.value}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Enter value"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Notification Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="sound">Sound Alert</Label>
                    </div>
                    <Switch
                      id="sound"
                      checked={newAlert.soundEnabled}
                      onCheckedChange={(checked) => setNewAlert(prev => ({ ...prev, soundEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <Label htmlFor="email">Email Alert</Label>
                    </div>
                    <Switch
                      id="email"
                      checked={newAlert.emailEnabled}
                      onCheckedChange={(checked) => setNewAlert(prev => ({ ...prev, emailEnabled: checked }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={createAlert} className="flex-1">
              Create Alert
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};