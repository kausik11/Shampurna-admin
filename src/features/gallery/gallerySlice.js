import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchGalleryItems = createAsyncThunk('gallery/fetchAll', async (tag, { rejectWithValue }) => {
  try {
    const response = await api.get('/gallery', {
      params: tag ? { tag } : {},
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error?.response?.data?.message || 'Failed to load gallery items')
  }
})

export const createGalleryItem = createAsyncThunk(
  'gallery/create',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      dispatch(fetchGalleryItems())
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create gallery item')
    }
  },
)

export const updateGalleryItem = createAsyncThunk(
  'gallery/update',
  async ({ id, formData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/gallery/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      dispatch(fetchGalleryItems())
      return response.data
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update gallery item')
    }
  },
)

export const deleteGalleryItem = createAsyncThunk(
  'gallery/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/gallery/${id}`)
      dispatch(fetchGalleryItems())
      return id
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete gallery item')
    }
  },
)

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryItems.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchGalleryItems.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchGalleryItems.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(deleteGalleryItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteGalleryItem.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default gallerySlice.reducer
