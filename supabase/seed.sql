-- Insert additional users into auth.users table (2 teachers and 5 students)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES
    ('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440000', 'authenticated', 'authenticated', 'alice@example.com', crypt('asdasdasd', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440010', 'authenticated', 'authenticated', 'bob@example.com', crypt('asdasdasd', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440020', 'authenticated', 'authenticated', 'carol@example.com', crypt('asdasdasd', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440030', 'authenticated', 'authenticated', 'dave@example.com', crypt('asdasdasd', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440040', 'authenticated', 'authenticated', 'eve@example.com', crypt('asdasdasd', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440050', 'authenticated', 'authenticated', 'frank@example.com', crypt('asdasdasd', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440060', 'authenticated', 'authenticated', 'grace@example.com', crypt('asdasdasd', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440070', 'authenticated', 'authenticated', 'heidi@example.com', crypt('asdasdasd', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', '');

-- Insert corresponding identities into auth.identities table
INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440000', '{"sub":"550e8400-e29b-41d4-a716-446655440000","email":"alice@example.com"}'::jsonb, 'email', '00000000-0000-0000-0000-000000000001', current_timestamp, current_timestamp, current_timestamp),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440010', '{"sub":"550e8400-e29b-41d4-a716-446655440010","email":"bob@example.com"}'::jsonb, 'email', '00000000-0000-0000-0000-000000000002', current_timestamp, current_timestamp, current_timestamp),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440020', '{"sub":"550e8400-e29b-41d4-a716-446655440020","email":"carol@example.com"}'::jsonb, 'email', '00000000-0000-0000-0000-000000000003', current_timestamp, current_timestamp, current_timestamp),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440030', '{"sub":"550e8400-e29b-41d4-a716-446655440030","email":"dave@example.com"}'::jsonb, 'email', '00000000-0000-0000-0000-000000000004', current_timestamp, current_timestamp, current_timestamp),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440040', '{"sub":"550e8400-e29b-41d4-a716-446655440040","email":"eve@example.com"}'::jsonb, 'email', '00000000-0000-0000-0000-000000000005', current_timestamp, current_timestamp, current_timestamp),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440050', '{"sub":"550e8400-e29b-41d4-a716-446655440050","email":"frank@example.com"}'::jsonb, 'email', '00000000-0000-0000-0000-000000000006', current_timestamp, current_timestamp, current_timestamp),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440060', '{"sub":"550e8400-e29b-41d4-a716-446655440060","email":"grace@example.com"}'::jsonb, 'email', '00000000-0000-0000-0000-000000000007', current_timestamp, current_timestamp, current_timestamp),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440070', '{"sub":"550e8400-e29b-41d4-a716-446655440070","email":"heidi@example.com"}'::jsonb, 'email', '00000000-0000-0000-0000-000000000008', current_timestamp, current_timestamp, current_timestamp);

-- Insert additional profiles into public.profiles table
INSERT INTO public.profiles (id, first_name, last_name, role, created_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Alice', 'Anderson', 'teacher', NOW()),
    ('550e8400-e29b-41d4-a716-446655440010', 'Bob', 'Brown', 'teacher', NOW()),
    ('550e8400-e29b-41d4-a716-446655440020', 'Carol', 'Clark', 'student', NOW()),
    ('550e8400-e29b-41d4-a716-446655440030', 'Dave', 'Developer', 'teacher', NOW()),
    ('550e8400-e29b-41d4-a716-446655440040', 'Eve', 'Evans', 'student', NOW()),
    ('550e8400-e29b-41d4-a716-446655440050', 'Frank', 'Foster', 'student', NOW()),
    ('550e8400-e29b-41d4-a716-446655440060', 'Grace', 'Green', 'student', NOW()),
    ('550e8400-e29b-41d4-a716-446655440070', 'Heidi', 'Hoover', 'student', NOW());

-- Insert additional listings for new teachers
INSERT INTO public.listings (
    id, title, description, subjects, hourly_price, currency, profile, visible
) VALUES
    ('550e8400-e29b-41d4-a716-446655440080', 'Python Tutoring', 'Python for beginners', '{1}', 60, 'SEK', '550e8400-e29b-41d4-a716-446655440000', TRUE),
    ('550e8400-e29b-41d4-a716-446655440090', 'Java Tutoring', 'Java for intermediate learners', '{1}', 70, 'SEK', '550e8400-e29b-41d4-a716-446655440010', TRUE);

-- Insert additional reviews to ensure each teacher has at least 5 reviews
INSERT INTO public.reviews (id, sender, receiver, rating, description) VALUES
    -- Reviews for Alice
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', 5, 'Alice is fantastic!'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440000', 4, 'Alice is knowledgeable.'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440000', 5, 'Excellent teacher.'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440000', 5, 'Learned a lot from Alice.'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440000', 4, 'Good teacher, but sometimes unclear.'),

    -- Reviews for Bob
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 5, 'Bob is a great tutor!'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440010', 5, 'Very helpful and patient.'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440010', 4, 'Bob is good, but could explain more.'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440010', 5, 'Highly recommend Bob.'),
    (uuid_generate_v4(), '550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440010', 5, 'Bob made learning fun.');

