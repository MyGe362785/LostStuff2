-- Insert privileges are intentionally kept off the client roles. This RPC creates
-- an item and its private contact atomically after checking the authenticated user.
create or replace function public.create_item_with_contact(
  p_type public.item_type,
  p_category text,
  p_title_th text,
  p_title_en text,
  p_description_th text,
  p_description_en text,
  p_color text,
  p_brand text,
  p_distinctive_marks text,
  p_building_id text,
  p_location_detail_th text,
  p_location_detail_en text,
  p_occurred_on date,
  p_occurred_time_range text,
  p_handover_point_th text,
  p_handover_point_en text,
  p_contact text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_item_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  insert into public.items (
    owner_id, type, status, category, title_th, title_en, description_th, description_en,
    color, brand, distinctive_marks, building_id, location_detail_th, location_detail_en,
    occurred_on, occurred_time_range, handover_point_th, handover_point_en
  ) values (
    auth.uid(), p_type, 'pending_review', p_category, p_title_th, p_title_en, p_description_th, p_description_en,
    p_color, p_brand, p_distinctive_marks, p_building_id, p_location_detail_th, p_location_detail_en,
    p_occurred_on, p_occurred_time_range, p_handover_point_th, p_handover_point_en
  ) returning id into new_item_id;

  insert into public.item_contacts (item_id, contact) values (new_item_id, p_contact);
  return new_item_id;
end;
$$;

revoke all on function public.create_item_with_contact(
  public.item_type, text, text, text, text, text, text, text, text, text, text, text,
  date, text, text, text, text
) from public;

grant execute on function public.create_item_with_contact(
  public.item_type, text, text, text, text, text, text, text, text, text, text, text,
  date, text, text, text, text
) to authenticated;
