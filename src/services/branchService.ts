
import { supabase } from "@/integrations/supabase/client";
import { Branch } from "@/hooks/use-branches";

export const branchService = {
  getBranches: async (): Promise<Branch[]> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');

      if (error) throw error;

      return data.map(branch => ({
        id: branch.id,
        name: branch.name,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        zipCode: branch.zip_code,
        country: branch.country,
        phone: branch.phone,
        email: branch.email,
        website: branch.website,
        logo: branch.logo,
        timezone: branch.timezone,
        currency: branch.currency,
        language: branch.language,
        createdAt: branch.created_at,
        updatedAt: branch.updated_at,
        is_active: branch.is_active,
        is_default: branch.is_default,
      }));
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  },

  createBranch: async (branch: Omit<Branch, 'id'>): Promise<Branch> => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert({
          name: branch.name,
          address: branch.address,
          city: branch.city,
          state: branch.state,
          zip_code: branch.zipCode,
          country: branch.country,
          phone: branch.phone,
          email: branch.email,
          website: branch.website,
          logo: branch.logo,
          timezone: branch.timezone,
          currency: branch.currency,
          language: branch.language,
          is_active: branch.is_active !== undefined ? branch.is_active : true,
          is_default: branch.is_default !== undefined ? branch.is_default : false,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        country: data.country,
        phone: data.phone,
        email: data.email,
        website: data.website,
        logo: data.logo,
        timezone: data.timezone,
        currency: data.currency,
        language: data.language,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        is_active: data.is_active,
        is_default: data.is_default,
      };
    } catch (error) {
      console.error("Error creating branch:", error);
      throw error;
    }
  },

  updateBranch: async (branchId: string, updates: Partial<Branch>): Promise<Branch> => {
    try {
      // Convert from camelCase to snake_case for the database
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.address) dbUpdates.address = updates.address;
      if (updates.city) dbUpdates.city = updates.city;
      if (updates.state) dbUpdates.state = updates.state;
      if (updates.zipCode) dbUpdates.zip_code = updates.zipCode;
      if (updates.country) dbUpdates.country = updates.country;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.website) dbUpdates.website = updates.website;
      if (updates.logo) dbUpdates.logo = updates.logo;
      if (updates.timezone) dbUpdates.timezone = updates.timezone;
      if (updates.currency) dbUpdates.currency = updates.currency;
      if (updates.language) dbUpdates.language = updates.language;
      if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;
      if (updates.is_default !== undefined) dbUpdates.is_default = updates.is_default;

      const { data, error } = await supabase
        .from('branches')
        .update(dbUpdates)
        .eq('id', branchId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        country: data.country,
        phone: data.phone,
        email: data.email,
        website: data.website,
        logo: data.logo,
        timezone: data.timezone,
        currency: data.currency,
        language: data.language,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        is_active: data.is_active,
        is_default: data.is_default,
      };
    } catch (error) {
      console.error("Error updating branch:", error);
      throw error;
    }
  },

  deleteBranch: async (branchId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting branch:", error);
      throw error;
    }
  },
};
