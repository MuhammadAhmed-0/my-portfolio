const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const CONTENT_DIR = path.join(__dirname, "..", "content", "blog");
const OUTPUT_DIR = path.join(__dirname, "..", "blog");
const ROOT_DIR = path.join(__dirname, "..");

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function estimateReadTime(content) {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
}

function getCategorySlug(category) {
    const map = {
        SEO: "seo",
        PPC: "ppc",
        "Content Marketing": "content",
        "Web Development": "web-dev",
    };
    return map[category] || category.toLowerCase().replace(/\s+/g, "-");
}

function generateExcerpt(body, maxLen = 160) {
    const text = body
        .replace(/[#*_\[\]()>`~\-]/g, "")
        .replace(/\n+/g, " ")
        .trim();
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

function buildPostHTML(data, htmlContent) {
    const date = formatDate(data.date);
    const readTime = estimateReadTime(data.body || "");
    const categorySlug = getCategorySlug(data.category || "SEO");
    const canonical = `/blog/${data.slug}.html`;
    const featuredImageAlt = data.featuredImageAlt || data.title;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.metaTitle || data.title}</title>
    <meta name="description" content="${data.metaDescription || data.excerpt || ""}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:title" content="${data.metaTitle || data.title}">
    <meta property="og:description" content="${data.metaDescription || data.excerpt || ""}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${data.featuredImage || ""}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${data.metaTitle || data.title}">
    <meta name="twitter:description" content="${data.metaDescription || data.excerpt || ""}">
    <meta name="twitter:image" content="${data.featuredImage || ""}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="../blog.css">
</head>
<body>
    <nav class="navbar" id="navbar">
        <div class="container nav-container">
            <a href="../index.html" class="logo">Muhammad<span class="logo-accent">Ahmed</span></a>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                <span></span><span></span><span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="../index.html" class="nav-link">Home</a></li>
                <li><a href="../index.html#services" class="nav-link">Services</a></li>
                <li><a href="../index.html#case-studies" class="nav-link">Case Studies</a></li>
                <li><a href="./index.html" class="nav-link">Blog</a></li>
                <li><a href="../index.html#contact" class="nav-link nav-cta">Get Started</a></li>
            </ul>
        </div>
    </nav>

    <article>
        <header class="blog-post-header">
            <div class="container blog-post-container">
                <a href="./index.html" class="post-back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Blog
                </a>
                <span class="post-category">${data.category || "SEO"}</span>
                <h1 class="post-title">${data.title}</h1>
                <div class="post-meta">
                    <span class="post-meta-item">${date}</span>
                    <span class="post-meta-item">${readTime}</span>
                </div>
            </div>
        </header>

        <section class="blog-post-content">
            <div class="container">
                <div class="post-featured-image has-image">
                    <img src="${data.featuredImage || ""}" alt="${featuredImageAlt}">
                </div>
                <div class="post-content">
                    ${htmlContent}

                    <div class="post-cta">
                        <h3>Ready to Grow Your Business?</h3>
                        <p>Let's discuss how I can help implement these strategies for your business</p>
                        <a href="../index.html#contact" class="btn btn-primary">Get Free Consultation</a>
                    </div>
                </div>
            </div>
        </section>
    </article>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-about">
                    <h3 class="footer-logo">Muhammad<span class="logo-accent">Ahmed</span></h3>
                    <p>Digital Marketing Specialist helping businesses grow through strategic SEO, PPC, content marketing, and web development.</p>
                </div>
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="../index.html#services">Services</a></li>
                        <li><a href="../index.html#case-studies">Case Studies</a></li>
                        <li><a href="./index.html">Blog</a></li>
                        <li><a href="../index.html#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-services">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="../index.html#services">SEO Optimization</a></li>
                        <li><a href="../index.html#services">PPC Campaigns</a></li>
                        <li><a href="../index.html#services">Content Writing</a></li>
                        <li><a href="../index.html#services">Web Development</a></li>
                    </ul>
                </div>
                <div class="footer-social">
                    <h4>Connect With Me</h4>
                    <div class="social-links">
                        <a href="#" aria-label="LinkedIn" class="social-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                        <a href="#" aria-label="Twitter" class="social-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                        <a href="#" aria-label="Facebook" class="social-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom"><p>&copy; 2025 Muhammad Ahmed. All rights reserved.</p></div>
        </div>
    </footer>
    <script>
        const navbar = document.getElementById('navbar');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
        mobileMenuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    </script>
</body>
</html>`;
}

function buildListingHTML(posts) {
    const sortedPosts = posts.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
    );

    const cardsHTML = sortedPosts
        .map((post) => {
            const date = formatDate(post.date);
            const readTime = estimateReadTime(post.body || "");
            const excerpt = post.excerpt || generateExcerpt(post.body || "");
            const categorySlug = getCategorySlug(post.category || "SEO");
            const featuredImageAlt = post.featuredImageAlt || post.title;

            return `
                <div class="blog-card" data-category="${categorySlug}">
                    <div class="blog-image" style="background: none; padding: 0;">
                        <img src="${post.featuredImage || ""}" alt="${featuredImageAlt}" style="width: 100%; height: 200px; object-fit: cover;">
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span>${date}</span>
                            <span>&bull;</span>
                            <span>${readTime}</span>
                        </div>
                        <h3 class="blog-title">${post.title}</h3>
                        <p class="blog-excerpt">${excerpt}</p>
                        <a href="/blog/${post.slug}.html" class="blog-read-more">
                            Read More
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>`;
        })
        .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Digital Marketing Blog by Muhammad Ahmed - Expert insights on SEO, PPC, Content Marketing, and Web Development strategies.">
    <meta name="keywords" content="Digital Marketing Blog, SEO Tips, PPC Strategies, Content Marketing, Web Development">
    <title>Blog - Muhammad Ahmed | Digital Marketing Insights</title>
    <link rel="canonical" href="/blog/">
    <meta property="og:title" content="Blog - Muhammad Ahmed | Digital Marketing Insights">
    <meta property="og:description" content="Digital Marketing Blog by Muhammad Ahmed - Expert insights on SEO, PPC, Content Marketing, and Web Development strategies.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="/blog/">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Blog - Muhammad Ahmed | Digital Marketing Insights">
    <meta name="twitter:description" content="Digital Marketing Blog by Muhammad Ahmed - Expert insights on SEO, PPC, Content Marketing, and Web Development strategies.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="../blog.css">
</head>
<body>
    <nav class="navbar" id="navbar">
        <div class="container nav-container">
            <a href="../index.html" class="logo">Muhammad<span class="logo-accent">Ahmed</span></a>
            <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="../index.html" class="nav-link">Home</a></li>
                <li><a href="../index.html#services" class="nav-link">Services</a></li>
                <li><a href="../index.html#case-studies" class="nav-link">Case Studies</a></li>
                <li><a href="./index.html" class="nav-link active">Blog</a></li>
                <li><a href="../index.html#contact" class="nav-link nav-cta">Get Started</a></li>
            </ul>
        </div>
    </nav>

    <section class="blog-header">
        <div class="container">
            <h1 class="page-title">Digital Marketing <span class="gradient-text">Insights</span></h1>
            <p class="page-description">Stay ahead with expert tips, strategies, and industry trends</p>
        </div>
    </section>

    <section class="blog-section">
        <div class="container">
            <div class="blog-filters">
                <button class="filter-btn active" data-category="all">All Articles</button>
                <button class="filter-btn" data-category="seo">SEO</button>
                <button class="filter-btn" data-category="ppc">PPC</button>
                <button class="filter-btn" data-category="content">Content Marketing</button>
                <button class="filter-btn" data-category="web-dev">Web Development</button>
            </div>
            <div class="blog-grid" id="blogGrid">
${cardsHTML}
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-about">
                    <h3 class="footer-logo">Muhammad<span class="logo-accent">Ahmed</span></h3>
                    <p>Digital Marketing Specialist helping businesses grow through strategic SEO, PPC, content marketing, and web development.</p>
                </div>
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="../index.html#services">Services</a></li>
                        <li><a href="../index.html#case-studies">Case Studies</a></li>
                        <li><a href="./index.html">Blog</a></li>
                        <li><a href="../index.html#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-services">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="../index.html#services">SEO Optimization</a></li>
                        <li><a href="../index.html#services">PPC Campaigns</a></li>
                        <li><a href="../index.html#services">Content Writing</a></li>
                        <li><a href="../index.html#services">Web Development</a></li>
                    </ul>
                </div>
                <div class="footer-social">
                    <h4>Connect With Me</h4>
                    <div class="social-links">
                        <a href="#" aria-label="LinkedIn" class="social-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                        <a href="#" aria-label="Twitter" class="social-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                        <a href="#" aria-label="Facebook" class="social-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom"><p>&copy; 2025 Muhammad Ahmed. All rights reserved.</p></div>
        </div>
    </footer>

    <script>
        const navbar = document.getElementById('navbar');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
        mobileMenuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });

        const filterButtons = document.querySelectorAll('.filter-btn');
        const blogCards = document.querySelectorAll('.blog-card');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.getAttribute('data-category');
                blogCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    </script>
</body>
</html>`;
}

function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    if (!fs.existsSync(CONTENT_DIR)) {
        console.log("No content/blog directory found. Creating it...");
        fs.mkdirSync(CONTENT_DIR, { recursive: true });
        console.log(
            "No blog posts to generate. Add markdown files to content/blog/",
        );
        return;
    }

    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

    if (files.length === 0) {
        console.log("No markdown files found in content/blog/");
        return;
    }

    console.log(`Found ${files.length} blog post(s). Generating...`);

    const allPosts = [];

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);

        if (!data.slug) {
            data.slug = file.replace(".md", "");
        }

        data.body = content;

        const htmlContent = marked(content);
        const postHTML = buildPostHTML(data, htmlContent);
        const outputPath = path.join(OUTPUT_DIR, `${data.slug}.html`);

        fs.writeFileSync(outputPath, postHTML, "utf-8");
        console.log(`  Generated: blog/${data.slug}.html`);

        allPosts.push(data);
    }

    const listingHTML = buildListingHTML(allPosts);
    const listingPath = path.join(OUTPUT_DIR, "index.html");
    fs.writeFileSync(listingPath, listingHTML, "utf-8");
    console.log(
        `  Generated: blog/index.html (listing page with ${allPosts.length} posts)`,
    );

    updateHomepageBlogPreview(allPosts);

    const SITE_URL = "https://muhammadahmed.pages.dev";
    updateSitemap(allPosts, SITE_URL);

    console.log("\nBuild complete!");
}

function updateHomepageBlogPreview(posts) {
    const scriptPath = path.join(ROOT_DIR, "script.js");
    if (!fs.existsSync(scriptPath)) {
        console.log(
            "  Skipped: script.js not found, cannot update homepage blog preview",
        );
        return;
    }

    let scriptContent = fs.readFileSync(scriptPath, "utf-8");

    const sortedPosts = posts.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
    );

    const postsArray = sortedPosts
        .map((post, i) => {
            const date = formatDate(post.date);
            const readTime = estimateReadTime(post.body || "");
            const excerpt = (post.excerpt || generateExcerpt(post.body || ""))
                .replace(/\n/g, " ")
                .trim();
            const featuredImage = post.featuredImage || "";

            return `    {
        id: ${i + 1},
        title: ${JSON.stringify(post.title)},
        excerpt: ${JSON.stringify(excerpt)},
        category: ${JSON.stringify(post.category || "SEO")},
        date: ${JSON.stringify(date)},
        readTime: ${JSON.stringify(readTime)},
        icon: "",
        featuredImage: ${JSON.stringify(featuredImage)},
        slug: ${JSON.stringify(post.slug)}
    }`;
        })
        .join(",\n");

    const newArray = `const blogPosts = [\n${postsArray}\n];`;

    const arrayRegex = /const blogPosts = \[[\s\S]*?\];/;
    if (arrayRegex.test(scriptContent)) {
        scriptContent = scriptContent.replace(arrayRegex, newArray);
    } else {
        console.log("  Warning: Could not find blogPosts array in script.js");
        return;
    }

    fs.writeFileSync(scriptPath, scriptContent, "utf-8");
    console.log(
        `  Updated: script.js (homepage blog preview with ${sortedPosts.length} posts)`,
    );
}

function updateSitemap(posts, siteUrl) {
    const sitemapPath = path.join(ROOT_DIR, "sitemap.xml");
    let existingUrls = new Map();

    if (fs.existsSync(sitemapPath)) {
        const existing = fs.readFileSync(sitemapPath, "utf-8");
        const urlRegex =
            /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]*)<\/lastmod>(?:\s*<changefreq>([^<]*)<\/changefreq>)?(?:\s*<priority>([^<]*)<\/priority>)?\s*<\/url>/g;
        let match;
        while ((match = urlRegex.exec(existing)) !== null) {
            existingUrls.set(match[1], {
                loc: match[1],
                lastmod: match[2],
                changefreq: match[3] || "monthly",
                priority: match[4] || "0.5",
            });
        }
    }

    for (const post of posts) {
        const postUrl = `${siteUrl}/blog/${post.slug}.html`;
        const lastmod = new Date(post.date).toISOString().split("T")[0];
        existingUrls.set(postUrl, {
            loc: postUrl,
            lastmod: lastmod,
            changefreq: "monthly",
            priority: "0.8",
        });
    }

    const blogIndexUrl = `${siteUrl}/blog/`;
    existingUrls.set(blogIndexUrl, {
        loc: blogIndexUrl,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: "0.9",
    });

    if (!existingUrls.has(`${siteUrl}/`)) {
        existingUrls.set(`${siteUrl}/`, {
            loc: `${siteUrl}/`,
            lastmod: new Date().toISOString().split("T")[0],
            changefreq: "weekly",
            priority: "1.0",
        });
    }

    const urlEntries = Array.from(existingUrls.values())
        .map(
            (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
        )
        .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    fs.writeFileSync(sitemapPath, sitemap, "utf-8");
    console.log(`  Updated: sitemap.xml (${existingUrls.size} URLs)`);
}

main();
