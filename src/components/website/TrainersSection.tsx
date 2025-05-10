
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from '@/utils/stringUtils';

const trainers = [
  {
    name: "Rahul Singh",
    specialty: "Strength Training",
    bio: "Certified personal trainer with 10+ years of experience in strength and conditioning. Specializes in powerlifting and bodybuilding preparation.",
    avatar: "",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com"
  },
  {
    name: "Priya Kapoor",
    specialty: "Yoga & Flexibility",
    bio: "Yoga instructor with expertise in Hatha, Vinyasa, and Restorative practices. Helps clients improve flexibility and mental wellbeing.",
    avatar: "",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com"
  },
  {
    name: "Ajay Patel",
    specialty: "Weight Loss",
    bio: "Nutrition specialist and personal trainer focusing on sustainable weight loss programs. Creator of the 'Transform in 60 Days' program.",
    avatar: "",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com"
  },
  {
    name: "Meera Sharma",
    specialty: "Functional Training",
    bio: "CrossFit Level 3 trainer specializing in functional movement and athletic performance. Former national-level athlete.",
    avatar: "",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com"
  }
];

const TrainersSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Expert Trainers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our certified fitness professionals will guide you through your fitness journey with personalized coaching and motivation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer, index) => (
            <Card key={index} className="h-full flex flex-col overflow-hidden">
              <div className="relative pt-[100%] bg-muted">
                <Avatar className="absolute inset-0 h-full w-full rounded-none">
                  <AvatarImage 
                    src={trainer.avatar} 
                    alt={trainer.name} 
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-none text-4xl">
                    {getInitials(trainer.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardHeader className="p-4 pb-0">
                <h3 className="text-xl font-bold">{trainer.name}</h3>
                <p className="text-primary font-medium">{trainer.specialty}</p>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <p className="text-gray-600">{trainer.bio}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-start gap-2">
                <Button size="icon" variant="outline" asChild>
                  <a href={trainer.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </Button>
                <Button size="icon" variant="outline" asChild>
                  <a href={trainer.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Facebook</span>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg">
            Book a Session
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;
