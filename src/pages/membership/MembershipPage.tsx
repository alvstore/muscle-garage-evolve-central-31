
import React from 'react';
import { Container } from '@/components/ui/container';
import MembershipPlans from '@/components/membership/MembershipPlans';
import MembershipPlansDisplay from '@/components/membership/MembershipPlansDisplay';
import { usePermissions } from '@/hooks/auth/use-permissions';

const MembershipPage = () => {
  const { userRole } = usePermissions();
  const isMember = userRole === 'member';

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isMember ? 'My Membership' : 'Membership Plans'}
        </h1>
        
        {isMember ? (
          <MembershipPlansDisplay />
        ) : (
          <MembershipPlans />
        )}
      </div>
    </Container>
  );
};

export default MembershipPage;
