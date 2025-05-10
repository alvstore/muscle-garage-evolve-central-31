import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Image, Code, Eye } from "lucide-react";

interface EmailTemplateEditorProps {
  content: string;
  onChange: (content: string) => void;
  onPreview: () => void;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({ 
  content, 
  onChange,
  onPreview
}) => {
  const [activeTab, setActiveTab] = useState<string>('editor');
  
  const handleFormatAction = (action: string) => {
    // In a real implementation, this would insert formatting tags or apply formatting
    console.log(`Format action: ${action}`);
    
    // Example implementation for basic formatting
    let updatedContent = content;
    const selection = window.getSelection();
    
    if (selection && selection.toString().length > 0) {
      const selectedText = selection.toString();
      
      switch (action) {
        case 'bold':
          updatedContent = content.replace(selectedText, `<strong>${selectedText}</strong>`);
          break;
        case 'italic':
          updatedContent = content.replace(selectedText, `<em>${selectedText}</em>`);
          break;
        case 'underline':
          updatedContent = content.replace(selectedText, `<u>${selectedText}</u>`);
          break;
        case 'link':
          const url = prompt('Enter URL:', 'https://');
          if (url) {
            updatedContent = content.replace(selectedText, `<a href="${url}">${selectedText}</a>`);
          }
          break;
        default:
          break;
      }
      
      onChange(updatedContent);
    }
  };
  
  const insertVariable = (variable: string) => {
    const cursorPosition = (document.getElementById('template-editor') as HTMLTextAreaElement)?.selectionStart || 0;
    const textBefore = content.substring(0, cursorPosition);
    const textAfter = content.substring(cursorPosition);
    
    onChange(`${textBefore}{${variable}}${textAfter}`);
  };
  
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="px-4">
              <TabsList className="h-12 w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                <TabsTrigger
                  value="editor"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Editor
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  HTML
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="border-b bg-muted/20 p-2">
            <div className="flex flex-wrap items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => handleFormatAction('bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => handleFormatAction('italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => handleFormatAction('underline')}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-4 w-px bg-border"></span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignRight className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-4 w-px bg-border"></span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-4 w-px bg-border"></span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => handleFormatAction('link')}
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Image className="h-4 w-4" />
              </Button>
              <span className="mx-1 h-4 w-px bg-border"></span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Code className="h-4 w-4" />
              </Button>
              
              <div className="ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={onPreview}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>
          </div>
          
          <TabsContent value="editor" className="p-0 m-0">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div className="col-span-3">
                <textarea
                  id="template-editor"
                  className="w-full h-[400px] p-4 font-mono text-sm border-0 resize-none focus:outline-none focus:ring-0"
                  value={content}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Enter your email template content here..."
                />
              </div>
              <div className="border-l p-4">
                <h3 className="text-sm font-medium mb-3">Template Variables</h3>
                <div className="space-y-2">
                  <div className="text-xs">
                    <p className="font-medium mb-1">Member</p>
                    <div className="space-y-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('member_name')}
                      >
                        {'{member_name}'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('member_email')}
                      >
                        {'{member_email}'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('member_id')}
                      >
                        {'{member_id}'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs">
                    <p className="font-medium mb-1">Gym</p>
                    <div className="space-y-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('gym_name')}
                      >
                        {'{gym_name}'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('branch_name')}
                      >
                        {'{branch_name}'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('branch_address')}
                      >
                        {'{branch_address}'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs">
                    <p className="font-medium mb-1">Membership</p>
                    <div className="space-y-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('plan_name')}
                      >
                        {'{plan_name}'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('expiry_date')}
                      >
                        {'{expiry_date}'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs h-7"
                        onClick={() => insertVariable('invoice_link')}
                      >
                        {'{invoice_link}'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="p-0 m-0">
            <textarea
              className="w-full h-[400px] p-4 font-mono text-sm border-0 resize-none focus:outline-none focus:ring-0 bg-muted/10"
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter HTML code here..."
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailTemplateEditor;
