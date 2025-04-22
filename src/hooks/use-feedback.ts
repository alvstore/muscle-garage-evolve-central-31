import { useQuery } from '@tanstack/react-query';
import { Feedback } from '@/types/notification';

export const useFeedback = (branchId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['feedbacks', branchId, userId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockFeedbacks;
    }
  });
};

// Mock data moved from FeedbackPage
const mockFeedbacks: Feedback[] = [
  {
    id: "feedback1",
    memberId: "member1",
    memberName: "David Miller",
    type: "class",
    relatedId: "class1",
    rating: 4,
    comments: "Great class, but the room was a bit crowded.",
    createdAt: "2023-06-15T10:30:00Z",
    anonymous: false,
    title: "HIIT Class Review"
  },
  {
    id: "feedback2",
    memberId: "member2",
    memberName: "Sarah Parker",
    type: "trainer",
    relatedId: "trainer1",
    rating: 5,
    comments: "Excellent trainer, very motivating!",
    createdAt: "2023-06-16T14:20:00Z",
    anonymous: false,
    title: "Trainer Review"
  },
  {
    id: "feedback3",
    memberId: "member3",
    type: "fitness-plan",
    relatedId: "plan1",
    rating: 3,
    comments: "Plan is good but too challenging for beginners.",
    createdAt: "2023-06-17T09:15:00Z",
    anonymous: true,
    title: "Fitness Plan Feedback"
  },
  {
    id: "feedback4",
    memberId: "member4",
    memberName: "Emily Davidson",
    type: "general",
    rating: 2,
    comments: "The gym needs better ventilation.",
    createdAt: "2023-06-18T16:45:00Z",
    anonymous: false,
    title: "Facility Feedback"
  },
  {
    id: "feedback5",
    memberId: "member5",
    memberName: "Michael Wong",
    type: "class",
    relatedId: "class2",
    rating: 5,
    comments: "Best HIIT class I've ever taken!",
    createdAt: "2023-06-19T11:30:00Z",
    anonymous: false,
    title: "Yoga Class Review"
  }
];
