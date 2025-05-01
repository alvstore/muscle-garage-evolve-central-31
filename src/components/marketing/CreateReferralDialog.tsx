
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useReferrals } from '@/hooks/use-referrals';
import { useAuth } from '@/hooks/use-auth';
import { toast } from "@/utils/toast-manager";

const CreateReferralDialog = () => {
  const { createReferral } = useReferrals();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    referred_email: '',
    referred_name: '',
    promo_code: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
    e.preventDefault();
    
    if (!formData.referred_email) {
      toast.error('Email is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await createReferral({
        referrer_id: user?.id,
        referrer_name: user?.name || 'Unknown',
        referred_email: formData.referred_email,
        referred_name: formData.referred_name || undefined,
        promo_code: formData.promo_code || undefined,
        status: 'pending'
      });
      
      setFormData({
        referred_email: '',
        referred_name: '',
        promo_code: ''
      });
      
      onClose();
    } catch (err) {
      console.error('Failed to create referral:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Create Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Referral</DialogTitle>
          <DialogDescription>
            Send a referral invitation to a friend or potential member.
          </DialogDescription>
        </DialogHeader>
        
        <DialogClose>
          {(onClose) => (
            <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="referred_email">Email Address*</Label>
                <Input
                  id="referred_email"
                  name="referred_email"
                  type="email"
                  placeholder="friend@example.com"
                  value={formData.referred_email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="referred_name">Friend's Name</Label>
                <Input
                  id="referred_name"
                  name="referred_name"
                  placeholder="John Smith"
                  value={formData.referred_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="promo_code">Promo Code (Optional)</Label>
                <Input
                  id="promo_code"
                  name="promo_code"
                  placeholder="REFER10"
                  value={formData.promo_code}
                  onChange={handleInputChange}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onClose()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.referred_email}
                >
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReferralDialog;
