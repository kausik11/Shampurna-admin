import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
  items: [],
  tags: [],
  status: 'idle',
  tagStatus: 'idle',
  error: null,
  tagError: null,
}

export const fetchResultImages = createAsyncThunk(
  'resultImages/fetchAll',
  async (tag, { rejectWithValue }) => {
    try {
      const response = await api.get('/resultimage', {
        params: tag ? { tag } : {},
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load result images')
    }
  },
)

export const fetchResultImageTags = createAsyncThunk(
  'resultImages/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/resultimage/tags')
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to load result image tags')
    }
  },
)

const resultImageSlice = createSlice({
  name: 'resultImages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResultImages.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchResultImages.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchResultImages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to load result images'
      })
      .addCase(fetchResultImageTags.pending, (state) => {
        state.tagStatus = 'loading'
        state.tagError = null
      })
      .addCase(fetchResultImageTags.fulfilled, (state, action) => {
        state.tagStatus = 'succeeded'
        state.tags = action.payload
      })
      .addCase(fetchResultImageTags.rejected, (state, action) => {
        state.tagStatus = 'failed'
        state.tagError = action.payload || 'Failed to load result image tags'
      })
  },
})

export default resultImageSlice.reducer
