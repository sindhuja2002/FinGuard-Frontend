import React, {useEffect, useState} from 'react';

interface AlertsProps {
  alerts: string[];
}

export const Alerts: React.FC<AlertsProps> = ({ alerts }) => {

  const [visibleAlerts, setVisibleAlerts] = useState(alerts);

  useEffect(() => {
    console.log('Received alerts:', alerts); // Debugging: Check if alerts are received
    setVisibleAlerts(alerts);
  }, [alerts]);

  const handleAlertClick = (index: number) => {
    console.log('Alert clicked:', index); // Debugging: Check if click handler is triggered
    setVisibleAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };
  return (
    <div className="fixed top-4 right-4 space-y-4 z-50">
      {visibleAlerts.map((message, index) => {
        let bgColor = 'bg-gray-100'; // Default color

        // Determine the background color and additional styles based on message content
        if (message.includes('Yay')) {
          bgColor = 'bg-green-500'; // Darker green card
        } else if (message.includes('Red')) {
          bgColor = 'bg-red-500'; // Darker red card
        } else if (message.includes('Orange')) {
          bgColor = 'bg-orange-500'; // Darker orange card
        } else if (message.includes('Yellow')) {
          bgColor = 'bg-yellow-500'; // Darker yellow card
        }

        return (
          <div key={index} className={`p-4 rounded-lg ${bgColor} shadow-xl cursor-pointer transform transition-transform duration-300 hover:scale-105`} onClick={() => handleAlertClick(index)}>
            <p className={`text-white font-semibold text-lg`}>{message}</p>
          </div>
        );
      })}
    </div>
  );
};