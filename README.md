# Mindic
## Gen types with
supabase gen types typescript --project-id "$PROJECT_REF" > src/supabase.ts

### Migrate with
* supabase migration new <insert-name-here>
* paste migration into new sql file
* commit and push, and upon merge will be handled by cicd