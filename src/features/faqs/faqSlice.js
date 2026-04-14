import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchFaqs = createAsyncThunk('faqs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/faqs')
    return response.data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load FAQs')
  }
})

export const createFaq = createAsyncThunk(
  'faqs/create',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/faqs', payload)
      dispatch(fetchFaqs())
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create FAQ')
    }
  },
)

export const updateFaq = createAsyncThunk(
  'faqs/update',
  async ({ id, payload }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch(`/faqs/${id}`, payload)
      dispatch(fetchFaqs())
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update FAQ')
    }
  },
)

export const deleteFaq = createAsyncThunk(
  'faqs/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/faqs/${id}`)
      dispatch(fetchFaqs())
      return id
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete FAQ')
    }
  },
)

const faqSlice = createSlice({
  name: 'faqs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(deleteFaq.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteFaq.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default faqSlice.reducer
