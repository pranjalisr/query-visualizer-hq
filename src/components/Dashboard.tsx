
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { querySuccess, queryError } from '../store/querySlice';
import { processQuery } from '../services/mockDataService';
import QueryInput from './QueryInput';
import QueryHistory from './QueryHistory';
import QueryResults from './QueryResults';
import { useToast } from '../hooks/use-toast';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { queries } = useAppSelector(state => state.query);
  const { toast } = useToast();
  
  // Process any queries that are in the loading state
  useEffect(() => {
    const loadingQuery = queries.find(q => q.status === 'loading');
    
    if (loadingQuery) {
      processQuery(loadingQuery.text)
        .then(result => {
          dispatch(querySuccess({ id: loadingQuery.id, result }));
          toast({
            title: 'Query processed successfully',
            description: 'Your results are ready to view.',
            duration: 3000,
          });
        })
        .catch(error => {
          dispatch(queryError({ 
            id: loadingQuery.id, 
            error: typeof error === 'string' ? error : 'Failed to process query. Please try again.' 
          }));
          toast({
            title: 'Error processing query',
            description: typeof error === 'string' ? error : 'Failed to process query. Please try again.',
            variant: 'destructive',
            duration: 4000,
          });
        });
    }
  }, [queries, dispatch, toast]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">AI Data Query Dashboard</h1>
        <p className="text-muted-foreground">Ask questions about your data and get instant visualizations</p>
      </header>
      
      <QueryInput />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <QueryResults />
        </div>
        <div>
          <QueryHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
