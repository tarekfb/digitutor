# Mindic
## Gen types with
* supabase gen types typescript --project-id "$PROJECT_REF" > src/supabase.ts
### Gen types locally with
* supabase gen types typescript --local > src/supabase.ts

### Migrate with
* supabase migration new <insert-name-here>
* paste migration into new sql file, or 'supabase db diff -f insert_name_of_migration' for automatic diff
* commit and push, and upon merge will be handled by cicd
* to test locally, run supabase db reset
