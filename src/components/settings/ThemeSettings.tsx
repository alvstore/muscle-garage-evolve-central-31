
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/providers/ThemeProvider";
import { Sun, Moon, MonitorSmartphone } from "lucide-react";

interface ColorOption {
  name: string;
  value: string;
  bg: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
  { name: 'Red', value: 'red', bg: 'bg-red-500' },
  { name: 'Teal', value: 'teal', bg: 'bg-teal-500' },
];

const ThemeSettings = () => {
  const { mode, primaryColor, setMode, setPrimaryColor } = useTheme();

  const handleModeChange = (value: string) => {
    setMode(value as any);
  };

  const handleColorChange = (value: string) => {
    setPrimaryColor(value as any);
  };

  return (
    <Card className="transition-all">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Customize the appearance of the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Mode</h3>
          
          <RadioGroup
            value={mode}
            onValueChange={handleModeChange}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                id="light"
                value="light"
                className="peer sr-only"
              />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-slate-100 hover:text-slate-900 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Sun className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Light</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem
                id="dark"
                value="dark"
                className="peer sr-only"
              />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-zinc-950 p-4 text-white hover:bg-zinc-900 hover:text-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Moon className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Dark</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem
                id="semi-dark"
                value="semi-dark"
                className="peer sr-only"
              />
              <Label
                htmlFor="semi-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-slate-100 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="mb-3 h-6 w-12 rounded-md overflow-hidden flex">
                  <div className="w-1/2 h-6 bg-zinc-950"></div>
                  <div className="w-1/2 h-6 bg-white border-l border-gray-300"></div>
                </div>
                <span className="text-sm font-medium">Semi Dark</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Primary Color</h3>
          
          <RadioGroup
            value={primaryColor}
            onValueChange={handleColorChange}
            className="grid grid-cols-2 sm:grid-cols-5 gap-4"
          >
            {colorOptions.map((color) => (
              <div key={color.value}>
                <RadioGroupItem
                  id={color.value}
                  value={color.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={color.value}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-slate-100 hover:text-slate-900 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className={`mb-3 h-6 w-6 rounded-full ${color.bg}`}></div>
                  <span className="text-sm font-medium">{color.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
