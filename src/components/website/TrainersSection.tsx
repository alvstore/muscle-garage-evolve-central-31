import { useState, useEffect, useRef } from "react";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";
import { Instagram, Facebook } from "lucide-react";
const TrainersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  const trainers = [{
    name: "Rahul Sharma",
    role: "Head Strength Coach",
    experience: "10+ years experience",
    image: "/trainer-1.jpg",
    specializations: ["Bodybuilding", "Strength Training", "Powerlifting"],
    social: {
      instagram: "#",
      facebook: "#"
    }
  }, {
    name: "Priya Patel",
    role: "Yoga & Pilates Instructor",
    experience: "8+ years experience",
    image: "/trainer-2.jpg",
    specializations: ["Hatha Yoga", "Pilates", "Meditation"],
    social: {
      instagram: "#",
      facebook: "#"
    }
  }, {
    name: "Vikram Singh",
    role: "Functional Training Specialist",
    experience: "7+ years experience",
    image: "/trainer-3.jpg",
    specializations: ["HIIT", "Crossfit", "Mobility Training"],
    social: {
      instagram: "#",
      facebook: "#"
    }
  }, {
    name: "Anjali Kapoor",
    role: "Zumba & Dance Instructor",
    experience: "5+ years experience",
    image: "/trainer-4.jpg",
    specializations: ["Zumba", "Dance Fitness", "Aerobics"],
    social: {
      instagram: "#",
      facebook: "#"
    }
  }];
  const classes = [{
    type: "Zumba",
    schedule: [{
      day: "Monday",
      time: "6:30 AM - 7:30 AM",
      trainer: "Anjali Kapoor"
    }, {
      day: "Wednesday",
      time: "6:30 PM - 7:30 PM",
      trainer: "Anjali Kapoor"
    }, {
      day: "Saturday",
      time: "10:00 AM - 11:00 AM",
      trainer: "Anjali Kapoor"
    }]
  }, {
    type: "Yoga",
    schedule: [{
      day: "Tuesday",
      time: "7:00 AM - 8:00 AM",
      trainer: "Priya Patel"
    }, {
      day: "Thursday",
      time: "7:00 AM - 8:00 AM",
      trainer: "Priya Patel"
    }, {
      day: "Sunday",
      time: "9:00 AM - 10:00 AM",
      trainer: "Priya Patel"
    }]
  }, {
    type: "HIIT",
    schedule: [{
      day: "Monday",
      time: "7:00 PM - 8:00 PM",
      trainer: "Vikram Singh"
    }, {
      day: "Thursday",
      time: "7:00 PM - 8:00 PM",
      trainer: "Vikram Singh"
    }, {
      day: "Saturday",
      time: "8:00 AM - 9:00 AM",
      trainer: "Vikram Singh"
    }]
  }, {
    type: "Strength",
    schedule: [{
      day: "Tuesday",
      time: "6:00 PM - 7:00 PM",
      trainer: "Rahul Sharma"
    }, {
      day: "Friday",
      time: "6:00 PM - 7:00 PM",
      trainer: "Rahul Sharma"
    }, {
      day: "Sunday",
      time: "5:00 PM - 6:00 PM",
      trainer: "Rahul Sharma"
    }]
  }];
  return <section id="trainers" ref={sectionRef} className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className={`text-center max-w-3xl mx-auto mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-impact mb-4 text-white">
            OUR <span className="text-gym-yellow">EXPERT TRAINERS</span>
          </h2>
          <p className="text-gray-300">
            Meet our team of certified fitness professionals dedicated to helping you achieve your goals.
          </p>
        </div>

        {/* Trainers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {trainers.map((trainer, index) => <div key={trainer.name} className={`bg-gym-gray-800 rounded-lg overflow-hidden group transition-all duration-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{
          animationDelay: `${index * 0.15}s`
        }}>
              <div className="relative overflow-hidden h-64">
                <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gym-black to-transparent p-4">
                  <div className="flex gap-2">
                    <a href={trainer.social.instagram} className="bg-gym-yellow text-gym-black p-2 rounded-full hover:bg-white transition-colors">
                      <Instagram size={18} />
                    </a>
                    <a href={trainer.social.facebook} className="bg-gym-yellow text-gym-black p-2 rounded-full hover:bg-white transition-colors">
                      <Facebook size={18} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
                <p className="text-gym-yellow">{trainer.role}</p>
                <p className="text-gray-400 text-sm my-2">{trainer.experience}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {trainer.specializations.map(spec => <span key={spec} className="text-xs bg-gym-gray-700 px-2 py-1 rounded-md text-white">
                      {spec}
                    </span>)}
                </div>
              </div>
            </div>)}
        </div>

        {/* Classes Schedule */}
        <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{
        animationDelay: '0.6s'
      }}>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl md:text-5xl font-impact mb-4 text-white">
              CLASS <span className="text-gym-yellow">SCHEDULE</span>
            </h2>
            <p className="text-gray-300 mb-8">
              Join our specialized classes led by expert trainers to enhance your fitness journey.
            </p>
          </div>

          <Tabs defaultValue="Zumba">
            <TabsList className="mb-8 w-full flex overflow-x-auto">
              {classes.map(classType => <TabsTrigger key={classType.type} value={classType.type} className="flex-1 data-[state=active]:bg-gym-yellow data-[state=active]:text-gym-black">
                  {classType.type}
                </TabsTrigger>)}
            </TabsList>
            
            {classes.map(classType => <TabsContent key={classType.type} value={classType.type}>
                <div className="bg-gym-gray-800 rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-6 text-gym-yellow">{classType.type} Classes</h3>
                  <div className="space-y-4">
                    {classType.schedule.map((session, idx) => <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gym-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-bold text-white">{session.day}</h4>
                          <p className="text-gym-yellow">{session.time}</p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <p className="text-gray-300">Instructor: {session.trainer}</p>
                        </div>
                        <button className="mt-3 sm:mt-0 btn btn-outline text-sm py-2 px-4">
                          Book Class
                        </button>
                      </div>)}
                  </div>
                </div>
              </TabsContent>)}
          </Tabs>
        </div>
      </div>
    </section>;
};
export default TrainersSection;