import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchVideoTestimonials = createAsyncThunk(
  'videoTestimonials/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/video-testimonials')
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load video testimonials')
    }
  },
)

export const createVideoTestimonial = createAsyncThunk(
  'videoTestimonials/create',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/video-testimonials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      dispatch(fetchVideoTestimonials())
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create video testimonial')
    }
  },
)

export const updateVideoTestimonial = createAsyncThunk(
  'videoTestimonials/update',
  async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/video-testimonials/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      dispatch(fetchVideoTestimonials())
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update video testimonial')
    }
  },
)

export const deleteVideoTestimonial = createAsyncThunk(
  'videoTestimonials/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/video-testimonials/${id}`)
      dispatch(fetchVideoTestimonials())
      return id
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete video testimonial')
    }
  },
)

const videoTestimonialSlice = createSlice({
  name: 'videoTestimonials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoTestimonials.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchVideoTestimonials.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchVideoTestimonials.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(deleteVideoTestimonial.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteVideoTestimonial.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(deleteVideoTestimonial.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default videoTestimonialSlice.reducer
