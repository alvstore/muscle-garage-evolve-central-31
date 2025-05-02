import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from 'lucide-react';

const WebsiteAnalytics: React.FC = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Analytics</CardTitle>
          <CardDescription>Monitor your website's performance and visitor statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
              <TabsTrigger value="behavior">User Behavior</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,248</div>
                    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3,842</div>
                    <p className="text-xs text-muted-foreground">+8.2% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2m 45s</div>
                    <p className="text-xs text-muted-foreground">+0.8% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-md font-medium">Visitor Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <LineChart size={48} />
                    <p>Visitor trend chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="traffic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md font-medium">Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <PieChart size={48} />
                      <p>Traffic sources chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md font-medium">Referral Websites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Google</span>
                        <span className="font-medium">42%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Direct</span>
                        <span className="font-medium">28%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Facebook</span>
                        <span className="font-medium">15%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Instagram</span>
                        <span className="font-medium">10%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Others</span>
                        <span className="font-medium">5%</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md font-medium">Popular Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Home Page</span>
                      <span className="font-medium">1,245 views</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Membership Plans</span>
                      <span className="font-medium">856 views</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Trainers</span>
                      <span className="font-medium">642 views</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Classes</span>
                      <span className="font-medium">524 views</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Contact</span>
                      <span className="font-medium">318 views</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-md font-medium">User Engagement</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BarChart size={48} />
                    <p>User engagement chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteAnalytics;