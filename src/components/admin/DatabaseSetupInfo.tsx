
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle, XCircle, Database } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

interface TableStatus {
  name: string;
  exists: boolean;
  checked: boolean;
}

const DatabaseSetupInfo = () => {
  const [checking, setChecking] = useState(false);
  const [tables, setTables] = useState<TableStatus[]>([
    { name: 'branches', exists: false, checked: false },
    { name: 'classes', exists: false, checked: false },
    { name: 'class_bookings', exists: false, checked: false },
    { name: 'member_attendance', exists: false, checked: false },
  ]);

  const checkTablesExistence = async () => {
    setChecking(true);
    try {
      // Check which tables exist in the database
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      
      const existingTables = new Set(data.map(t => t.table_name));
      
      setTables(prev => prev.map(table => ({
        ...table,
        exists: existingTables.has(table.name),
        checked: true
      })));
      
      toast.success("Database tables checked successfully");
    } catch (error: any) {
      console.error("Error checking tables:", error);
      toast.error(error.message || "Failed to check database tables");
    } finally {
      setChecking(false);
    }
  };

  const missingTables = tables.filter(t => t.checked && !t.exists);
  const allTablesExist = tables.every(t => t.exists) && tables.every(t => t.checked);
  const someTablesChecked = tables.some(t => t.checked);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Setup Status
        </CardTitle>
        <CardDescription>
          Verify that all required database tables exist in your Supabase project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {someTablesChecked && (
            <Alert variant={allTablesExist ? "default" : "destructive"}>
              <div className="flex gap-2 items-start">
                {allTablesExist ? <CheckCircle className="h-5 w-5 mt-0.5" /> : <Info className="h-5 w-5 mt-0.5" />}
                <div>
                  <AlertTitle>
                    {allTablesExist 
                      ? "All required tables exist"
                      : "Missing database tables detected"}
                  </AlertTitle>
                  <AlertDescription>
                    {allTablesExist 
                      ? "Your database has all the required tables for the application to function correctly."
                      : "Some required database tables are missing. Please run the SQL setup script in your Supabase project."}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-2">
            {tables.map(table => (
              <div key={table.name} className="flex items-center justify-between border p-2 rounded">
                <span>{table.name}</span>
                {table.checked ? (
                  <Badge variant={table.exists ? "default" : "destructive"}>
                    {table.exists ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Exists
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <XCircle className="h-3 w-3 mr-1" />
                        Missing
                      </span>
                    )}
                  </Badge>
                ) : (
                  <Badge variant="outline">Not Checked</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={checkTablesExistence} disabled={checking}>
            {checking ? "Checking..." : "Check Database Tables"}
          </Button>
        </div>

        {missingTables.length > 0 && (
          <Alert>
            <AlertTitle>SQL Setup Required</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                Please run the SQL setup script in the Supabase SQL Editor to create the missing tables:
              </p>
              <ul className="list-disc pl-5">
                {missingTables.map(table => (
                  <li key={table.name}>{table.name}</li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                The SQL setup script can be found in the data/required_tables.sql file in the codebase.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseSetupInfo;
