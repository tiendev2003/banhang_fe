import { createContext, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { clearCartNew } from "../features/cart/cartSlice";
import { AppDispatch } from "../store";
import { AuthResponse, LoginCredentials, PasswordData, User, UserResponse } from "../types";
import { uploadImage } from "../utils/uploadImage";

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  userInformation: User | null;
  updateUserInformation: (updatedInfo: Partial<User>) => Promise<void>;
  changePassword: (passwordData: PasswordData) => Promise<any>;
  changeAvatar: (formData: FormData) => Promise<any>;
  sideMenuOpen: boolean;
  setSideMenuOpen: (value: boolean) => void;
  toggleSideMenu: () => void;
  scrollDirection: string;
  setScrollDirection: (value: string) => void;
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;

}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userInformation, setUserInformation] = useState<User | null>(null);
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get<UserResponse>("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setUserInformation(response.data.data);
          setIsAuthenticated(true);
          setUserRole(response.data.data.role);
        })
        .catch((error) => {
          console.error("Get user info failed", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>(
        "/api/user/login",
        credentials
      );
      if (response.data.data) {
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.data.token);
        setUserRole(response.data.data.user.role); // Fixed: Set role instead of token
        setUserInformation(response.data.data.user);

        localStorage.setItem("token", response.data.data.token); // Store token
        if (response.data.data.user.role === "ADMIN" || response.data.data.user.role === "EMPLOYEE") {
          window.location.href = "/admin/brand";
        }
        if (response.data.data.user.role === "USER") {
          window.location.href = "/";
        }

      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      toast.error(error.response?.data?.message || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log("logout");
    setIsAuthenticated(false);
    localStorage.removeItem("token"); // Remove token
    setUserRole(null);
    setUserInformation(null);
    dispatch(clearCartNew())
    window.location.href = "/";

    toast.success("Đăng xuất thành công");
  };

  const updateUserInformation = async (updatedInfo: Partial<User>): Promise<void> => {
    try {
      const response = await api.put<UserResponse>(
        "/api/user/update",
        updatedInfo,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setUserInformation(
        (prevUserInformation) => ({
          ...prevUserInformation!,
          username: response.data.data.username,
          phone: response.data.data.phone,
          bio: response.data.data.bio,
        })
      );
    } catch (error: any) {
      console.error("Update failed", error);
      throw error;
    }
  };

  // change avatar 
  const changeAvatar = async (formData: FormData): Promise<any> => {
    try {
      const urlavatar = await uploadImage(formData);
       await api.put<User>(`/api/user/avatar`, {
        avatar: api.getUri() + urlavatar
      });

      setUserInformation((prevUserInformation) => ({
        ...prevUserInformation!,
        avatar: api.getUri() + urlavatar,
      }));
    } catch (error: any) {
      console.error("Change avatar failed", error);
      throw error;
    }
  };

  const changePassword = async (passwordData: PasswordData): Promise<any> => {
    try {
      const response = await api.put(
        "/api/user/change-password",
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Change password failed", error);
      throw error;
    }
  };
  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        login,
        logout,
        loading,
        userInformation,
        updateUserInformation,
        changePassword,
        changeAvatar,
        sideMenuOpen,
        setSideMenuOpen,
        toggleSideMenu,
        scrollDirection,
        setScrollDirection,
        showSidebar,
        setShowSidebar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

