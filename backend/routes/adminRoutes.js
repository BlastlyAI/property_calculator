import { Router } from "express";
import { fail, ok } from "../contracts/responseFactory.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { adminGetSession, adminLogin, adminLogout } from "../services/adminAuthService.js";
import {
  getAnalytics,
  getCustomerDetail,
  getDashboardOverview,
  listBookings,
  listCustomers,
  listLeads,
  updateBookingStatus,
} from "../services/adminService.js";
import { trackLeadActivity } from "../services/leadService.js";

const adminRouter = Router();

function errorResponse(res, error) {
  const code = error.code || "INTERNAL_ERROR";
  const status =
    code === "VALIDATION_ERROR" || code === "AUTH_FAILED"
      ? 400
      : code === "UNAUTHORIZED"
        ? 401
        : code === "FORBIDDEN"
          ? 403
          : 500;
  return res.status(status).json(fail(error.message || "Request failed", code, error.details || null));
}

adminRouter.post("/auth/login", async (req, res) => {
  try {
    const result = await adminLogin(req.body || {});
    return res.json(ok(result));
  } catch (error) {
    return errorResponse(res, error);
  }
});

adminRouter.get("/auth/session", requireAdmin(), async (req, res) => {
  return res.json(
    ok({
      user: {
        id: req.adminUser.id,
        email: req.adminUser.email,
        fullName: req.adminUser.user_metadata?.full_name || req.adminUser.email,
      },
    }),
  );
});

adminRouter.post("/auth/logout", requireAdmin(), async (_req, res) => {
  try {
    await adminLogout();
    return res.json(ok({ loggedOut: true }));
  } catch (error) {
    return errorResponse(res, error);
  }
});

adminRouter.get("/dashboard", requireAdmin(), async (_req, res) => {
  try {
    const overview = await getDashboardOverview();
    return res.json(ok(overview));
  } catch (error) {
    return errorResponse(res, error);
  }
});

adminRouter.get("/bookings", requireAdmin(), async (req, res) => {
  try {
    const result = await listBookings({
      search: String(req.query.search || ""),
      status: String(req.query.status || ""),
      paymentStatus: String(req.query.paymentStatus || ""),
      page: Number(req.query.page || 1),
      pageSize: Number(req.query.pageSize || 20),
      sortBy: String(req.query.sortBy || "created_at"),
      sortDir: String(req.query.sortDir || "desc"),
    });
    return res.json(ok(result));
  } catch (error) {
    return errorResponse(res, error);
  }
});

adminRouter.patch("/bookings/:bookingId", requireAdmin(), async (req, res) => {
  try {
    const body = req.body || {};
    const booking = await updateBookingStatus(req.params.bookingId, {
      status: body.status,
      paymentStatus: body.paymentStatus || body.payment_status,
    });
    return res.json(ok({ booking }));
  } catch (error) {
    return errorResponse(res, error);
  }
});

adminRouter.get("/customers", requireAdmin(), async (req, res) => {
  try {
    const result = await listCustomers({
      search: String(req.query.search || ""),
      page: Number(req.query.page || 1),
      pageSize: Number(req.query.pageSize || 20),
    });
    return res.json(ok(result));
  } catch (error) {
    return errorResponse(res, error);
  }
});

adminRouter.get("/customers/:customerId", requireAdmin(), async (req, res) => {
  try {
    const result = await getCustomerDetail(req.params.customerId);
    return res.json(ok(result));
  } catch (error) {
    return errorResponse(res, error);
  }
});

adminRouter.get("/leads", requireAdmin(), async (req, res) => {
  try {
    const result = await listLeads({
      search: String(req.query.search || ""),
      status: String(req.query.status || ""),
      page: Number(req.query.page || 1),
      pageSize: Number(req.query.pageSize || 20),
    });
    return res.json(ok(result));
  } catch (error) {
    return errorResponse(res, error);
  }
});

adminRouter.get("/analytics", requireAdmin(), async (_req, res) => {
  try {
    const analytics = await getAnalytics();
    return res.json(ok(analytics));
  } catch (error) {
    return errorResponse(res, error);
  }
});

export const publicLeadRouter = Router();

publicLeadRouter.post("/track", async (req, res) => {
  try {
    const lead = await trackLeadActivity(req.body || {});
    return res.json(ok({ lead }));
  } catch (error) {
    return errorResponse(res, error);
  }
});

export default adminRouter;
