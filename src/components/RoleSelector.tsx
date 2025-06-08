
import { Building2, User, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RoleSelectorProps {
  onRoleSelect: (role: "employee" | "admin") => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Zap className="h-8 w-8" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            AutoReimburse
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Smart reimbursement platform that automates expense processing between companies and employees
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold">Employee</h3>
            <p className="text-muted-foreground">
              Submit receipts, track reimbursements, and get instant approvals for work expenses
            </p>
            <Button 
              onClick={() => onRoleSelect("employee")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Continue as Employee
            </Button>
          </CardContent>
        </Card>

        <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold">Company Admin</h3>
            <p className="text-muted-foreground">
              Manage employee budgets, review expenses, and control reimbursement policies
            </p>
            <Button 
              onClick={() => onRoleSelect("admin")}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              Continue as Admin
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>New to AutoReimburse? This demo showcases the complete reimbursement experience.</p>
      </div>
    </div>
  );
};

export default RoleSelector;
