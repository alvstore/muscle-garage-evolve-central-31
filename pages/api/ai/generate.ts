import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import { AIGenerationRequest } from '@/services/aiService';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    return res.status(403).json({ message: 'Only administrators can generate AI content' });
  }

  const { service, prompt, model, temperature, max_tokens } = req.body as AIGenerationRequest;

  try {
    // Get the user's API key
    const { data: aiConfig, error: configError } = await supabase
      .from('ai_services')
      .select('*')
      .eq('service_name', service)
      .eq('created_by', user.id)
      .eq('is_active', true)
      .single();

    if (configError || !aiConfig) {
      return res.status(400).json({ message: 'AI service not configured or not active' });
    }

    let result;
    if (service === 'openai') {
      const openai = new OpenAI({
        apiKey: aiConfig.api_key,
      });

      const completion = await openai.chat.completions.create({
        model: model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates workout and meal plans. Format your response in markdown for better readability.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 2000,
      });

      result = completion.choices[0]?.message?.content;
    } else if (service === 'gemini') {
      const genAI = new GoogleGenerativeAI(aiConfig.api_key);
      const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const generationConfig = {
        temperature: temperature || 0.7,
        maxOutputTokens: max_tokens || 2000,
      };

      const chat = geminiModel.startChat({
        generationConfig,
        history: [
          {
            role: 'user',
            parts: [{ text: 'You are a helpful assistant that generates workout and meal plans. Format your response in markdown for better readability.' }],
          },
        ],
      });

      const response = await chat.sendMessage(prompt);
      result = response.response.text();
    } else {
      return res.status(400).json({ message: 'Unsupported AI service' });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ message: 'Failed to generate content', error: error.message });
  }
}
