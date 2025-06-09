import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { paymanService } from "@/lib/payman";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  status?: "processing" | "approved" | "rejected";
}

interface EmployeeChatUIProps {
  userData: {
    name: string;
    email: string;
  };
}

const EmployeeChatUI = ({ userData }: EmployeeChatUIProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: `Hi ${userData.name}! I'm here to help you submit expenses quickly. Just describe what you spent money on and I'll handle the rest! 💸`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: "user" | "bot", status?: "processing" | "approved" | "rejected") => {
    const newMessage: Message = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      status
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const extractAmountAndDescription = (text: string) => {
    // Try to extract amount using common patterns
    const amountMatch = text.match(/\$(\d+(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
    
    // Remove the amount from the text to get the description
    const description = text.replace(/\$\d+(?:\.\d{2})?/, '').trim();
    
    return { amount, description };
  };

  const processExpense = async (userInput: string) => {
    setIsProcessing(true);
    
    // Add user message
    addMessage(userInput, "user");
    
    // Extract amount and description
    const { amount, description } = extractAmountAndDescription(userInput);
    
    if (!amount || !description) {
      addMessage("I couldn't understand the amount or description. Please try again with a format like 'Lunch with client - $45'", "bot", "rejected");
      setIsProcessing(false);
      return;
    }

    // Add processing message
    addMessage("Processing your expense... 🔍", "bot", "processing");
    
    try {
      const result = await paymanService.validateAndProcessReceipt(
        amount,
        description,
        userData.email,
        userData.name
      );

      if (result.status === 'reimbursed') {
        addMessage(`✅ Great news! Your expense of $${amount} has been approved and processed. Transaction ID: ${result.transactionId}`, "bot", "approved");
        toast({
          title: "Expense Approved! 🎉",
          description: `Amount: $${amount} TSD\nTransaction ID: ${result.transactionId}`
        });
      } else if (result.status === 'requires_approval') {
        addMessage(`⚠️ Your expense of $${amount} requires approval. ${result.message}`, "bot", "processing");
        toast({
          title: "Expense Requires Approval",
          description: result.message
        });
      } else {
        addMessage(`❌ Sorry, I couldn't process your expense. ${result.message}`, "bot", "rejected");
        toast({
          title: "Expense Rejected",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error processing expense:', error);
      addMessage("❌ Sorry, there was an error processing your expense. Please try again.", "bot", "rejected");
      toast({
        title: "Error",
        description: "Failed to process expense. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    processExpense(inputValue);
    setInputValue("");
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Quick Expense Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-start gap-2">
                  <p className="text-sm">{message.content}</p>
                  {getStatusIcon(message.status)}
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.type === "user" && (
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., 'Lunch with client - $45' or 'Hotel stay in NYC - $200'"
              disabled={isProcessing}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || isProcessing}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Describe your expense and I'll handle the processing automatically!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeChatUI;
