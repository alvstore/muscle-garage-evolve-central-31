import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Announcement } from "@/types";

const MemberDashboard = () => {
  const mockAnnouncements = true;

  const getAnnouncements = (): Announcement[] => {
    return mockAnnouncements ? [
      {
        id: '1',
        title: 'New Fitness Classes Added!',
        content: 'Check out our new yoga and pilates classes starting next week.',
        priority: 'medium',
        created_at: '2023-06-01T10:00:00Z',
        expires_at: '2023-07-01T10:00:00Z',
        author_name: 'Fitness Manager'
      },
      {
        id: '2',
        title: 'Holiday Hours',
        content: 'The gym will have special holiday hours next week. Please check the schedule.',
        priority: 'high',
        created_at: '2023-05-28T10:00:00Z',
        expires_at: '2023-06-15T10:00:00Z',
        author_name: 'Administration'
      }
    ] : [];
  }

  const announcements = getAnnouncements();

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Member Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back!</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View your profile, check class schedules, and more.</p>
            </CardContent>
          </Card>

          {/* Announcements Card */}
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length > 0 ? (
                <ul>
                  {announcements.map(announcement => (
                    <li key={announcement.id} className="mb-4">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm">{announcement.content}</p>
                      <p className="text-xs text-gray-500">
                        Posted by {announcement.author_name} on {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No announcements at this time.</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li><a href="#" className="text-blue-500">Book a Class</a></li>
                <li><a href="#" className="text-blue-500">Update Profile</a></li>
                <li><a href="#" className="text-blue-500">View Membership</a></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default MemberDashboard;
