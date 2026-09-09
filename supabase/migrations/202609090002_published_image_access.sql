create policy "published item images are readable" on storage.objects
for select using (
  bucket_id = 'loststuff-images'
  and exists (
    select 1 from public.item_images image
    join public.items item on item.id = image.item_id
    where image.storage_path = name and item.status in ('searching', 'pending_confirm', 'returned')
  )
);
