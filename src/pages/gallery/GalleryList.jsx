import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LuImage, LuPencilLine, LuPlus, LuTrash2 } from 'react-icons/lu'
import { toast } from 'react-toastify'
import { deleteGalleryItem, fetchGalleryItems } from '../../features/gallery/gallerySlice'

const GalleryList = () => {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.gallery)
  const [deletingId, setDeletingId] = useState(null)
  const [selectedTag, setSelectedTag] = useState('')

  const tags = useMemo(
    () => Array.from(new Set(items.map((item) => item.tag).filter(Boolean))).sort(),
    [items],
  )

  useEffect(() => {
    dispatch(fetchGalleryItems(selectedTag))
  }, [selectedTag, dispatch])

  const handleDelete = async (id) => {
    setDeletingId(id)
    const result = await dispatch(deleteGalleryItem(id))
    if (deleteGalleryItem.fulfilled.match(result)) {
      toast.success('Gallery item deleted')
      dispatch(fetchGalleryItems(selectedTag))
    } else {
      toast.error(result.payload || 'Failed to delete gallery item')
    }
    setDeletingId(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2>Gallery Items</h2>
          <p className="muted">Manage tagged gallery images with titles and descriptions.</p>
        </div>
        <Link className="primary-button" to="/gallery/new">
          <LuPlus size={16} />
          New Gallery Item
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

      {status === 'loading' ? <p className="muted">Loading gallery items...</p> : null}
      {status === 'failed' ? <p className="form-error">{error}</p> : null}

      <div className="card-list">
        {items.map((item) => (
          <article key={item._id} className="card-row blog-card">
            <div className="blog-thumb">
              {item.image ? <img src={item.image} alt={item.title} /> : <div className="thumb-placeholder" />}
            </div>
            <div className="blog-body">
              <p className="eyebrow">{item.tag}</p>
              <p className="card-title">
                <LuImage size={16} /> {item.title}
              </p>
              <p className="muted">{item.description}</p>
            </div>
            <div className="card-actions">
              <Link className="ghost-button ghost-button--solid" to={`/gallery/${item._id}`}>
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

export default GalleryList
