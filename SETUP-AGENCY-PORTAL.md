Add the following variables to `.env.local` before using the Travel Agency Portal and admin features:

ADMIN_USER_ID=           # MongoDB ObjectId of the admin user (string)
NEXT_PUBLIC_APP_URL=http://localhost:3000

Notes:
- `ADMIN_USER_ID` is used by admin API routes to authorize admin-only endpoints.
- `NEXT_PUBLIC_APP_URL` is used by server-side pages to construct internal API URLs. Set to your local dev URL.