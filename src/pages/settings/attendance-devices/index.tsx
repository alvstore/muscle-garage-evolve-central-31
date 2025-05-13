import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

const AttendanceDevicesRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to access control page
    router.push('/settings/access-control');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Redirecting to Access Control Settings...</p>
    </div>
  );
};

export default AttendanceDevicesRedirect;
