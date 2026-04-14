import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createGalleryItem, fetchGalleryItems, updateGalleryItem } from '../../features/gallery/gallerySlice'

const GalleryForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, status } = useSelector((state) => state.gallery)
  const galleryItem = items.find((item) => item._id === id)
  const [imageFile, setImageFile] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      tag: '',
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGalleryItems())
    }
    if (galleryItem) {
      reset({
        tag: galleryItem.tag || '',
        title: galleryItem.title || '',
        description: galleryItem.description || '',
      })
    }
  }, [status, galleryItem, dispatch, reset])

  const onSubmit = async (values) => {
    setSubmitError('')
    if (!id && !imageFile) {
      setSubmitError('Image is required to create a gallery item.')
      return
    }

    const formData = new FormData()
    formData.append('tag', values.tag)
    formData.append('title', values.title)
    formData.append('description', values.description)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    setIsSubmitting(true)
    try {
      if (id) {
        const result = await dispatch(updateGalleryItem({ id, formData }))
        if (updateGalleryItem.fulfilled.match(result)) {
          toast.success('Gallery item updated')
        } else {
          throw new Error(result.payload)
        }
      } else {
        const result = await dispatch(createGalleryItem(formData))
        if (createGalleryItem.fulfilled.match(result)) {
          toast.success('Gallery item created')
        } else {
          throw new Error(result.payload)
        }
      }
      navigate('/gallery')
    } catch (error) {
      const msg = error?.message || 'Failed to save gallery item'
      setSubmitError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page narrow">
      <div className="page-header">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2>{id ? 'Edit Gallery Item' : 'Create Gallery Item'}</h2>
          <p className="muted">Add a tag, title, description, and image.</p>
        </div>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="form-field">
          <span>Tag</span>
          <input type="text" placeholder="Gallery tag" {...register('tag', { required: true })} />
        </label>

        <label className="form-field">
          <span>Title</span>
          <input type="text" placeholder="Gallery title" {...register('title', { required: true })} />
        </label>

        <label className="form-field">
          <span>Description</span>
          <textarea rows="4" placeholder="Gallery description" {...register('description', { required: true })} />
        </label>

        <label className="form-field">
          <span>Image</span>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          {galleryItem?.image ? <p className="form-hint">Current: {galleryItem.image}</p> : null}
          {imageFile ? <p className="form-hint">New: {imageFile.name}</p> : null}
        </label>

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={() => navigate('/gallery')}>
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" /> : null}
            {isSubmitting ? 'Saving...' : id ? 'Save changes' : 'Create gallery item'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GalleryForm
