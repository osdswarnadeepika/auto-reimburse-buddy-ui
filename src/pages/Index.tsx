
import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

type UserRole = "employee" | "admin" | null;
type AppState = "role-selection" | "login" | "dashboard";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("role-selection");
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentState("login");
  };

  const handleLogin = (data: any) => {
    setUserData(data);
    setIsAuthenticated(true);
    setCurrentState("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setSelectedRole(null);
    setCurrentState("role-selection");
  };

  const handleBack = () => {
    if (currentState === "login") {
      setCurrentState("role-selection");
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {currentState === "role-selection" && (
            <RoleSelector onRoleSelect={handleRoleSelect} />
          )}
          
          {currentState === "login" && selectedRole && (
            <LoginForm 
              role={selectedRole} 
              onLogin={handleLogin}
              onBack={handleBack}
            />
          )}
          
          {currentState === "dashboard" && selectedRole === "employee" && (
            <EmployeeDashboard 
              userData={userData}
              onLogout={handleLogout}
            />
          )}
          
          {currentState === "dashboard" && selectedRole === "admin" && (
            <AdminDashboard 
              userData={userData}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
