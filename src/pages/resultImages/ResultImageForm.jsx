import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchResultImages, fetchResultImageTags } from '../../features/resultImages/resultImageSlice'
import api from '../../api/axios'
import { toast } from 'react-toastify'

const ResultImageForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, tags, status, tagStatus } = useSelector((state) => state.resultImages)
  const resultImage = items.find((item) => item._id === id)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [beforeImageFile, setBeforeImageFile] = useState(null)
  const [afterImageFile, setAfterImageFile] = useState(null)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      tag: '',
    },
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchResultImages())
    }
    if (tagStatus === 'idle') {
      dispatch(fetchResultImageTags())
    }
    if (resultImage) {
      reset({
        tag: resultImage.tag || '',
      })
    }
  }, [resultImage, reset, status, tagStatus, dispatch])

  const onSubmit = async (values) => {
    setSubmitError('')
    if (!id && (!beforeImageFile || !afterImageFile)) {
      setSubmitError('Before and after images are required to create a result image.')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('tag', values.tag)
      if (beforeImageFile) {
        formData.append('beforeimage', beforeImageFile)
      }
      if (afterImageFile) {
        formData.append('afterimage', afterImageFile)
      }

      if (id) {
        await api.put(`/resultimage/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Result image updated')
      } else {
        await api.post('/resultimage', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Result image created')
      }
      dispatch(fetchResultImages())
      navigate('/result-images')
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to save result image'
      setSubmitError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page narrow">
      <div className="page-header">
        <div>
          <p className="eyebrow">Result Images</p>
          <h2>{id ? 'Edit Result Image' : 'Create Result Image'}</h2>
          <p className="muted">Add a fixed tag with before and after images.</p>
        </div>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="form-field">
          <span>Tag</span>
          <select {...register('tag', { required: true })}>
            <option value="">Select tag</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Before Image</span>
          <input type="file" accept="image/*" onChange={(e) => setBeforeImageFile(e.target.files?.[0] || null)} />
          {resultImage?.beforeimage ? <p className="form-hint"><span className="text-bold">Current Before Image:</span> {resultImage.beforeimage}</p> : null}
          {beforeImageFile ? <p className="form-hint"><span className="text-bold">New Before Image:</span> {beforeImageFile.name}</p> : null}
        </label>

        <label className="form-field">
          <span>After Image</span>
          <input type="file" accept="image/*" onChange={(e) => setAfterImageFile(e.target.files?.[0] || null)} />
          {resultImage?.afterimage ? <p className="form-hint"><span className="text-bold">Current After Image:</span> {resultImage.afterimage}</p> : null}
          {afterImageFile ? <p className="form-hint"><span className="text-bold">New After Image:</span> {afterImageFile.name}</p> : null}
        </label>

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={() => navigate('/result-images')}>
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" /> : null}
            {isSubmitting ? 'Saving...' : id ? 'Save changes' : 'Create result'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ResultImageForm
