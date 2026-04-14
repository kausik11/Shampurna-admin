import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  createVideoTestimonial,
  fetchVideoTestimonials,
  updateVideoTestimonial,
} from '../../features/videoTestimonials/videoTestimonialSlice'

const VideoTestimonialForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, status } = useSelector((state) => state.videoTestimonials)
  const videoTestimonial = items.find((item) => item._id === id)

  const [imageFile, setImageFile] = useState(null)
  const [bannerImageFile, setBannerImageFile] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      message: '',
      videoLink: '',
    },
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVideoTestimonials())
    }
    if (videoTestimonial) {
      reset({
        name: videoTestimonial.name || '',
        message: videoTestimonial.message || '',
        videoLink: videoTestimonial.videoLink || '',
      })
    }
  }, [status, videoTestimonial, dispatch, reset])

  const onSubmit = async (values) => {
    setSubmitError('')
    if (!id && (!imageFile || !bannerImageFile)) {
      setSubmitError('Image and banner image are required to create a video testimonial.')
      return
    }

    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('message', values.message)
    formData.append('videoLink', values.videoLink)
    if (imageFile) {
      formData.append('image', imageFile)
    }
    if (bannerImageFile) {
      formData.append('bannerImage', bannerImageFile)
    }

    setIsSubmitting(true)
    try {
      if (id) {
        const result = await dispatch(updateVideoTestimonial({ id, formData }))
        if (updateVideoTestimonial.fulfilled.match(result)) {
          toast.success('Video testimonial updated')
        } else {
          throw new Error(result.payload)
        }
      } else {
        const result = await dispatch(createVideoTestimonial(formData))
        if (createVideoTestimonial.fulfilled.match(result)) {
          toast.success('Video testimonial created')
        } else {
          throw new Error(result.payload)
        }
      }
      navigate('/video-testimonials')
    } catch (error) {
      const msg = error?.message || 'Failed to save video testimonial'
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
          <p className="eyebrow">Video Testimonials</p>
          <h2>{id ? 'Edit Video Testimonial' : 'Create Video Testimonial'}</h2>
          <p className="muted">Add a name, message, video link, profile image, and banner image.</p>
        </div>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="form-field">
          <span>Name</span>
          <input type="text" placeholder="Person name" {...register('name', { required: true })} />
        </label>

        <label className="form-field">
          <span>Message</span>
          <textarea rows="4" placeholder="What did they say?" {...register('message', { required: true })} />
        </label>

        <label className="form-field">
          <span>Video Link</span>
          <input type="url" placeholder="https://..." {...register('videoLink', { required: true })} />
        </label>

        <label className="form-field">
          <span>Image</span>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          {videoTestimonial?.image ? <p className="form-hint">Current: {videoTestimonial.image}</p> : null}
          {imageFile ? <p className="form-hint">New: {imageFile.name}</p> : null}
        </label>

        <label className="form-field">
          <span>Banner Image</span>
          <input type="file" accept="image/*" onChange={(e) => setBannerImageFile(e.target.files?.[0] || null)} />
          {videoTestimonial?.bannerImage ? <p className="form-hint">Current: {videoTestimonial.bannerImage}</p> : null}
          {bannerImageFile ? <p className="form-hint">New: {bannerImageFile.name}</p> : null}
        </label>

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={() => navigate('/video-testimonials')}>
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" /> : null}
            {isSubmitting ? 'Saving...' : id ? 'Save changes' : 'Create video testimonial'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VideoTestimonialForm
