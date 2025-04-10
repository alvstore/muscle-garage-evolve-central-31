
import { createContext, useContext, useState } from "react";
import { User } from "@/types";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {
    throw new Error("Not implemented");
  },
  logout: async () => {
    throw new Error("Not implemented");
  },
});

export const useAuth = () => {
  return useContext(AuthContext);
};

// This is a mock implementation for development
export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>({
    id: "user1",
    email: "member@example.com",
    name: "John Member",
    role: "member",
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    // Mock login logic
    const mockUser: User = {
      id: "user1",
      email: email,
      name: "John Member",
      role: "member",
    };
    
    setUser(mockUser);
    setIsLoading(false);
    return mockUser;
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setUser(null);
    setIsLoading(false);
  };

  return {
    user,
    isLoading,
    login,
    logout,
  };
};
