
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentQuery, submitQuery } from '../store/querySlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Send, Sparkles } from 'lucide-react';

const QueryInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentQuery, suggestions, isProcessing } = useAppSelector(state => state.query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentQuery(e.target.value));
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim() && !isProcessing) {
      dispatch(submitQuery(currentQuery.trim()));
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setCurrentQuery(suggestion));
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) && 
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full mb-6">
      <form onSubmit={handleQuerySubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask a question about your data..."
            className="pl-10 pr-20 py-6 text-lg border-2 border-primary/20 focus-visible:ring-2 focus-visible:ring-primary/30"
            value={currentQuery}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(true)}
            disabled={isProcessing}
          />
          <div className="absolute right-2 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <Sparkles className="h-5 w-5 text-purple-500" />
            </Button>
            <Button
              type="submit"
              className="px-4 h-8 bg-primary hover:bg-primary/90"
              disabled={!currentQuery.trim() || isProcessing}
            >
              <Send className="h-4 w-4 mr-1" />
              <span>Send</span>
            </Button>
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <Card 
            ref={suggestionsRef}
            className="absolute z-50 mt-2 w-full p-2 bg-white shadow-lg border animate-in fade-in-50 zoom-in-95"
          >
            <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
              SUGGESTED QUERIES
            </div>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer px-2 py-2 text-sm rounded-md hover:bg-purple-50 transition-colors"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </form>
    </div>
  );
};

export default QueryInput;
