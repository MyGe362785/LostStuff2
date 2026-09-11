-- Keep the seeded examples, but present them as ordinary lost-and-found items.
update public.items
set
  title_th = regexp_replace(title_th, '^\[ข้อมูลเดโม\][[:space:]]*', ''),
  description_th = regexp_replace(
    description_th,
    '^ข้อมูลเดโมสำหรับสาธิตเท่านั้น:[[:space:]]*',
    ''
  ),
  distinctive_marks = nullif(
    regexp_replace(
      coalesce(distinctive_marks, ''),
      'ข้อมูลเดโมสำหรับสาธิตเท่านั้น:?[[:space:]]*',
      '',
      'g'
    ),
    ''
  )
where title_th like '[ข้อมูลเดโม]%'
   or description_th like 'ข้อมูลเดโมสำหรับสาธิตเท่านั้น:%'
   or distinctive_marks like '%ข้อมูลเดโม%';
