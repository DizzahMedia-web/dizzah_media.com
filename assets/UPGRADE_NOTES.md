# Dizzah Media — Upgrade Notes

## Awamu ya kwanza: newsroom foundation

Marekebisho haya yamefanywa ndani ya website iliyopo bila kuanza upya. Homepage imeunganishwa na shared content layer yenye fallback editorial posts, hivyo haibaki tupu wakati database haipatikani. News page sasa inazuia duplicate posts, inaonyesha author/date, na kila post inafungua `article.html?id=...` yenye article body, metadata, related stories na share links.

Search page sasa inatumia content layer hiyo hiyo, inatafuta kwa title/category/description, inaheshimu filters, na kila result inaenda kwenye article yake. Logo references zilizokuwa zikielekea kwenye file lisilokuwepo zimehamishwa kwenye `assets/logo-nav.png`, ambayo ni PNG halisi na inafanya kazi kwenye GitHub Pages.

## Mfumo uliopo uliolindwa

Supabase na admin dashboard havijaondolewa. `content.js` hutumia Supabase inapopatikana na huangukia kwenye editorial fallback inapokuwa na error au hakuna posts. Hii inalinda public experience wakati schema, RLS policy au network ya Supabase bado inarekebishwa.

## Awamu inayofuata ya production

1. Kuweka schema ya mwisho ya posts: `slug`, `body`, `author`, `status`, `featured`, `published_at`, `updated_at`.
2. Kuongeza rich-text editor, draft/publish workflow na image upload kwenye admin.
3. Kuunganisha Contact na newsletter forms kwenye endpoint salama yenye spam protection.
4. Kuongeza `sitemap.xml`, `robots.txt`, RSS/Atom feed, structured data na social preview images.
5. Kuweka analytics, editorial roles, audit log na custom domain yenye HTTPS.

> Usalama: publishable Supabase key inaweza kuwa public kwa frontend, lakini service-role key, admin secrets na credentials hazipaswi kuwekwa kwenye HTML/JavaScript.
