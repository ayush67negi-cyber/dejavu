-- DEJAVU — 0003 seed reference data

insert into public.membership_plans (id, name, duration_months, price_inr, description, sort_order) values
  ('monthly',    'One Month',   1, 1999, 'Four curated Sunday dining experiences. A quiet way to begin.', 1),
  ('quarterly',  'Three Months', 3, 4999, 'Twelve potential tables. Enough time for real rhythms to form.', 2),
  ('biannual',   'Six Months',   6, 8999, 'The long table. For people who intend to stay.', 3)
on conflict (id) do nothing;

insert into public.table_categories (slug, name, tagline, description, accent, sort_order, image_url) values
  ('mixed','Mixed','Different perspectives, one table','A table full of different perspectives, personalities and experiences. The classic DEJAVU configuration — deliberately unalike people who turn out to have plenty to say.','#C4172F',1,null),
  ('creators','Creators','For people who make things','For curious minds, designers, writers, artists and people who enjoy creating. Bring a half-finished idea; leave with three new angles on it.','#E2571E',2,null),
  ('founders','Founders','Ambitious people, unhurried dinner','Entrepreneurs, professionals and ambitious people who enjoy exchanging ideas. No pitching. Just the parts of building something that nobody puts on a slide.','#3D0A18',3,null),
  ('book-club','Book Club','A table with a reading list','For people who love books, ideas and thoughtful discussions. One book is suggested; reading it is optional, having an opinion is not.','#69734F',4,null),
  ('foodies','Foodies','Order for the table','For people who believe exploring food is an experience. Shared plates, unfamiliar menus, and a conversation that starts with what is on the table.','#B8451B',5,null),
  ('new-here','New Here','For recent arrivals','For people who have moved cities, want to expand their circle or simply want to meet new people. Everyone at the table is in the same chapter.','#C98A91',6,null),
  ('after-hours','After Hours','An evening worth remembering','Relaxed conversations, interesting people and an evening worth remembering. Later seating, lower lighting, longer conversations.','#1C1512',7,null),
  ('her-table','Her Table','A women-focused table','A women-focused social dining experience. A considered space for women to meet, talk freely and build a circle that lasts past dessert.','#5A0F22',8,null)
on conflict (slug) do nothing;
