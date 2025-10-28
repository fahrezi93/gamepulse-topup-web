# 🔒 Security Best Practices - GamePulse

Panduan keamanan untuk deployment dan production environment GamePulse.

---

## 📋 Table of Contents

1. [Environment Variables](#environment-variables)
2. [Authentication Security](#authentication-security)
3. [Database Security](#database-security)
4. [API Security](#api-security)
5. [Frontend Security](#frontend-security)
6. [Deployment Security](#deployment-security)
7. [Monitoring & Logging](#monitoring--logging)
8. [Security Checklist](#security-checklist)

---

## 🔐 Environment Variables

### ❌ NEVER Commit These Files:
```
.env
.env.local
.env.production
.env.development
*firebase-adminsdk*.json
```

### ✅ Best Practices:

1. **Use Strong Secrets**
```bash
# Generate strong NEXTAUTH_SECRET
openssl rand -base64 32

# Generate strong passwords
openssl rand -base64 24
```

2. **Rotate Secrets Regularly**
- Rotate `NEXTAUTH_SECRET` setiap 90 hari
- Rotate API keys setiap 6 bulan
- Rotate database passwords setiap 90 hari

3. **Use Different Secrets Per Environment**
```env
# Development
NEXTAUTH_SECRET="dev-secret-xxx"

# Production
NEXTAUTH_SECRET="prod-secret-yyy"
```

4. **Never Hardcode Credentials**
```javascript
❌ BAD:
const apiKey = "hardcoded-key-123"

✅ GOOD:
const apiKey = process.env.API_KEY
```

---

## 🔑 Authentication Security

### NextAuth.js Configuration

```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    // ...providers
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // Update every 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add security checks here
      return token
    },
  },
}
```

### Password Security

1. **Use bcrypt for Hashing**
```typescript
import bcrypt from 'bcryptjs'

// Hash password
const hashedPassword = await bcrypt.hash(password, 12) // 12 rounds

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword)
```

2. **Password Requirements**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

### Firebase Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions are read-only for users
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // Only server can write
    }
  }
}
```

---

## 🗄️ Database Security

### Prisma Best Practices

1. **Use Parameterized Queries** (Prisma handles this automatically)
```typescript
✅ GOOD: Prisma automatically prevents SQL injection
const user = await prisma.user.findUnique({
  where: { email: userEmail }
})

❌ BAD: Raw queries without sanitization
const user = await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`
```

2. **Connection Pool Limits**
```env
# .env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=10"
```

3. **Enable SSL for Production**
```env
# PostgreSQL with SSL
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

4. **Database Access Control**
- Create separate database users for different environments
- Use read-only users for analytics
- Limit permissions to necessary operations only

```sql
-- Create read-only user
CREATE USER analytics_readonly WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE gamepulse TO analytics_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_readonly;
```

### Backup Strategy

1. **Automated Backups**
   - Daily full backups
   - Hourly incremental backups
   - Test restore procedures monthly

2. **Neon Database Backups**
   - Neon provides automatic point-in-time recovery
   - Configure retention period di dashboard

---

## 🛡️ API Security

### Rate Limiting

```typescript
// middleware.ts or API route
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response("Too Many Requests", { status: 429 })
  }
  
  return NextResponse.next()
}
```

### API Route Protection

```typescript
// src/app/api/admin/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  // Check authentication
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }
  
  // Check admin role
  if (session.user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 })
  }
  
  // Process request...
}
```

### Input Validation

```typescript
import { z } from "zod"

const topUpSchema = z.object({
  gameUserId: z.string().min(1).max(50),
  denominationId: z.string().cuid(),
  paymentMethod: z.enum(["DANA", "OVO", "GOPAY", "QRIS"]),
})

// In API route
const result = topUpSchema.safeParse(await request.json())
if (!result.success) {
  return new Response(JSON.stringify(result.error), { status: 400 })
}
```

### CORS Configuration

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://yourdomain.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ]
  },
}
```

---

## 🌐 Frontend Security

### Content Security Policy (CSP)

```typescript
// next.config.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' *.firebase.com *.googleapis.com;
  frame-src 'self' *.google.com;
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
]
```

### XSS Prevention

```typescript
// Always sanitize user input
import DOMPurify from 'isomorphic-dompurify'

const sanitizedHtml = DOMPurify.sanitize(userInput)

// Use React's built-in escaping
<div>{userInput}</div> // ✅ Safe

// Avoid dangerouslySetInnerHTML unless necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /> // ⚠️ Use carefully
```

---

## 🚀 Deployment Security

### Vercel Configuration

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### Environment Variables in Vercel

1. **Set via Vercel Dashboard**
   - Project Settings > Environment Variables
   - Gunakan different values untuk Production, Preview, Development

2. **Use Vercel CLI**
```bash
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production
```

### HTTPS Only

- ✅ Vercel automatically provides SSL
- ✅ Enforce HTTPS dengan HSTS headers
- ✅ Redirect HTTP to HTTPS

---

## 📊 Monitoring & Logging

### Error Tracking

```typescript
// lib/logger.ts
export const logger = {
  error: (error: Error, context?: any) => {
    console.error({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context,
    })
    
    // Send to monitoring service (Sentry, etc)
    // Sentry.captureException(error)
  },
  
  info: (message: string, data?: any) => {
    console.log({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data,
    })
  },
}
```

### Audit Logging

```typescript
// Log important actions
await prisma.auditLog.create({
  data: {
    action: 'USER_LOGIN',
    userId: user.id,
    ipAddress: request.ip,
    userAgent: request.headers['user-agent'],
    timestamp: new Date(),
  }
})
```

---

## ✅ Security Checklist

### Pre-Deployment

- [ ] All environment variables are set correctly
- [ ] No hardcoded credentials in code
- [ ] `.env` files are in `.gitignore`
- [ ] Firebase credentials are secure
- [ ] Database has SSL enabled
- [ ] CORS is configured properly
- [ ] Rate limiting is implemented
- [ ] Input validation on all forms
- [ ] Authentication is working
- [ ] Admin routes are protected
- [ ] Security headers are configured

### Post-Deployment

- [ ] HTTPS is enforced
- [ ] Database backups are configured
- [ ] Monitoring is set up
- [ ] Error tracking is working
- [ ] Logs are being collected
- [ ] Performance monitoring is active
- [ ] Security updates are scheduled

### Regular Maintenance

- [ ] Review and rotate secrets every 90 days
- [ ] Update dependencies monthly
- [ ] Check for security vulnerabilities (`npm audit`)
- [ ] Review access logs weekly
- [ ] Test backup restore procedures monthly
- [ ] Review Firebase security rules quarterly

---

## 🚨 Security Incident Response

### If Security Breach Occurs:

1. **Immediate Actions**
   - Rotate all secrets immediately
   - Review access logs
   - Disable compromised accounts
   - Notify affected users

2. **Investigation**
   - Determine scope of breach
   - Identify entry point
   - Document timeline

3. **Remediation**
   - Patch vulnerability
   - Restore from backups if needed
   - Implement additional security measures

4. **Post-Incident**
   - Write incident report
   - Update security procedures
   - Train team on lessons learned

---

## 📞 Report Security Issues

Jika Anda menemukan vulnerability:

- ⚠️ **JANGAN** buat public issue di GitHub
- 📧 Email ke: security@yourdomain.com (atau buat private security advisory di GitHub)
- 🔒 Gunakan PGP untuk komunikasi sensitive

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**Stay Secure! 🔒**
