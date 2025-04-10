
import { Container } from "@/components/ui/container";
import MembershipPlans from "@/components/membership/MembershipPlans";

const MembershipPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Membership Plans</h1>
        <MembershipPlans />
      </div>
    </Container>
  );
};

export default MembershipPage;
