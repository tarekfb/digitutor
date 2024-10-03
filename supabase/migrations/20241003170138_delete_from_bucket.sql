create policy "User can delete their own objects"
on storage.objects
for delete
TO authenticated
USING (
    owner = (select auth.uid())
);