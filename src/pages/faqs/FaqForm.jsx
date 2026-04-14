import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createFaq, fetchFaqs, updateFaq } from '../../features/faqs/faqSlice'

const FaqForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, status } = useSelector((state) => state.faqs)
  const faq = items.find((item) => item._id === id)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      question: '',
      answer: '',
    },
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFaqs())
    }
    if (faq) {
      reset({
        question: faq.question || '',
        answer: faq.answer || '',
      })
    }
  }, [status, faq, dispatch, reset])

  const onSubmit = async (values) => {
    setSubmitError('')
    setIsSubmitting(true)
    try {
      const payload = {
        question: values.question,
        answer: values.answer,
      }

      if (id) {
        const result = await dispatch(updateFaq({ id, payload }))
        if (updateFaq.fulfilled.match(result)) {
          toast.success('FAQ updated')
        } else {
          throw new Error(result.payload)
        }
      } else {
        const result = await dispatch(createFaq(payload))
        if (createFaq.fulfilled.match(result)) {
          toast.success('FAQ created')
        } else {
          throw new Error(result.payload)
        }
      }
      navigate('/faqs')
    } catch (error) {
      const msg = error?.message || 'Failed to save FAQ'
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
          <p className="eyebrow">FAQs</p>
          <h2>{id ? 'Edit FAQ' : 'Create FAQ'}</h2>
          <p className="muted">Add a question and answer.</p>
        </div>
      </div>

      <form className="stacked-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="form-field">
          <span>Question</span>
          <input type="text" placeholder="Question" {...register('question', { required: true })} />
        </label>

        <label className="form-field">
          <span>Answer</span>
          <textarea rows="5" placeholder="Answer" {...register('answer', { required: true })} />
        </label>

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={() => navigate('/faqs')}>
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner" /> : null}
            {isSubmitting ? 'Saving...' : id ? 'Save changes' : 'Create FAQ'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FaqForm
