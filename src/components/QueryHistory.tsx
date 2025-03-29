
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearHistory } from '../store/querySlice';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Trash2 } from 'lucide-react';

const QueryHistory: React.FC = () => {
  const { queries } = useAppSelector(state => state.query);
  const dispatch = useAppDispatch();

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  if (queries.length === 0) {
    return (
      <Card className="p-4 bg-muted/30">
        <div className="text-center text-muted-foreground py-8">
          <Clock className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
          <p>No query history yet</p>
          <p className="text-sm">Your recent queries will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 h-[400px] flex flex-col bg-muted/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Recent Queries</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearHistory}
          className="text-xs h-7 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Clear
        </Button>
      </div>
      
      <ScrollArea className="flex-1 pr-3">
        <div className="space-y-2">
          {queries.map((query) => {
            let statusColor = '';
            let statusText = '';
            
            switch (query.status) {
              case 'loading':
                statusColor = 'bg-yellow-100 text-yellow-800';
                statusText = 'Processing...';
                break;
              case 'success':
                statusColor = 'bg-green-100 text-green-800';
                statusText = 'Completed';
                break;
              case 'error':
                statusColor = 'bg-red-100 text-red-800';
                statusText = 'Failed';
                break;
              default:
                statusColor = 'bg-gray-100 text-gray-800';
                statusText = 'Idle';
            }
            
            return (
              <div 
                key={query.id} 
                className="p-3 bg-background rounded-md border hover:border-primary/20 transition-colors cursor-default"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium line-clamp-1">{query.text}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(query.timestamp), { addSuffix: true })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default QueryHistory;
