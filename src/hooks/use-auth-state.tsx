// ... existing code ...
const fetchUserProfile = async (userId: string) => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load your profile', {
        description: 'Please try refreshing the page',
        action: {
          label: 'Retry',
          onClick: () => fetchUserProfile(userId)
        }
      });
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Profile fetch exception:', error);
    toast.error('Unexpected error loading profile');
    return null;
  } finally {
    setIsLoading(false);
  }
};
// ... existing code ...