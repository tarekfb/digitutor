# Mindic
## Gen types with
* supabase gen types typescript --project-id "$PROJECT_REF" > src/supabase.ts
### Gen types locally with
* supabase gen types typescript --local > src/supabase.ts

## Migrate
* With migration file already existing:
    * commit and push, and upon merge will be handled by cicd
    * to test locally, run supabase db reset
### Manually create migration file
* supabase migration new <insert-name-here>
* paste SQL into new .sql file
### Auto diff migration file
supabase db diff -f insert_name_of_migration 

