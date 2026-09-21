"use strict";

window.DizzahData = (() => {
  const SUPABASE_URL = "https://otmejtcequreccarwvkt.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9vUQ1lhAWELSbSGrk7Aw_Q_0h0-WvuX";

  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("sw-TZ", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  const fallbackImage = "assets/news1.jpg";

  async function getClient() {
    if (!window.supabase?.createClient) throw new Error("Supabase SDK haijapakiwa.");
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }

  async function fetchPosts() {
    const client = await getClient();
    const { data, error } = await client.from("posts")
      .select("id,title,category,image_url,video_url,description,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  function imageFor(post) {
    return post?.image_url && String(post.image_url).trim() ? post.image_url : fallbackImage;
  }

  return { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, escapeHTML, formatDate, fallbackImage, fetchPosts, imageFor, getClient };
})();
