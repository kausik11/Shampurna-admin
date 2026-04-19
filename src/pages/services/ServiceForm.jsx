import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchServices } from '../../features/services/serviceSlice'
import api from '../../api/axios'
import { toast } from 'react-toastify'

const ServiceForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, status } = useSelector((state) => state.services)
  const service = items.find((item) => item._id === id)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [beforeImageFile, setBeforeImageFile] = useState(null)
  const [afterImageFile, setAfterImageFile] = useState(null)

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      shortDescription: '',
      tag: '',
      priceLabel: 'Pricing',
      priceValue: '',
      priceNote: '',
      longdescription: '',
      resultTitle: '',
      resultDescription: '',
      faqs: [{ question: '', answer: '' }],
    },
  })
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: 'faqs',
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchServices())
    }
    if (service) {
      reset({
        title: service.title || '',
        shortDescription: service.shortDescription || '',
        tag: service.tag || '',
        priceLabel: service.priceLabel || 'Pricing',
        priceValue: service.priceValue || '',
        priceNote: service.priceNote || '',
        longdescription: service.longdescription || '',
        resultTitle: service.result?.title || '',
        resultDescription: service.result?.description || '',
        faqs: service.faqs?.length
          ? service.faqs
          : [{ question: service.faq?.question || '', answer: service.faq?.answer || '' }],
      })
    }
  }, [service, reset, status, dispatch])

  const onSubmit = async (values) => {
    setSubmitError('')
    if (!id && (!beforeImageFile || !afterImageFile)) {
      setSubmitError('Before and after result images are required to create a service.')
      return
    }
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('shortDescription', values.shortDescription)
      formData.append('tag', values.tag)
      formData.append('priceLabel', values.priceLabel)
      formData.append('priceValue', values.priceValue)
      formData.append('priceNote', values.priceNote)
      formData.append('longdescription', values.longdescription)
      formData.append('resultTitle', values.resultTitle)
      formData.append('resultDescription', values.resultDescription)
      formData.append('faqs', JSON.stringify(values.faqs))
      if (beforeImageFile) {
        formData.append('beforeimage', beforeImageFile)
      }
      if (afterImageFile) {
        formData.append('afterimage', afterImageFile)
      }

      if (id) {
        await api.put(`/services/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Service updated')
      } else {
        await api.post('/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Service created')
      }
      dispatch(fetchServices())
      navigate('/services')
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Failed to update service')
      toast.error(error?.response?.data?.message || 'Failed to update service')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page narrow">
      <div className="page-header">
        <div>
          <p className="eyebrow">Services</p>
          <h2>{id ? 'Edit Service' : 'Create Service'}</h2>
          <p className="muted">Define service content, result story, and FAQ.</p>
        </div>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="form-field">
          <span>Title</span>
          <input type="text" placeholder="Service title" {...register('title', { required: true })} />
        </label>

        <label className="form-field">
          <span>Short Description</span>
          <textarea rows="3" placeholder="Short service summary" {...register('shortDescription', { required: true })} />
        </label>

        <label className="form-field">
          <span>Tag</span>
          <input type="text" placeholder="Service tag" {...register('tag', { required: true })} />
        </label>

        <label className="form-field">
          <span>Price Label</span>
          <input type="text" placeholder="Starting from, Per session, Fixed price" {...register('priceLabel')} />
        </label>

        <label className="form-field">
          <span>Price</span>
          <input type="text" placeholder="Rs. 3,000" {...register('priceValue', { required: true })} />
        </label>

        <label className="form-field">
          <span>Price Note</span>
          <input type="text" placeholder="Area based, Laser facial, Service-specific quote" {...register('priceNote')} />
        </label>

        <label className="form-field">
          <span>Long Description</span>
          <textarea rows="6" placeholder="Detailed service description" {...register('longdescription', { required: true })} />
        </label>

        <label className="form-field">
          <span>Result Title</span>
          <input type="text" placeholder="Result title" {...register('resultTitle', { required: true })} />
        </label>

        <label className="form-field">
          <span>Result Description</span>
          <textarea rows="4" placeholder="Result story description" {...register('resultDescription', { required: true })} />
        </label>

        <label className="form-field">
          <span>Before Image</span>
          <input type="file" accept="image/*" onChange={(e) => setBeforeImageFile(e.target.files?.[0] || null)} />
          {service?.result?.beforeimage ? <p className="form-hint"><span className="text-bold">Current Before Image:</span> {service.result.beforeimage}</p> : null}
          {beforeImageFile ? <p className="form-hint"><span className="text-bold">New Before Image:</span> {beforeImageFile.name}</p> : null}
        </label>

        <label className="form-field">
          <span>After Image</span>
          <input type="file" accept="image/*" onChange={(e) => setAfterImageFile(e.target.files?.[0] || null)} />
          {service?.result?.afterimage ? <p className="form-hint"><span className="text-bold">Current After Image:</span> {service.result.afterimage}</p> : null}
          {afterImageFile ? <p className="form-hint"><span className="text-bold">New After Image:</span> {afterImageFile.name}</p> : null}
        </label>

        <div className="form-field">
          <span>FAQs</span>
          {faqFields.map((field, index) => (
            <div className="stacked-form" key={field.id}>
              <input
                type="text"
                placeholder="Frequently asked question"
                {...register(`faqs.${index}.question`, { required: true })}
              />
              <textarea
                rows="4"
                placeholder="FAQ answer"
                {...register(`faqs.${index}.answer`, { required: true })}
              />
              {faqFields.length > 1 ? (
                <button className="ghost-button danger" type="button" onClick={() => removeFaq(index)}>
                  Remove FAQ
                </button>
              ) : null}
            </div>
          ))}
          <button
            className="ghost-button"
            type="button"
            onClick={() => appendFaq({ question: '', answer: '' })}
          >
            Add FAQ
          </button>
        </div>

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={() => navigate('/services')}>
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" /> : null}
            {isSubmitting ? 'Saving...' : id ? 'Save changes' : 'Create service'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ServiceForm
