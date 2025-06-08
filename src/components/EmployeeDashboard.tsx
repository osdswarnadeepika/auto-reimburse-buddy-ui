
import { useState } from "react";
import { LogOut, Upload, MessageCircle, DollarSign, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReceiptUploader from "@/components/ReceiptUploader";
import EmployeeChatUI from "@/components/EmployeeChatUI";

interface EmployeeDashboardProps {
  userData: any;
  onLogout: () => void;
}

const EmployeeDashboard = ({ userData, onLogout }: EmployeeDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"upload" | "chat" | "history">("upload");

  const mockHistory = [
    { id: 1, description: "Hotel stay - San Francisco", amount: 245, status: "approved", date: "2024-06-01" },
    { id: 2, description: "Client dinner", amount: 89, status: "pending", date: "2024-06-03" },
    { id: 3, description: "Uber to airport", amount: 32, status: "approved", date: "2024-06-05" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userData.name}!</h1>
          <p className="text-muted-foreground">{userData.department} • Employee ID: {userData.id}</p>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining Budget</p>
                <p className="text-2xl font-bold">${userData.remainingBudget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">$366</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b">
        <Button 
          variant={activeTab === "upload" ? "default" : "ghost"}
          onClick={() => setActiveTab("upload")}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Receipt
        </Button>
        <Button 
          variant={activeTab === "chat" ? "default" : "ghost"}
          onClick={() => setActiveTab("chat")}
          className="gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Quick Submit
        </Button>
        <Button 
          variant={activeTab === "history" ? "default" : "ghost"}
          onClick={() => setActiveTab("history")}
        >
          History
        </Button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "upload" && <ReceiptUploader />}
        {activeTab === "chat" && <EmployeeChatUI userData={userData} />}
        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <CardTitle>Reimbursement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">${item.amount}</span>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
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

export default EmployeeDashboard;
