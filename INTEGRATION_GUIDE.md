# Main Website Integration Guide

This guide explains how to integrate the Medical Research Assistant webapp into your main website at https://www.medresearch-academy.om/resources

## Integration Options

### Option 1: Direct Link (Recommended)

The simplest and most reliable approach is to link directly to the hosted webapp.

**Advantages:**
- No CORS or iframe issues
- Full functionality guaranteed
- Easy to maintain
- Better SEO
- Better user experience (full browser window)

**Implementation:**
Add a prominent link/button on your resources page:

```html
<a href="https://your-domain.manus.space" 
   target="_blank" 
   rel="noopener noreferrer"
   class="btn btn-primary">
  Launch Medical Research Assistant →
</a>
```

Or for a more integrated look:

```html
<div class="resource-card">
  <h3>Medical Research Assistant</h3>
  <p>Comprehensive research tools for early-career medical researchers</p>
  <ul>
    <li>Sample Size Calculator</li>
    <li>Study Type Wizard</li>
    <li>AI Proposal Writer</li>
    <li>Research Chatbot</li>
    <li>And 4 more tools...</li>
  </ul>
  <a href="https://your-domain.manus.space" 
     target="_blank" 
     class="btn">Access Tools →</a>
</div>
```

---

### Option 2: Iframe Embedding

If you prefer to embed the webapp directly in your page, you can use an iframe.

**Advantages:**
- Users stay on your domain
- Integrated experience

**Disadvantages:**
- Potential CORS issues
- Limited screen space
- Some features may not work in iframe context
- Authentication may be affected

**Implementation:**

1. **Add CORS configuration** (if needed):
   Contact Manus support to whitelist your domain for iframe embedding.

2. **Embed the iframe:**

```html
<iframe 
  src="https://your-domain.manus.space"
  width="100%"
  height="800px"
  frameborder="0"
  allow="clipboard-write; clipboard-read"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
  title="Medical Research Assistant">
</iframe>
```

3. **Responsive styling:**

```css
.research-assistant-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 aspect ratio */
  height: 0;
  overflow: hidden;
}

.research-assistant-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

### Option 3: Custom Domain

For the most professional integration, use a custom subdomain.

**Example:**
- Main site: `https://www.medresearch-academy.om`
- Research tools: `https://tools.medresearch-academy.om`

**Advantages:**
- Professional branding
- Seamless user experience
- No iframe limitations
- Full control

**Implementation:**
1. Go to Manus Dashboard → Settings → Domains
2. Click "Add Custom Domain"
3. Enter your subdomain: `tools.medresearch-academy.om`
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (automatic)

---

## Branding Consistency

To ensure the webapp matches your main website:

1. **Logo**: Update `VITE_APP_LOGO` in Settings → Secrets
2. **Title**: Update `VITE_APP_TITLE` in Settings → Secrets
3. **Colors**: The app uses a professional medical theme with blue accents
4. **Navigation**: The app has its own navigation optimized for the research tools

---

## User Authentication

The webapp uses Manus OAuth for authentication:
- Users create accounts with email/password
- Sessions persist across visits
- User data is stored securely in MySQL database
- Each user can save and manage their own research projects

**Note:** Users will need to create separate accounts for the research assistant (not linked to your main website accounts unless you implement SSO).

---

## Feedback Collection

The webapp includes a built-in feedback system for the trial phase:

- **Floating feedback button** on all pages (blue chat bubble, bottom-right)
- **5-star rating system** for user satisfaction
- **Categories**: Bug Report, Feature Request, General Feedback
- **Email notifications** sent to Dr.Abdullahalalawi@gmail.com
- **Admin dashboard** at `/admin/feedback` to view all submissions

**Admin Access:**
To view feedback, you need admin role:
1. Sign in to the webapp
2. Go to Manus Dashboard → Database
3. Find your user in the `user` table
4. Change `role` from `user` to `admin`
5. Refresh the webapp
6. Navigate to `/admin/feedback`

---

## Analytics & Monitoring

The webapp includes built-in analytics:
- Page views tracked automatically
- User engagement metrics
- View in Manus Dashboard → Dashboard panel

---

## Support & Maintenance

**Hosting:** The webapp is hosted on Manus platform with:
- Automatic SSL certificates
- 99.9% uptime
- Automatic backups
- Built-in CDN

**Updates:** All code is synced with GitHub repository:
- Push changes to GitHub
- Changes automatically deploy to Manus
- Rollback available via Manus Dashboard

**Database:** MySQL/TiDB with:
- Automatic backups
- Connection details in Dashboard → Database → Settings
- Direct SQL access via Manus Dashboard

---

## Testing Checklist

Before going live, test:

- [ ] All 8 research tools work correctly
- [ ] User registration and login
- [ ] Project save/load functionality
- [ ] Feedback submission
- [ ] Email notifications arrive
- [ ] PDF/Word export features
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

---

## Recommended Integration Approach

For https://www.medresearch-academy.om/resources, we recommend:

1. **Create a dedicated section** on your resources page
2. **Add a prominent card/banner** highlighting the research assistant
3. **Use direct link** (Option 1) for best user experience
4. **Include screenshots** showing the 8 tools
5. **Add testimonials** from trial users (after collecting feedback)

**Example HTML for your resources page:**

```html
<section class="research-assistant-section">
  <div class="container">
    <h2>🔬 Medical Research Assistant</h2>
    <p class="lead">
      Comprehensive research tools designed for early-career medical researchers
    </p>
    
    <div class="tools-grid">
      <div class="tool-card">
        <h4>📊 Sample Size Calculator</h4>
        <p>8 statistical tests with beginner-friendly wizard</p>
      </div>
      <div class="tool-card">
        <h4>🧪 Study Type Wizard</h4>
        <p>Interactive decision tree for study design</p>
      </div>
      <div class="tool-card">
        <h4>📝 AI Proposal Writer</h4>
        <p>IMRAD templates with AI assistance</p>
      </div>
      <div class="tool-card">
        <h4>💬 Research Chatbot</h4>
        <p>LLM-powered Q&A for research guidance</p>
      </div>
      <div class="tool-card">
        <h4>🔍 Statistical Test Selector</h4>
        <p>Interactive flowchart to choose the right test</p>
      </div>
      <div class="tool-card">
        <h4>📚 Literature Search</h4>
        <p>PubMed integration for research papers</p>
      </div>
      <div class="tool-card">
        <h4>💰 Budget Calculator</h4>
        <p>Research budget planning with visualizations</p>
      </div>
      <div class="tool-card">
        <h4>📅 Timeline Planner</h4>
        <p>Gantt chart for project milestones</p>
      </div>
    </div>
    
    <div class="cta-section">
      <a href="https://your-domain.manus.space" 
         target="_blank" 
         rel="noopener noreferrer"
         class="btn btn-lg btn-primary">
        Launch Research Assistant →
      </a>
      <p class="text-muted">
        Free trial period • No credit card required
      </p>
    </div>
  </div>
</section>
```

---

## Questions or Issues?

- **Technical support:** https://help.manus.im
- **Feedback:** Use the in-app feedback button
- **Email:** Dr.Abdullahalalawi@gmail.com

---

## Next Steps

1. Choose your integration method (we recommend Option 1: Direct Link)
2. Update your resources page with the integration code
3. Test the integration thoroughly
4. Monitor feedback submissions during trial phase
5. Collect user testimonials
6. Plan for commercialization (payment integration available when ready)
