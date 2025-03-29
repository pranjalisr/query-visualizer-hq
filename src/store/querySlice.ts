
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QueryResult {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: Array<{ name: string; value: number }>;
}

export interface QueryState {
  queries: {
    id: string;
    text: string;
    timestamp: number;
    status: 'idle' | 'loading' | 'success' | 'error';
    result?: QueryResult;
    error?: string;
  }[];
  suggestions: string[];
  isProcessing: boolean;
  currentQuery: string;
}

const initialState: QueryState = {
  queries: [],
  suggestions: [
    'Show me user activity trends for the last week',
    'What are the top performing AI models?',
    'Compare API response times across regions',
    'Visualize conversion rates by channel',
    'Analyze error rates over time'
  ],
  isProcessing: false,
  currentQuery: '',
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    submitQuery: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.queries.unshift({
        id,
        text: action.payload,
        timestamp: Date.now(),
        status: 'loading',
      });
      state.isProcessing = true;
      state.currentQuery = '';
    },
    querySuccess: (state, action: PayloadAction<{ id: string; result: QueryResult }>) => {
      const { id, result } = action.payload;
      const query = state.queries.find(q => q.id === id);
      if (query) {
        query.status = 'success';
        query.result = result;
      }
      state.isProcessing = false;
    },
    queryError: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const { id, error } = action.payload;
      const query = state.queries.find(q => q.id === id);
      if (query) {
        query.status = 'error';
        query.error = error;
      }
      state.isProcessing = false;
    },
    clearHistory: (state) => {
      state.queries = [];
    },
  }
});

export const { setCurrentQuery, submitQuery, querySuccess, queryError, clearHistory } = querySlice.actions;
export default querySlice.reducer;
