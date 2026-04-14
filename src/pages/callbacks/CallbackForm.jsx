import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createCallback, fetchCallbacks, updateCallback } from '../../features/callbacks/callbackSlice'
import { fetchServices } from '../../features/services/serviceSlice'

const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const CallbackForm = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, status } = useSelector((state) => state.callbacks)
  const { items: services, status: serviceStatus } = useSelector((state) => state.services)
  const callback = items.find((item) => item._id === id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      preferredService: '',
      preferredDate: getTodayDate(),
      preferredTime: '',
      description: '',
    },
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCallbacks())
    }
    if (serviceStatus === 'idle') {
      dispatch(fetchServices())
    }
    if (callback) {
      reset({
        fullName: callback.fullName || '',
        phoneNumber: callback.phoneNumber || '',
        email: callback.email || '',
        preferredService: callback.preferredService || '',
        preferredDate: callback.preferredDate || getTodayDate(),
        preferredTime: callback.preferredTime || '',
        description: callback.description || '',
      })
    }
  }, [status, serviceStatus, callback, dispatch, reset])

  const onSubmit = async (values) => {
    setSubmitError('')
    if (values.preferredDate < getTodayDate()) {
      setSubmitError('Preferred date must be today or a future date.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = id
        ? await dispatch(updateCallback({ id, data: values }))
        : await dispatch(createCallback(values))

      if (id ? updateCallback.fulfilled.match(result) : createCallback.fulfilled.match(result)) {
        toast.success(id ? 'Callback updated' : 'Callback created')
        navigate('/requestcallbacks')
      } else {
        throw new Error(result.payload)
      }
    } catch (error) {
      const msg = error?.message || 'Failed to save callback'
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
          <p className="eyebrow">Leads</p>
          <h2>{id ? 'Edit Callback Request' : 'Create a Callback Request'}</h2>
          <p className="muted">Log appointment details for follow-up.</p>
        </div>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="form-field">
          <span>Full Name</span>
          <input type="text" placeholder="Customer name" {...register('fullName', { required: true })} />
        </label>

        <label className="form-field">
          <span>Phone Number</span>
          <input type="tel" placeholder="+91..." {...register('phoneNumber', { required: true })} />
        </label>

        <label className="form-field">
          <span>Email</span>
          <input type="email" placeholder="customer@example.com" {...register('email', { required: true })} />
        </label>

        <label className="form-field">
          <span>Preferred Service</span>
          <select {...register('preferredService', { required: true })}>
            <option value="">Select service</option>
            {services.map((service) => (
              <option key={service._id} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>Preferred Date</span>
          <input type="date" min={getTodayDate()} {...register('preferredDate', { required: true })} />
        </label>

        <label className="form-field">
          <span>Preferred Time</span>
          <input type="time" {...register('preferredTime', { required: true })} />
        </label>

        <label className="form-field">
          <span>Description</span>
          <textarea rows="4" placeholder="Notes from the lead" {...register('description')} />
        </label>

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={() => navigate('/requestcallbacks')}>
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" /> : null}
            {isSubmitting ? 'Saving...' : id ? 'Save changes' : 'Create callback Request'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CallbackForm
