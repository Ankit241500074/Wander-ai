import { useState } from 'react';
import { TravelFormData, ItineraryData, ItineraryApiResponse } from '@shared/itinerary';

export const useItinerary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateItinerary = async (formData: TravelFormData): Promise<ItineraryData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required. Please sign in to generate itineraries.');
      }

      console.log('Generating itinerary with data:', formData);

      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token from localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');

          // Try to get more specific error message
          const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }));
          console.log('Authentication error details:', errorData);

          throw new Error(errorData.error || 'Authentication expired. Please sign in again.');
        }
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result: ItineraryApiResponse = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate itinerary');
      }

      console.log('Successfully generated itinerary:', result.data);
      return result.data;
    } catch (err) {
      console.error('Error in generateItinerary:', err);

      let errorMessage = 'An unexpected error occurred';

      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = (itinerary: ItineraryData): void => {
    // Create a formatted text version for now
    const content = [
      `${itinerary.destination} Travel Itinerary`,
      `${itinerary.totalDays} days • $${itinerary.totalBudget} budget • ${itinerary.difficulty} pace`,
      '',
      ...itinerary.days.flatMap(day => [
        `DAY ${day.day} - ${day.date}`,
        `Budget: $${day.totalCost}`,
        day.summary,
        '',
        'MORNING:',
        ...day.activities.morning.map(act => `• ${act.time} - ${act.name} (${act.duration}) - $${act.cost}`),
        '',
        'AFTERNOON:',
        ...day.activities.afternoon.map(act => `• ${act.time} - ${act.name} (${act.duration}) - $${act.cost}`),
        '',
        'EVENING:',
        ...day.activities.evening.map(act => `• ${act.time} - ${act.name} (${act.duration}) - $${act.cost}`),
        '',
        '---',
        ''
      ]),
      'TRAVEL TIPS:',
      ...itinerary.tips.map(tip => `• ${tip}`),
    ].join('\n');

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '_')}_itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (itinerary: ItineraryData): void => {
    const headers = ['Day', 'Date', 'Time', 'Activity', 'Type', 'Duration', 'Cost', 'Address', 'Description'];
    const rows = [
      headers.join(','),
      ...itinerary.days.flatMap(day => 
        [...day.activities.morning, ...day.activities.afternoon, ...day.activities.evening]
          .map(activity => [
            day.day,
            day.date,
            activity.time,
            `"${activity.name}"`,
            activity.type,
            activity.duration,
            activity.cost,
            `"${activity.address}"`,
            `"${activity.description.replace(/"/g, '""')}"`
          ].join(','))
      )
    ];

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '_')}_itinerary.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareItinerary = async (itinerary: ItineraryData): Promise<void> => {
    const shareData = {
      title: `${itinerary.destination} Travel Itinerary`,
      text: `Check out my ${itinerary.totalDays}-day trip to ${itinerary.destination}! Generated by WanderAI.`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    }
  };

  return {
    generateItinerary,
    exportToPDF,
    exportToCSV,
    shareItinerary,
    isLoading,
    error
  };
};
