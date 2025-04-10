
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DumbbellIcon, UserCircle, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <main className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Muscle Garage Evolve
              </h1>
              <p className="text-xl mb-8">
                Complete gym management system for fitness centers, trainers, and members
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                  <Link to="/login">
                    Login to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                  <a href="#features">
                    Explore Features
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div id="features" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Features for Modern Gyms
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={UserCircle}
                title="Member Management"
                description="Track member profiles, attendance, payments, and fitness progress in one place"
              />
              <FeatureCard 
                icon={DumbbellIcon}
                title="Fitness Plans"
                description="Create and assign personalized workout and nutrition plans"
              />
              <FeatureCard 
                icon={() => <ClockIcon />}
                title="Class Scheduling"
                description="Manage classes, trainers, and member bookings with ease"
              />
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to evolve your gym management?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of fitness centers using Muscle Garage Evolve to streamline operations and enhance member experience.
            </p>
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <Link to="/login">
                Get Started Today
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Muscle Garage Evolve</h3>
              <p className="text-sm">© 2025 All Rights Reserved</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Clock icon component
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default Index;
