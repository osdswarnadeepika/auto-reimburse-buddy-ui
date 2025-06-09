import { useState } from "react";
import { ArrowLeft, Building2, Loader2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  role: "employee" | "admin";
  onLogin: (userData: any) => void;
  onBack: () => void;
}

const LoginForm = ({ role, onLogin, onBack }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    primary: "",
    secondary: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock login data for Alice
    const mockUserData = {
      id: "EMP001",
      name: "Alice",
      email: "alice@example.com",
      department: "Engineering",
      remainingBudget: 5000
    };
    onLogin(mockUserData);
    
    setIsLoading(false);
  };

  const isEmployee = role === "employee";

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to role selection
      </Button>

      <Card className="border-2">
        <CardHeader className="text-center space-y-4">
          <div className={`w-12 h-12 ${isEmployee ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded-full flex items-center justify-center mx-auto`}>
            {isEmployee ? (
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            ) : (
              <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isEmployee ? "Employee Login" : "Admin Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                defaultValue="alice@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                defaultValue="password123"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>{isEmployee ? "Employee ID: EMP001, Password: password123" : "Email: alice@example.com, Password: password123"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
