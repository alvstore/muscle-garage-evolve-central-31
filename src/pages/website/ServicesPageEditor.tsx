
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";

// Sample initial data
const initialData = {
  pageTitle: "Our Services & Pricing",
  introText: "Discover the perfect fitness plan to meet your goals with our range of services and membership options.",
  plans: [
    {
      id: "1",
      title: "Basic Membership",
      price: "1999",
      duration: "monthly",
      description: "Perfect for beginners looking to start their fitness journey.",
      features: ["Access to gym equipment", "Basic fitness assessment", "2 group classes per month"],
      iconType: "star"
    },
    {
      id: "2",
      title: "Premium Membership",
      price: "3499",
      duration: "monthly",
      description: "For fitness enthusiasts who want more personalized attention.",
      features: ["Full access to gym", "Unlimited group classes", "Monthly fitness assessment", "1 PT session per month"],
      iconType: "crown"
    },
    {
      id: "3",
      title: "Elite Membership",
      price: "4999",
      duration: "monthly",
      description: "The ultimate fitness experience with maximum support and guidance.",
      features: ["24/7 gym access", "Unlimited group classes", "Weekly fitness assessment", "4 PT sessions per month", "Nutrition consultation"],
      iconType: "diamond"
    }
  ],
  faqs: [
    {
      id: "1",
      question: "How do I get started with a membership?",
      answer: "You can sign up for a membership directly at our gym location or through our website. We recommend scheduling an orientation session to help you get familiar with our facilities and equipment."
    },
    {
      id: "2",
      question: "Can I freeze my membership?",
      answer: "Yes, you can freeze your membership for up to 3 months in a year. A small administrative fee may apply. Please contact our membership team for more details."
    },
    {
      id: "3",
      question: "Do you offer personal training?",
      answer: "Yes, we offer personal training sessions with our certified trainers. You can book individual sessions or purchase packages for better rates."
    }
  ]
};

const ServicesPageEditor = () => {
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePlanChange = (id: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      plans: prev.plans.map(plan => 
        plan.id === id ? { ...plan, [field]: value } : plan
      )
    }));
  };
  
  const handlePlanFeatureChange = (planId: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      plans: prev.plans.map(plan => {
        if (plan.id === planId) {
          const features = [...plan.features];
          features[index] = value;
          return { ...plan, features };
        }
        return plan;
      })
    }));
  };
  
  const handleAddPlanFeature = (planId: string) => {
    setFormData((prev) => ({
      ...prev,
      plans: prev.plans.map(plan => {
        if (plan.id === planId) {
          return { ...plan, features: [...plan.features, "New feature"] };
        }
        return plan;
      })
    }));
  };
  
  const handleRemovePlanFeature = (planId: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      plans: prev.plans.map(plan => {
        if (plan.id === planId) {
          const features = [...plan.features];
          features.splice(index, 1);
          return { ...plan, features };
        }
        return plan;
      })
    }));
  };
  
  const handleFaqChange = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map(faq => 
        faq.id === id ? { ...faq, [field]: value } : faq
      )
    }));
  };
  
  const handleAddFaq = () => {
    const newId = String(formData.faqs.length + 1);
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          id: newId,
          question: "New Question",
          answer: "Answer to the new question"
        }
      ]
    }));
  };
  
  const handleRemoveFaq = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter(faq => faq.id !== id)
    }));
  };
  
  const handleAddPlan = () => {
    const newId = String(formData.plans.length + 1);
    setFormData((prev) => ({
      ...prev,
      plans: [
        ...prev.plans,
        {
          id: newId,
          title: "New Plan",
          price: "0",
          duration: "monthly",
          description: "Description for the new plan",
          features: ["Feature 1"],
          iconType: "star"
        }
      ]
    }));
  };
  
  const handleRemovePlan = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      plans: prev.plans.filter(plan => plan.id !== id)
    }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save data
    setTimeout(() => {
      toast.success("Services and pricing content saved successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle>Services & Pricing Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pageTitle">Page Title</Label>
            <Input
              id="pageTitle"
              name="pageTitle"
              value={formData.pageTitle}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="introText">Introduction Text</Label>
            <Textarea
              id="introText"
              name="introText"
              value={formData.introText}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Membership Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.plans.map((plan, planIndex) => (
            <div key={plan.id} className="space-y-4">
              {planIndex > 0 && <Separator className="my-4" />}
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Plan {planIndex + 1}</h3>
                {formData.plans.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRemovePlan(plan.id)}
                  >
                    Remove Plan
                  </Button>
                )}
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`plan-${plan.id}-title`}>Plan Title</Label>
                  <Input
                    id={`plan-${plan.id}-title`}
                    value={plan.title}
                    onChange={(e) => handlePlanChange(plan.id, 'title', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`plan-${plan.id}-price`}>Price</Label>
                    <Input
                      id={`plan-${plan.id}-price`}
                      value={plan.price}
                      onChange={(e) => handlePlanChange(plan.id, 'price', e.target.value)}
                      type="number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`plan-${plan.id}-duration`}>Duration</Label>
                    <select
                      id={`plan-${plan.id}-duration`}
                      value={plan.duration}
                      onChange={(e) => handlePlanChange(plan.id, 'duration', e.target.value)}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                      <option value="onetime">One Time</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`plan-${plan.id}-description`}>Description</Label>
                <Textarea
                  id={`plan-${plan.id}-description`}
                  value={plan.description}
                  onChange={(e) => handlePlanChange(plan.id, 'description', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Features</Label>
                <div className="space-y-2 mt-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handlePlanFeatureChange(plan.id, featureIndex, e.target.value)}
                        placeholder="Feature detail"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleRemovePlanFeature(plan.id, featureIndex)}
                        disabled={plan.features.length <= 1}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddPlanFeature(plan.id)}
                  >
                    Add Feature
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`plan-${plan.id}-icon`}>Icon Type</Label>
                <select
                  id={`plan-${plan.id}-icon`}
                  value={plan.iconType}
                  onChange={(e) => handlePlanChange(plan.id, 'iconType', e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="star">Star</option>
                  <option value="crown">Crown</option>
                  <option value="diamond">Diamond</option>
                  <option value="trophy">Trophy</option>
                  <option value="medal">Medal</option>
                </select>
              </div>
            </div>
          ))}
          
          <Button variant="outline" onClick={handleAddPlan}>
            Add New Plan
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.faqs.map((faq, faqIndex) => (
            <div key={faq.id} className="space-y-4">
              {faqIndex > 0 && <Separator className="my-4" />}
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">FAQ {faqIndex + 1}</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRemoveFaq(faq.id)}
                >
                  Remove FAQ
                </Button>
              </div>
              
              <div>
                <Label htmlFor={`faq-${faq.id}-question`}>Question</Label>
                <Input
                  id={`faq-${faq.id}-question`}
                  value={faq.question}
                  onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`faq-${faq.id}-answer`}>Answer</Label>
                <Textarea
                  id={`faq-${faq.id}-answer`}
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <Button variant="outline" onClick={handleAddFaq}>
            Add New FAQ
          </Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default ServicesPageEditor;
