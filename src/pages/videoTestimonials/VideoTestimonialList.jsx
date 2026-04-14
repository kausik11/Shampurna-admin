import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LuPencilLine, LuPlay, LuPlus, LuTrash2 } from 'react-icons/lu'
import { toast } from 'react-toastify'
import {
  deleteVideoTestimonial,
  fetchVideoTestimonials,
} from '../../features/videoTestimonials/videoTestimonialSlice'

const VideoTestimonialList = () => {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.videoTestimonials)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVideoTestimonials())
    }
  }, [status, dispatch])

  const handleDelete = async (id) => {
    setDeletingId(id)
    const result = await dispatch(deleteVideoTestimonial(id))
    if (deleteVideoTestimonial.fulfilled.match(result)) {
      toast.success('Video testimonial deleted')
    } else {
      toast.error(result.payload || 'Failed to delete video testimonial')
    }
    setDeletingId(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Video Testimonials</p>
          <h2>Video Stories</h2>
          <p className="muted">Manage client video stories with profile and banner images.</p>
        </div>
        <Link className="primary-button" to="/video-testimonials/new">
          <LuPlus size={16} />
          New Video
        </Link>
      </div>

      {status === 'loading' ? <p className="muted">Loading video testimonials...</p> : null}
      {status === 'failed' ? <p className="form-error">{error}</p> : null}

      <div className="card-list">
        {items.map((item) => (
          <article key={item._id} className="card-row blog-card">
            <div className="blog-thumb">
              {item.bannerImage ? <img src={item.bannerImage} alt={`${item.name} banner`} /> : <div className="thumb-placeholder" />}
            </div>
            <div className="blog-thumb">
              {item.image ? <img src={item.image} alt={item.name} /> : <div className="thumb-placeholder" />}
            </div>
            <div className="blog-body">
              <div className="blog-head">
                <div>
                  <p className="card-title">{item.name}</p>
                  <p className="muted">{item.message}</p>
                </div>
                <a className="pill" href={item.videoLink} target="_blank" rel="noreferrer">
                  <LuPlay size={14} />
                  Video
                </a>
              </div>
            </div>
            <div className="card-actions">
              <Link className="ghost-button ghost-button--solid" to={`/video-testimonials/${item._id}`}>
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

export default VideoTestimonialList
