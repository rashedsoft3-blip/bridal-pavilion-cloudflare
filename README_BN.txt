BRIDAL PAVILION — Cloudflare Pages + D1 (Free-tier package)

এটি Supabase/Netlify ব্যবহার করে না। Cloudflare Pages Functions + D1 ব্যবহার করে। ফ্রি প্ল্যানের সীমার মধ্যে থাকলে মাসিক হোস্টিং খরচ ০ হতে পারে; কোনো সেবা চিরকাল/সীমাহীন ফ্রি হবে এমন নিশ্চয়তা নেই।

অত্যন্ত গুরুত্বপূর্ণ:
- ZIP-এ আপনার JSON backup রাখা হয়নি; সেটি আলাদাভাবে নিরাপদে রাখুন।
- Cloudflare account-এ আপনাকেই deployment ও secret তৈরি করতে হবে। এই ZIP তৈরি হয়েছে, কিন্তু আপনার Cloudflare account-এ deploy বা live database test করা হয়নি।
- প্রথমে Cloudflare Pages project-এ এই ফোল্ডার GitHub repository দিয়ে deploy করুন। Direct Upload-এর বদলে Git integration বা Wrangler ব্যবহার করুন, যাতে Functions deploy হয়।
- Cloudflare Dashboard > Workers & Pages > D1 SQL Database থেকে `bridal-pavilion-studio` নামে D1 database তৈরি করুন। `migrations/0001_app_state.sql` SQL Editor-এ চালান।
- Pages project > Settings > Bindings > D1 database binding যোগ করুন: Variable name `DB`, database `bridal-pavilion-studio`। Wrangler ব্যবহার করলে `wrangler.toml`-এর `database_id`-তে আসল ID বসান।
- Pages project > Settings > Variables and Secrets-এ `BP_APP_PASSWORD` এবং `BP_SESSION_SECRET` নামে Secret যোগ করুন। BP_APP_PASSWORD হবে আপনার নিজের শক্তিশালী Studio login password। BP_SESSION_SECRET হবে আলাদা দীর্ঘ random secret। দুটোই secret হিসেবে রাখুন, chat বা public GitHub-এ দেবেন না।
- Deploy/redeploy করুন।
- প্রথমবার শুধু PC-তে `/setup.html` খুলে Studio password দিন এবং সর্বশেষ BRIDAL PAVILION JSON backup import করুন। Import success দেখালে `/` খুলুন। Backup import endpoint শুধু খালি database-এ import করে, বিদ্যমান data replace করে না।
- তারপর Mobile-এ একই site খুলে একই Studio password দিয়ে Login করুন।

ডেটা আচরণ ও সতর্কতা:
- অ্যাপ প্রতি পরিবর্তনে Cloudflare D1-তে snapshot sync করে; অন্য ডিভাইসের update প্রায় ২০ সেকেন্ডের মধ্যে দেখা/refresh হতে পারে।
- একসাথে দুই ডিভাইসে একই সময়ে edit করলে revision conflict দেখাবে, যাতে নীরবে অন্য ডিভাইসের ডেটা মুছে না যায়। Reload করে cloud version নিন এবং প্রয়োজন হলে local backup export করুন।
- Google Calendar integration আলাদা Google OAuth credentials চাইতে পারে। এই migration Google Calendar সেটিংসকে নতুন করে configure করে না।
- Live deployment-এর আগে test data দিয়ে login, save, refresh, PC/mobile sync, backup export/import পরীক্ষা করুন।
