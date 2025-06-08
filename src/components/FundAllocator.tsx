
import { useState } from "react";
import { Save, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
}

interface FundAllocatorProps {
  employees: Employee[];
}

const FundAllocator = ({ employees }: FundAllocatorProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>(
    employees.reduce((acc, emp) => ({ ...acc, [emp.id]: emp.allocated }), {})
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAllocationChange = (employeeId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAllocations(prev => ({ ...prev, [employeeId]: numValue }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Budgets updated!",
      description: "Employee budget allocations have been saved successfully.",
    });
    
    setIsSaving(false);
  };

  const totalAllocation = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fund Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 mb-6">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="flex-1">
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.department}</p>
                  <p className="text-sm text-muted-foreground">
                    Spent: ${employee.spent} | Remaining: ${employee.remaining}
                  </p>
                </div>
                
                <div className="w-32">
                  <Label htmlFor={`allocation-${employee.id}`} className="text-sm">
                    Budget ($)
                  </Label>
                  <Input
                    id={`allocation-${employee.id}`}
                    type="number"
                    min="0"
                    step="100"
                    value={allocations[employee.id]}
                    onChange={(e) => handleAllocationChange(employee.id, e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Total Budget Allocation</p>
              <p className="text-sm text-muted-foreground">
                Across {employees.length} employees
              </p>
            </div>
            <p className="text-2xl font-bold">${totalAllocation.toLocaleString()}</p>
          </div>

          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-4"
            size="lg"
          >
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Budget Allocations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                const newAllocations = employees.reduce((acc, emp) => 
                  ({ ...acc, [emp.id]: 2000 }), {}
                );
                setAllocations(newAllocations);
              }}
            >
              Set All to $2,000
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                const newAllocations = employees.reduce((acc, emp) => 
                  ({ ...acc, [emp.id]: emp.allocated + 500 }), {}
                );
                setAllocations(newAllocations);
              }}
            >
              Increase All by $500
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                const newAllocations = employees.reduce((acc, emp) => 
                  ({ ...acc, [emp.id]: emp.allocated }), {}
                );
                setAllocations(newAllocations);
              }}
            >
              Reset to Original
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundAllocator;
