
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { DeviceMapping } from "@/types/device-mapping";

interface DeviceListProps {
  devices: DeviceMapping[];
  onEdit: (device: DeviceMapping) => void;
  onDelete: (deviceId: string) => void;
  onAdd: () => void;
}

export function DeviceList({ devices, onEdit, onDelete, onAdd }: DeviceListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Connected Devices</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No devices connected yet</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Device
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div>
                <h4 className="font-medium">{device.deviceName}</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-2">ID: {device.deviceId}</span>
                  <span>Type: {device.deviceType}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Location: {device.deviceLocation}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(device)}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(device.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
