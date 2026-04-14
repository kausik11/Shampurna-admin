import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LuPencilLine, LuPlus, LuTrash2 } from 'react-icons/lu'
import { fetchResultImages, fetchResultImageTags } from '../../features/resultImages/resultImageSlice'
import api from '../../api/axios'
import { toast } from 'react-toastify'

const ResultImageList = () => {
  const dispatch = useDispatch()
  const { items, tags, status, tagStatus, error } = useSelector((state) => state.resultImages)
  const [deletingId, setDeletingId] = useState(null)
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    if (tagStatus === 'idle') {
      dispatch(fetchResultImageTags())
    }
  }, [tagStatus, dispatch])

  useEffect(() => {
    dispatch(fetchResultImages(selectedTag))
  }, [selectedTag, dispatch])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Result Images</p>
          <h2>Before After Results</h2>
          <p className="muted">Manage tagged before and after images.</p>
        </div>
        <Link className="primary-button" to="/result-images/new">
          <LuPlus size={16} />
          New Result
        </Link>
      </div>

      <label className="form-field" style={{ maxWidth: '420px', marginBottom: '1rem' }}>
        <span>Filter by tag</span>
        <select value={selectedTag} onChange={(event) => setSelectedTag(event.target.value)}>
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>

      {status === 'loading' ? <p className="muted">Loading result images...</p> : null}
      {status === 'failed' ? <p className="form-error">{error}</p> : null}

      <div className="card-list">
        {items.map((item) => (
          <article key={item._id} className="card-row blog-card">
            <div className="blog-thumb">
              {item.beforeimage ? <img src={item.beforeimage} alt={`${item.tag} before`} /> : <div className="thumb-placeholder" />}
            </div>
            <div className="blog-thumb">
              {item.afterimage ? <img src={item.afterimage} alt={`${item.tag} after`} /> : <div className="thumb-placeholder" />}
            </div>
            <div className="blog-body">
              <p className="eyebrow">{item.tag}</p>
              <p className="card-title">Before and after result</p>
              <p className="muted">Created {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'recently'}</p>
            </div>
            <div className="card-actions">
              <Link className="ghost-button" to={`/result-images/${item._id}`}>
                <LuPencilLine size={16} />
                Edit
              </Link>
              <button
                className="ghost-button danger"
                disabled={deletingId === item._id}
                onClick={async () => {
                  setDeletingId(item._id)
                  try {
                    await api.delete(`/resultimage/${item._id}`)
                    toast.success('Result image deleted')
                    dispatch(fetchResultImages(selectedTag))
                  } catch (err) {
                    toast.error(err?.response?.data?.message || 'Failed to delete result image')
                  } finally {
                    setDeletingId(null)
                  }
                }}
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

export default ResultImageList
