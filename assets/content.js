/* Dizzah Media content layer: shared public configuration and editorial fallback. */
(function () {
  const fallbackPosts = [
    {
      id: "welcome-dizzah-media",
      title: "Karibu Dizzah Media — Sauti za Tanzania kwa Dunia",
      category: "News",
      image_url: "assets/news1.jpg",
      description: "Dizzah Media ni jukwaa la habari, simulizi na ubunifu linalounganisha Tanzania, Afrika na dunia.",
      body: "Dizzah Media inaanza safari yake ya kujenga newsroom na studio ya maudhui yenye mtazamo wa kimataifa. Kupitia habari, simulizi, video, podcasts na Dizzah Originals, tunalenga kuleta sauti zenye maana kwa hadhira ya Tanzania, Afrika na dunia.",
      author: "Dizzah Media Editorial",
      created_at: "2026-09-19T08:00:00Z",
      video_url: ""
    },
    {
      id: "tanzania-africa-world",
      title: "Tanzania → Africa → World: Dira ya Dizzah Media",
      category: "Feature",
      image_url: "assets/news2.jpg",
      description: "Kwa nini hadithi za ndani zina nafasi kubwa katika mazungumzo ya kimataifa.",
      body: "Tunatengeneza maudhui yanayoanzia kwenye uhalisia wa Tanzania na kuzungumza na hadhira pana. Ubora wa utafiti, uandishi, picha na sauti ndiyo msingi wa kazi zetu.",
      author: "Dizzah Media Editorial",
      created_at: "2026-09-18T08:00:00Z",
      video_url: ""
    },
    {
      id: "every-life-has-a-story",
      title: "Kila Maisha Ina Story: Simulizi Tunazotaka Kuleta Mbele",
      category: "Simulizi",
      image_url: "assets/simulizi.jpg",
      description: "Hadithi za watu, changamoto, ndoto na safari za mafanikio zinazoigusa jamii.",
      body: "Dizzah Stories inalenga kuwapa nafasi watu na jamii ambao simulizi zao zinaweza kuelimisha, kuburudisha na kuhamasisha. Tunatafuta ukweli, utu na mtazamo mpya katika kila story.",
      author: "Dizzah Media Stories",
      created_at: "2026-09-17T08:00:00Z",
      video_url: ""
    }
  ];

  window.DizzahContent = {
    supabaseUrl: "https://otmejtcequreccarwvkt.supabase.co",
    supabaseKey: "sb_publishable_9vUQ1lhAWELSbSGrk7Aw_Q_0h0-WvuX",
    fallbackPosts,
    normalize(posts) {
      const seen = new Set();
      return (posts || []).filter((post) => {
        const key = post.id || `${post.title || ""}-${post.created_at || ""}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },
    async getPosts() {
      if (!window.supabase || !window.supabase.createClient) return fallbackPosts;
      try {
        const client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        const { data, error } = await client.from("posts").select("id,title,category,image_url,video_url,description,body,author,created_at").order("created_at", { ascending: false });
        if (error || !data || !data.length) return fallbackPosts;
        return this.normalize(data);
      } catch (error) {
        console.warn("Dizzah content fallback:", error);
        return fallbackPosts;
      }
    }
  };
})();
