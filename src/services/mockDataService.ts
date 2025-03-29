
import { QueryResult } from '../store/querySlice';

// Mock data sets for different types of visualizations
const mockBarData: QueryResult = {
  id: 'bar-data',
  type: 'bar',
  title: 'User Activity by Platform',
  data: [
    { name: 'Mobile', value: 650 },
    { name: 'Desktop', value: 420 },
    { name: 'Tablet', value: 230 },
    { name: 'Web', value: 580 },
    { name: 'API', value: 310 }
  ]
};

const mockLineData: QueryResult = {
  id: 'line-data',
  type: 'line',
  title: 'Weekly API Requests',
  data: [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 }
  ]
};

const mockPieData: QueryResult = {
  id: 'pie-data',
  type: 'pie',
  title: 'Query Distribution by Type',
  data: [
    { name: 'Analysis', value: 35 },
    { name: 'Reporting', value: 25 },
    { name: 'Prediction', value: 20 },
    { name: 'Monitoring', value: 15 },
    { name: 'Other', value: 5 }
  ]
};

const mockAreaData: QueryResult = {
  id: 'area-data',
  type: 'area',
  title: 'System Resource Usage',
  data: [
    { name: '00:00', value: 2400 },
    { name: '04:00', value: 1398 },
    { name: '08:00', value: 9800 },
    { name: '12:00', value: 3908 },
    { name: '16:00', value: 4800 },
    { name: '20:00', value: 3800 }
  ]
};

// Maps keywords in queries to likely visualization types
const keywordMappings: Record<string, string[]> = {
  bar: ['compare', 'comparison', 'rank', 'ranking', 'top', 'bottom', 'performance'],
  line: ['trend', 'over time', 'historical', 'period', 'weekly', 'monthly', 'growth'],
  pie: ['distribution', 'percentage', 'proportion', 'breakdown', 'share', 'ratio'],
  area: ['volume', 'usage', 'consumption', 'resource', 'accumulation', 'total']
};

// Helper function to determine the most appropriate visualization type
function determineChartType(query: string): 'bar' | 'line' | 'pie' | 'area' {
  query = query.toLowerCase();
  
  for (const [chartType, keywords] of Object.entries(keywordMappings)) {
    for (const keyword of keywords) {
      if (query.includes(keyword)) {
        return chartType as 'bar' | 'line' | 'pie' | 'area';
      }
    }
  }
  
  // Default to bar chart if no keywords match
  return 'bar';
}

// Simulate API call with delay
export const processQuery = (query: string): Promise<QueryResult> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Randomly decide to throw an error (10% chance)
        if (Math.random() < 0.1) {
          throw new Error('Failed to process query. Please try again.');
        }
        
        const chartType = determineChartType(query);
        
        // Return appropriate mock data based on chart type
        switch (chartType) {
          case 'bar':
            resolve({...mockBarData, id: Date.now().toString()});
            break;
          case 'line':
            resolve({...mockLineData, id: Date.now().toString()});
            break;
          case 'pie':
            resolve({...mockPieData, id: Date.now().toString()});
            break;
          case 'area':
            resolve({...mockAreaData, id: Date.now().toString()});
            break;
          default:
            resolve({...mockBarData, id: Date.now().toString()});
        }
      } catch (error) {
        if (error instanceof Error) {
          reject(error.message);
        } else {
          reject('An unknown error occurred');
        }
      }
    }, 1500); // 1.5 second delay
  });
};
