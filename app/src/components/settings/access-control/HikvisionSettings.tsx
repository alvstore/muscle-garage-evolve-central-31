// ... existing code ...
const handleTestConnection = async () => {
  if (!branchId) return;
  
  try {
    setTestingConnection(true);
    setTestResult(null);
    
    // Clean the API URL to remove any spaces and ensure it's properly formatted
    const cleanApiUrl = apiUrl.trim();
    const baseUrl = cleanApiUrl.endsWith('/') ? cleanApiUrl.slice(0, -1) : cleanApiUrl;
    
    console.log('Testing connection with Hikvision API');
    
    // Use the correct Supabase Edge Function URL
    // Replace this:
    // const response = await axios.post('/api/proxy/hikvision/token', {
    // With this:
    const response = await axios.post('https://YOUR_SUPABASE_PROJECT_ID.supabase.co/functions/v1/hikvision-proxy', {
      action: 'token',  // Make sure to include the action parameter
      apiUrl: baseUrl,
      appKey,
      secretKey: appSecret || (settings?.app_secret || '')
    });
    
    console.log('Hikvision API response:', response.data);
    
    // ... existing code ...
// ... existing code ...