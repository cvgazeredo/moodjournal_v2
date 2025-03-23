'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Utensils } from 'lucide-react';

interface DietPieChartProps {
  timeRange: string;
}

interface FoodCategoryData {
  name: string;
  value: number;
  color: string;
}

// Color palette for the pie chart - using more vibrant food-related colors
const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

// Food category display names
const FOOD_CATEGORY_NAMES: Record<string, string> = {
  "fruits-veggies": "Fruits & Vegetables",
  "whole-grains": "Whole Grains",
  "lean-protein": "Lean Protein",
  "dairy": "Dairy",
  "sugary-items": "Sugary Items",
  "processed-foods": "Processed Foods",
  "fast-food": "Fast Food",
  "fruit": "Fruit"
};

export function DietPieChart({ timeRange }: DietPieChartProps) {
  const [data, setData] = useState<FoodCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDietData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/statistics/diet?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch diet data');
        }
        
        const dietData = await response.json();
        console.log('Diet data received:', dietData);
        
        // Calculate total entries for percentage
        const totalEntries = dietData.totalEntries;
        setTotal(totalEntries);
        
        // Transform the data for the pie chart
        const chartData = Object.entries(dietData.foodCategories)
          .map(([name, count], index) => ({
            name: FOOD_CATEGORY_NAMES[name] || name, // Use display name if available
            originalName: name, // Keep original name for reference
            value: count as number,
            color: COLORS[index % COLORS.length]
          }));
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching diet data:', error);
        setError('Failed to load diet data. Please try again later.');
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDietData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <Utensils className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
        <p className="text-muted-foreground max-w-md">
          {error}
        </p>
      </div>
    );
  }

  // If no data, show a message with a nice empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="bg-muted/50 rounded-full p-4 mb-4">
          <Utensils className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No diet data available</h3>
        <p className="text-muted-foreground max-w-md">
          Start tracking your diet in daily entries to see your food choices visualized here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} entries (${((value as number / total) * 100).toFixed(0)}%)`, name]}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                }}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-foreground">
                <tspan x="50%" dy="-0.5em" fontSize="14" fontWeight="500">Total</tspan>
                <tspan x="50%" dy="1.5em" fontSize="18" fontWeight="600">{total}</tspan>
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-1/2 mt-4 md:mt-0 md:ml-8">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">FOOD CHOICES</h3>
          <div className="grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto pr-2">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-medium">{entry.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{entry.value} entries</span>
                  <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                    {((entry.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 