set check_function_bodies = off;

create or replace view "public"."student_credit_balances" as  SELECT credit_transactions.student,
    COALESCE(sum(credit_transactions.amount), (0)::real) AS balance
   FROM credit_transactions
  GROUP BY credit_transactions.student;
