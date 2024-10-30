"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function ScrollPayments() {
  const [formData, setFormData] = useState({
    name: "",
    walletAddress: "",
    amount: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateLink = () => {
    const baseUrl = `${window.location.origin}/api/actions/scroll-payment`;
    return `https://dial.to/?action=solana-action:${baseUrl}?to=${encodeURIComponent(formData.walletAddress)}&amount=${encodeURIComponent(formData.amount)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Link copied!"))
      .catch(err => console.error("Failed to copy:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Scroll L2 Payments</h1>
      </div>
      
      <div className="container mx-auto p-4 max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Scroll Wallet Address</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.walletAddress}
              onChange={(e) => handleInputChange("walletAddress", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (ETH)</label>
            <input
              className="w-full p-2 border rounded"
              type="number"
              step="0.0001"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Generated Link</label>
            <div className="flex gap-2">
              <input
                className="w-full p-2 border rounded"
                value={generateLink()}
                readOnly
              />
              <button
                onClick={() => copyToClipboard(generateLink())}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Preview:</label>
            <div className="border rounded-lg overflow-hidden h-[500px]">
              <iframe
                src={generateLink()}
                className="w-full h-full"
                title="Payment Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}