import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LuCircleHelp, LuPencilLine, LuPlus, LuTrash2 } from 'react-icons/lu'
import { toast } from 'react-toastify'
import { deleteFaq, fetchFaqs } from '../../features/faqs/faqSlice'

const FaqList = () => {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.faqs)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFaqs())
    }
  }, [status, dispatch])

  const handleDelete = async (id) => {
    setDeletingId(id)
    const result = await dispatch(deleteFaq(id))
    if (deleteFaq.fulfilled.match(result)) {
      toast.success('FAQ deleted')
    } else {
      toast.error(result.payload || 'Failed to delete FAQ')
    }
    setDeletingId(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">FAQs</p>
          <h2>Frequently Asked Questions</h2>
          <p className="muted">Manage questions and answers for the site.</p>
        </div>
        <Link className="primary-button" to="/faqs/new">
          <LuPlus size={16} />
          New FAQ
        </Link>
      </div>

      {status === 'loading' ? <p className="muted">Loading FAQs...</p> : null}
      {status === 'failed' ? <p className="form-error">{error}</p> : null}

      <div className="card-list">
        {items.map((item) => (
          <article key={item._id} className="card-row blog-card">
            <div className="blog-body">
              <div className="blog-head">
                <div>
                  <p className="card-title">
                    <LuCircleHelp size={16} /> {item.question}
                  </p>
                  <p className="muted">{item.answer}</p>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Link className="ghost-button ghost-button--solid" to={`/faqs/${item._id}`}>
                <LuPencilLine size={16} />
                Edit
              </Link>
              <button
                className="ghost-button danger ghost-button--solid"
                disabled={deletingId === item._id}
                onClick={() => handleDelete(item._id)}
              >
                {deletingId === item._id ? <span className="spinner" /> : <LuTrash2 size={16} />}
                {deletingId === item._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default FaqList
