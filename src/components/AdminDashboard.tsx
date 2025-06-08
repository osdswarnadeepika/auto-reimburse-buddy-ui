
import { useState } from "react";
import { LogOut, Users, DollarSign, TrendingUp, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FundAllocator from "@/components/FundAllocator";

interface AdminDashboardProps {
  userData: any;
  onLogout: () => void;
}

const AdminDashboard = ({ userData, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "allocate" | "requests">("overview");

  const mockEmployees = [
    { id: "EMP001", name: "John Doe", department: "Engineering", allocated: 3000, spent: 500, remaining: 2500 },
    { id: "EMP002", name: "Jane Smith", department: "Marketing", allocated: 2500, spent: 1200, remaining: 1300 },
    { id: "EMP003", name: "Mike Johnson", department: "Sales", allocated: 4000, spent: 3200, remaining: 800 },
    { id: "EMP004", name: "Sarah Wilson", department: "HR", allocated: 1500, spent: 300, remaining: 1200 },
  ];

  const mockRequests = [
    { id: 1, employee: "John Doe", description: "Client dinner", amount: 89, status: "pending", date: "2024-06-03" },
    { id: 2, employee: "Jane Smith", description: "Conference tickets", amount: 599, status: "pending", date: "2024-06-02" },
    { id: 3, employee: "Mike Johnson", description: "Hotel stay", amount: 245, status: "flagged", date: "2024-06-01" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "flagged": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const totalAllocated = mockEmployees.reduce((sum, emp) => sum + emp.allocated, 0);
  const totalSpent = mockEmployees.reduce((sum, emp) => sum + emp.spent, 0);
  const totalRemaining = mockEmployees.reduce((sum, emp) => sum + emp.remaining, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">{userData.company} • {userData.employeeCount} employees</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Allocated</p>
                <p className="text-2xl font-bold">${totalAllocated.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold">${totalRemaining.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Employees</p>
                <p className="text-2xl font-bold">{userData.employeeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b">
        <Button 
          variant={activeTab === "overview" ? "default" : "ghost"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Button>
        <Button 
          variant={activeTab === "allocate" ? "default" : "ghost"}
          onClick={() => setActiveTab("allocate")}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Allocate Funds
        </Button>
        <Button 
          variant={activeTab === "requests" ? "default" : "ghost"}
          onClick={() => setActiveTab("requests")}
        >
          Pending Requests
        </Button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Budget Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEmployees.map((employee) => (
                    <div key={employee.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${employee.remaining}</p>
                          <p className="text-sm text-muted-foreground">of ${employee.allocated}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(employee.spent / employee.allocated) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{request.employee}</p>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">${request.amount}</span>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "allocate" && <FundAllocator employees={mockEmployees} />}

        {activeTab === "requests" && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium">{request.employee}</p>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                      <p className="text-sm text-muted-foreground">{request.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">${request.amount}</span>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
