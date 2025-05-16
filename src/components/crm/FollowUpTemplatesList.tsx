
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MoreVertical, Edit, Trash, Plus, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FollowUpTemplate } from '@/types';
import FollowUpTemplateForm from './FollowUpTemplateForm';
import { toast } from 'sonner';

interface FollowUpTemplatesListProps {
  templates: FollowUpTemplate[];
  isLoading?: boolean;
  onAddTemplate: (template: FollowUpTemplate) => Promise<void>;
  onUpdateTemplate: (template: FollowUpTemplate) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
}

export default function FollowUpTemplatesList({ 
  templates, 
  isLoading = false, 
  onAddTemplate, 
  onUpdateTemplate, 
  onDeleteTemplate 
}: FollowUpTemplatesListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FollowUpTemplate | null>(null);
  
  const handleAddTemplate = async (template: FollowUpTemplate) => {
    try {
      await onAddTemplate(template);
      setIsAddDialogOpen(false);
      toast.success('Template created successfully!');
    } catch (error) {
      toast.error('Failed to create template');
      console.error('Error adding template:', error);
    }
  };
  
  const handleUpdateTemplate = async (template: FollowUpTemplate) => {
    try {
      await onUpdateTemplate(template);
      setIsEditDialogOpen(false);
      setSelectedTemplate(null);
      toast.success('Template updated successfully!');
    } catch (error) {
      toast.error('Failed to update template');
      console.error('Error updating template:', error);
    }
  };
  
  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await onDeleteTemplate(id);
        toast.success('Template deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete template');
        console.error('Error deleting template:', error);
      }
    }
  };
  
  const handleEditClick = (template: FollowUpTemplate) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };
  
  const handleViewClick = (template: FollowUpTemplate) => {
    setSelectedTemplate(template);
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Follow-Up Templates</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Template
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No templates yet</h3>
              <p className="text-muted-foreground">Create your first follow-up template to get started</p>
              <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewClick(template)}>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(template)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Template Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <FollowUpTemplateForm 
            onSave={handleAddTemplate}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedTemplate && (
            <FollowUpTemplateForm 
              template={selectedTemplate}
              onSave={handleUpdateTemplate}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Template Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedTemplate && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p>{selectedTemplate.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Content</h3>
                <div className="mt-2 whitespace-pre-wrap border rounded-md p-4 bg-muted/30">
                  {selectedTemplate.content}
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
