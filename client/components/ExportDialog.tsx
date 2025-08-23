import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Table, Share2, Check } from "lucide-react";
import { ItineraryData } from "@shared/itinerary";
import { useItinerary } from "@/hooks/useItinerary";

interface ExportDialogProps {
  itinerary: ItineraryData;
  children: React.ReactNode;
}

export function ExportDialog({ itinerary, children }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);
  const { exportToPDF, exportToCSV, shareItinerary } = useItinerary();

  const handleExportPDF = () => {
    exportToPDF(itinerary);
    setExportedFormat('PDF');
    setTimeout(() => setExportedFormat(null), 2000);
  };

  const handleExportCSV = () => {
    exportToCSV(itinerary);
    setExportedFormat('CSV');
    setTimeout(() => setExportedFormat(null), 2000);
  };

  const handleShare = async () => {
    try {
      await shareItinerary(itinerary);
      setExportedFormat('shared');
      setTimeout(() => setExportedFormat(null), 2000);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Itinerary
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Download your {itinerary.destination} itinerary in your preferred format or share it with friends.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {/* PDF Export */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleExportPDF}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 rounded-lg p-2">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">PDF Document</h4>
                      <p className="text-sm text-gray-600">Formatted for printing and sharing</p>
                    </div>
                  </div>
                  {exportedFormat === 'PDF' ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Download className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CSV Export */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleExportCSV}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-lg p-2">
                      <Table className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">CSV Spreadsheet</h4>
                      <p className="text-sm text-gray-600">Import into Excel or Google Sheets</p>
                    </div>
                  </div>
                  {exportedFormat === 'CSV' ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Download className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleShare}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <Share2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Share Link</h4>
                      <p className="text-sm text-gray-600">Copy link to share with others</p>
                    </div>
                  </div>
                  {exportedFormat === 'shared' ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Share2 className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-t pt-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
