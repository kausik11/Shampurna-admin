import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  LuActivity,
  LuChartBar,
  LuRefreshCw,
  LuSparkles,
  LuUsers,
} from "react-icons/lu";

import { toast } from "react-toastify";
import { fetchServices } from "../features/services/serviceSlice";
import api from "../api/axios";

const Dashboard = () => {
  const dispatch = useDispatch();
  const serviceCount = useSelector((state) => state.services.items.length);
  const userDetails = useSelector((state) => state.auth.user);
  const [analytics, setAnalytics] = useState({
    totals: { pageViews: 0, uniqueVisitors: 0 },
    today: { pageViews: 0, uniqueVisitors: 0, date: "" },
    lastUpdated: null,
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isPingingVisit, setIsPingingVisit] = useState(false);
  const isAdmin = useMemo(
    () =>
      userDetails?.role
        ? ["superadmin","admin"].includes(
            userDetails.role.toLowerCase()
          )
        : false,
    [userDetails]
  );

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const { data } = await api.get("/analytics/daily");
      const days = data?.days || [];
      const lastDay = days[days.length - 1] || {};
      setAnalytics({
        totals: data?.totals || { pageViews: 0, uniqueVisitors: 0 },
        today: {
          date: lastDay.date || "",
          pageViews: lastDay.pageViews || 0,
          uniqueVisitors: lastDay.uniqueVisitors || 0,
        },
        lastUpdated: lastDay.updatedAt || null,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load analytics");
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const cards = [
    {
      label: "Total Services Available",
      value: serviceCount,
      icon: <LuSparkles />,
    },
    {
      label: "Page views (30d)",
      value: analytics.totals.pageViews,
      icon: <LuActivity />,
      loading: isLoadingAnalytics,
    },
    {
      label: "Unique visitors (30d)",
      value: analytics.totals.uniqueVisitors,
      icon: <LuUsers />,
      loading: isLoadingAnalytics,
    },
    {
      label: "Today's views",
      value: analytics.today.pageViews,
      icon: <LuChartBar />,
      loading: isLoadingAnalytics,
    },
  ];

  const handlePingVisit = async () => {
    setIsPingingVisit(true);
    try {
      await api.post("/analytics/track");
      toast.success("Visit recorded");
      await loadAnalytics();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to record visit");
    } finally {
      setIsPingingVisit(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Admin Dashboard</h2>
          <p className="muted">Track platform health and service performance.</p>
        </div>
      </div>
      {isAdmin && (
        <div className="card-actions" style={{ marginBottom: "1.5rem" }}>
          <Link className="primary-button" to="/users/new">
            <LuUsers size={16} />
            Create user
          </Link>
          <Link className="ghost-button ghost-button--solid" to="/users">
            Manage users
          </Link>
        </div>
      )}
      <div className="grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-icon">{card.icon}</div>
            <p className="muted">{card.label}</p>
            <p className="stat-value">{card.loading ? <span className="spinner" /> : card.value}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="eyebrow">Visitor analytics</p>
            <h3 style={{ margin: "4px 0" }}>Record and refresh</h3>
            {/* <p className="muted">
              Mirrors the backend endpoints: POST /api/analytics/track and GET /api/analytics/daily.
            </p> */}
          </div>
          <div className="card-actions" style={{ gap: "0.5rem" }}>
            <button
              className="ghost-button ghost-button--solid"
              type="button"
              onClick={loadAnalytics}
              disabled={isLoadingAnalytics}
            >
              {isLoadingAnalytics ? <span className="spinner" /> : <LuRefreshCw size={16} />}
              Refresh stats
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={handlePingVisit}
              disabled={isPingingVisit}
            >
              {isPingingVisit ? <span className="spinner" /> : <LuActivity size={16} />}
              {isPingingVisit ? "Recording..." : "Record page view"}
            </button>
          </div>
        </div>
        <div className="grid two-col" style={{ marginTop: "1rem" }}>
          <div>
            <p className="muted">Last day tracked</p>
            <p className="stat-value" style={{ fontSize: "1.4rem" }}>
              {analytics.today.date || "—"}
            </p>
          </div>
          <div>
            <p className="muted">Last updated</p>
            <p className="stat-value" style={{ fontSize: "1.4rem" }}>
              {analytics.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
