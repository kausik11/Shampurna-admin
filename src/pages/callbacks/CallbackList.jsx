import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LuCalendarClock, LuClock4, LuMail, LuPencilLine, LuPhone, LuPlus, LuUserRound, LuStickyNote, LuDownload } from 'react-icons/lu'
import { toast } from 'react-toastify'
import { VALID_STATUSES, fetchCallbacks, updateCallback } from '../../features/callbacks/callbackSlice'
import * as XLSX from 'xlsx'

const CallbackList = () => {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.callbacks)
  const [updatingId, setUpdatingId] = useState(null)

  const handleExport = () => {
    if (!items.length) {
      toast.info('No callbacks to export')
      return
    }
    const data = items.map((item) => ({
      Name: item.fullName,
      Phone: item.phoneNumber,
      Email: item.email || '',
      PreferredService: item.preferredService || '',
      PreferredDate: item.preferredDate || '',
      PreferredTime: item.preferredTime || '',
      Description: item.description || '',
      Status: item.status,
      AdminComment: item.adminComment || '',
      CreatedAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Callbacks')
    XLSX.writeFile(wb, `savemedha-callbacks-${Date.now()}.xlsx`)
    toast.success('Exported callbacks to Excel')
  }

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCallbacks())
    }
  }, [status, dispatch])

  const handleStatusChange = async (id, nextStatus) => {
    setUpdatingId(id)
    const result = await dispatch(updateCallback({ id, data: { status: nextStatus } }))
    if (updateCallback.fulfilled.match(result)) {
      toast.success('Status updated')
    } else {
      toast.error(result.payload || 'Failed to update status')
    }
    setUpdatingId(null)
  }

  const handleAdminComment = async (id, adminComment) => {
    setUpdatingId(id)
    const result = await dispatch(updateCallback({ id, data: { adminComment } }))
    if (updateCallback.fulfilled.match(result)) {
      toast.success('Comment saved')
    } else {
      toast.error(result.payload || 'Failed to save comment')
    }
    setUpdatingId(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Leads</p>
          <h2>Callback Requests</h2>
          <p className="muted">Track inbound requests, update status, and leave admin notes.</p>
        </div>
        <div className="card-actions">
          <button className="ghost-button ghost-button--solid" type="button" onClick={handleExport}>
            <LuDownload size={16} />
            Export Excel
          </button>
          <Link className="primary-button" to="/requestcallbacks/new">
            <LuPlus size={16} />
            New Callback
          </Link>
        </div>
      </div>

      {status === 'loading' ? <p className="muted">Loading callbacks...</p> : null}
      {status === 'failed' ? <p className="form-error">{error}</p> : null}

      <div className="card-list">
        {items.map((item) => (
          <article key={item._id} className="card-row blog-card">
            <div className="blog-body">
              <div className="blog-head">
                <div>
                  <p className="card-title">
                    <LuUserRound size={14} /> {item.fullName}
                  </p>
                  <p className="muted">
                    <LuPhone size={14} /> {item.phoneNumber}
                  </p>
                  {item.email ? (
                    <p className="muted">
                      <LuMail size={14} /> {item.email}
                    </p>
                  ) : null}
                  {item.preferredService ? <p className="muted">Service: {item.preferredService}</p> : null}
                  {item.preferredDate || item.preferredTime ? (
                    <p className="muted">
                      <LuCalendarClock size={14} /> {item.preferredDate || '--'} {item.preferredTime || ''}
                    </p>
                  ) : null}
                  {item.description ? <p className="muted">{item.description}</p> : null}
                </div>
                <div className="pill">{item.status}</div>
              </div>
              <div className="blog-meta">
                <span>
                  <LuClock4 size={14} /> {item.createdAt ? new Date(item.createdAt).toLocaleString() : '--'}
                </span>
                {item.adminComment ? (
                  <span>
                    <LuStickyNote size={14} /> {item.adminComment}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="card-actions callback-actions">
              <Link className="ghost-button ghost-button--solid" to={`/requestcallbacks/${item._id}`}>
                <LuPencilLine size={16} />
                Edit
              </Link>
              <div className="action-cell">
                <p className="action-label">Status</p>
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  disabled={updatingId === item._id}
                >
                  {VALID_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="action-cell">
                <p className="action-label">Admin note</p>
                <button
                  className="ghost-button ghost-button--solid"
                  type="button"
                  disabled={updatingId === item._id}
                  onClick={() => {
                    const note = prompt('Admin comment', item.adminComment || '')
                    if (note !== null) handleAdminComment(item._id, note)
                  }}
                >
                  <LuPencilLine size={16} />
                  Comment
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CallbackList
