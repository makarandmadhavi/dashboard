'use client';

import React, { useMemo } from 'react';
import { RawRecord } from '@/app/lib/api'; // Adjust the import path as needed
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export interface AggregatedCardsProps {
  data: RawRecord[];
}

// Create a styled Paper with a frosted glass effect
const FrostedPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(31, 41, 55, 0.3)', // Dark gray with 30% opacity
  backdropFilter: 'blur(8px)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
}));

const AggregatedCards: React.FC<AggregatedCardsProps> = ({ data }) => {
  // Compute Total Sales
  const totalSales = useMemo(() => {
    return data.reduce((sum, record) => sum + record.sales_amount, 0);
  }, [data]);

  // Compute the count of cars sold by each model
  const carsSoldByModel = useMemo(() => {
    const countMap: { [model: string]: number } = {};
    data.forEach(record => {
      const model = record.car_model;
      countMap[model] = (countMap[model] || 0) + 1;
    });
    return Object.entries(countMap).map(([model, count]) => ({ model, count }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Total Sales Card */}
      <FrostedPaper>
        <Typography variant="h6" className="text-white mb-2">
          Total Sales
        </Typography>
        <Typography variant="h4" className="text-white font-bold">
          ${totalSales.toLocaleString()}
        </Typography>
      </FrostedPaper>

      {/* Cars Sold by Model Card */}
      <FrostedPaper className="flex flex-col">
        <Typography variant="h6" className="text-white mb-2">
          Cars Sold by Model
        </Typography>
        <div
          className="max-h-32 overflow-y-auto hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <ul>
            {carsSoldByModel.map(item => (
              <li
                key={item.model}
                className="flex justify-between py-1 border-b border-white border-opacity-20 text-white text-sm"
              >
                <span>{item.model}</span>
                <span>{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Global style to hide scrollbar for WebKit */}
        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </FrostedPaper>
    </div>
  );
};

export default AggregatedCards;
