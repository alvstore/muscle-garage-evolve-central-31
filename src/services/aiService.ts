
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AIServiceType = 'openai' | 'gemini';

export interface AIServiceConfig {
  id?: string;
  service_name: AIServiceType;
  api_key: string;
  is_active: boolean;
}

export interface AIGenerationRequest {
  service: AIServiceType;
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface WorkoutPlanParams {
  title: string;
  description?: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  restrictions: string[];
  daysPerWeek: number;
  sessionDuration: number;
  isPublic: boolean;
}

export interface DietPlanParams {
  title: string;
  description?: string;
  dietType: 'vegetarian' | 'non-vegetarian' | 'vegan';
  cuisineType: string;
  caloriesPerDay: number;
  goals: string[];
  restrictions: string[];
  isPublic: boolean;
}

export const aiService = {
  // Check if user is admin
  async isUserAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !data) return false;
      return data.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  // Save or update AI service configuration
  async saveAIServiceConfig(serviceData: AIServiceConfig): Promise<AIServiceConfig | null> {
    try {
      // Check if user is admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        toast.error('Only administrators can configure AI services');
        return null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not authenticated');
        return null;
      }

      const { data, error } = await supabase
        .from('ai_services')
        .upsert(
          {
            ...serviceData,
            created_by: user.id,
          },
          { onConflict: 'service_name,created_by' }
        )
        .select()
        .single();

      if (error) {
        console.error('Error saving AI service config:', error);
        toast.error('Failed to save AI service configuration');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in saveAIServiceConfig:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Get AI service configuration
  async getAIServiceConfig(serviceName: AIServiceType): Promise<AIServiceConfig | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not authenticated');
        return null;
      }

      const { data, error } = await supabase
        .from('ai_services')
        .select('*')
        .eq('service_name', serviceName)
        .eq('created_by', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore no rows found
        console.error('Error getting AI service:', error);
        toast.error('Failed to retrieve AI service configuration');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAIServiceConfig:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Get active AI service configuration
  async getActiveAIService(): Promise<AIServiceConfig | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not authenticated');
        return null;
      }

      const { data, error } = await supabase
        .from('ai_services')
        .select('*')
        .eq('created_by', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore no rows found
        console.error('Error getting active AI service:', error);
        toast.error('Failed to retrieve active AI service');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getActiveAIService:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Generate content using the active AI service
  async generateContent(prompt: string, options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}): Promise<{ result: string } | null> {
    try {
      // Check if user is admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        toast.error('Only administrators can generate AI content');
        return null;
      }

      const activeService = await this.getActiveAIService();
      if (!activeService) {
        toast.error('No active AI service configured');
        return null;
      }

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: activeService.service_name,
          prompt,
          model: options.model,
          temperature: options.temperature,
          max_tokens: options.max_tokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate content');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content');
      return null;
    }
  },

  // Generate workout plan
  async generateWorkoutPlan(params: WorkoutPlanParams): Promise<string | null> {
    try {
      // Check if user is admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        toast.error('Only administrators can generate workout plans');
        return null;
      }

      const prompt = this.buildWorkoutPrompt(params);
      const result = await this.generateContent(prompt, {
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2000,
      });

      if (!result) return null;
      return result.result;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast.error('Failed to generate workout plan');
      return null;
    }
  },

  // Save workout plan to database
  async saveWorkoutPlan(params: WorkoutPlanParams, planContent: string): Promise<any> {
    try {
      // Check if user is admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        toast.error('Only administrators can save workout plans');
        return null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not authenticated');
        return null;
      }

      const { data, error } = await supabase
        .from('ai_workout_plans')
        .insert({
          title: params.title,
          description: params.description || '',
          fitness_level: params.fitnessLevel,
          goals: params.goals,
          restrictions: params.restrictions,
          days_per_week: params.daysPerWeek,
          session_duration: params.sessionDuration,
          plan_content: planContent,
          is_public: params.isPublic,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving workout plan:', error);
        toast.error('Failed to save workout plan');
        return null;
      }

      toast.success('Workout plan saved successfully');
      return data;
    } catch (error) {
      console.error('Error in saveWorkoutPlan:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Generate diet plan
  async generateDietPlan(params: DietPlanParams): Promise<string | null> {
    try {
      // Check if user is admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        toast.error('Only administrators can generate diet plans');
        return null;
      }

      const prompt = this.buildDietPrompt(params);
      const result = await this.generateContent(prompt, {
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 2000,
      });

      if (!result) return null;
      return result.result;
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast.error('Failed to generate diet plan');
      return null;
    }
  },

  // Save diet plan to database
  async saveDietPlan(params: DietPlanParams, planContent: string): Promise<any> {
    try {
      // Check if user is admin
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        toast.error('Only administrators can save diet plans');
        return null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not authenticated');
        return null;
      }

      const { data, error } = await supabase
        .from('ai_diet_plans')
        .insert({
          title: params.title,
          description: params.description || '',
          diet_type: params.dietType,
          cuisine_type: params.cuisineType,
          calories_per_day: params.caloriesPerDay,
          goals: params.goals,
          restrictions: params.restrictions,
          plan_content: planContent,
          is_public: params.isPublic,
          created_by: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving diet plan:', error);
        toast.error('Failed to save diet plan');
        return null;
      }

      toast.success('Diet plan saved successfully');
      return data;
    } catch (error) {
      console.error('Error in saveDietPlan:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  },

  // Get all public workout plans
  async getPublicWorkoutPlans(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_workout_plans')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public workout plans:', error);
        toast.error('Failed to fetch workout plans');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicWorkoutPlans:', error);
      toast.error('An unexpected error occurred');
      return [];
    }
  },

  // Get all public diet plans
  async getPublicDietPlans(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_diet_plans')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public diet plans:', error);
        toast.error('Failed to fetch diet plans');
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicDietPlans:', error);
      toast.error('An unexpected error occurred');
      return [];
    }
  },

  // Build workout plan prompt
  buildWorkoutPrompt(params: WorkoutPlanParams): string {
    return `Create a detailed ${params.fitnessLevel} workout plan with the following details:
    - Fitness Level: ${params.fitnessLevel}
    - Goals: ${params.goals.join(', ')}
    - Restrictions/Limitations: ${params.restrictions.join(', ') || 'None'}
    - Workout Days: ${params.daysPerWeek} days per week
    - Workout Duration: ${params.sessionDuration} minutes per session

    Please structure the plan as follows:
    1. Overview and introduction
    2. Weekly schedule with specific exercises for each day
    3. For each exercise include:
       - Number of sets and repetitions
       - Rest periods
       - Proper form instructions
    4. Warm-up routine
    5. Cool-down routine
    6. Progressive overload suggestions
    7. Tips for maintaining proper form

    Format the response in markdown for better readability.`;
  },

  // Build diet plan prompt
  buildDietPrompt(params: DietPlanParams): string {
    return `Create a detailed ${params.dietType} Indian diet plan with the following details:
    - Diet Type: ${params.dietType}
    - Cuisine: Indian
    - Calories per day: ${params.caloriesPerDay} calories
    - Goals: ${params.goals.join(', ')}
    - Dietary Restrictions: ${params.restrictions.join(', ') || 'None'}

    Please structure the plan as follows:
    1. Overview and introduction
    2. Daily meal schedule with specific recipes for:
       - Early morning (optional)
       - Breakfast
       - Mid-morning snack
       - Lunch
       - Evening snack
       - Dinner
    3. For each meal include:
       - Ingredients with quantities
       - Preparation method (brief)
       - Approximate calories
       - Macronutrient breakdown
    4. Weekly grocery shopping list
    5. Meal prep suggestions
    6. Hydration recommendations
    7. Tips for maintaining the diet

    Make sure all recipes are authentic Indian dishes that are ${params.dietType === 'vegetarian' ? 'vegetarian' : params.dietType === 'vegan' ? 'vegan' : 'non-vegetarian'}.
    Format the response in markdown for better readability.`;
  }
};

export default aiService;
