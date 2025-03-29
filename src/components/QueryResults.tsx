
import React from 'react';
import { useAppSelector } from '../store/hooks';
import DataVisualization from './DataVisualization';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';

const QueryResults: React.FC = () => {
  const { queries, isProcessing } = useAppSelector(state => state.query);
  
  // Get latest query (if any)
  const latestQuery = queries.length > 0 ? queries[0] : null;
  
  // Empty state - no queries have been made
  if (!latestQuery) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-2">
        <div className="bg-primary/5 p-4 rounded-full mb-4">
          <ArrowUpRight className="h-12 w-12 text-primary/50" />
        </div>
        <h3 className="text-xl font-medium mb-2">No queries yet</h3>
        <p className="text-muted-foreground max-w-md">
          Enter a question above to analyze your data. Try asking something like "Show me user activity trends"
        </p>
      </Card>
    );
  }
  
  // Loading state
  if (latestQuery.status === 'loading' || isProcessing) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-medium mb-2">Processing your query...</h3>
        <p className="text-muted-foreground max-w-md">
          Analyzing: "{latestQuery.text}"
        </p>
      </Card>
    );
  }
  
  // Error state
  if (latestQuery.status === 'error') {
    return (
      <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center border-red-200 bg-red-50">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-medium mb-2 text-red-700">Error processing query</h3>
        <p className="text-red-600 max-w-md">
          {latestQuery.error || 'An unknown error occurred. Please try again.'}
        </p>
      </Card>
    );
  }
  
  // Success state with data visualization
  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="font-medium">Query: <span className="text-primary">{latestQuery.text}</span></p>
      </div>
      
      {latestQuery.result && (
        <DataVisualization result={latestQuery.result} />
      )}
    </div>
  );
};

export default QueryResults;
