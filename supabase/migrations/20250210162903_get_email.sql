set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_email_by_id(id uuid)
 RETURNS TABLE(email character varying)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY SELECT au.email FROM auth.users au WHERE au.id = $1;
END;
$function$
;


