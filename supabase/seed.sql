-- Insert specific users into auth.users table
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
VALUES
    (
        '00000000-0000-0000-0000-000000000000',
        '550e8400-e29b-41d4-a716-446655440000',
        'authenticated',
        'authenticated',
        'alice@example.com',
        crypt('asdasdasd', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        '550e8400-e29b-41d4-a716-446655440010',
        'authenticated',
        'authenticated',
        'bob@example.com',
        crypt('asdasdasd', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    ),
    (
        '00000000-0000-0000-0000-000000000000',
        '550e8400-e29b-41d4-a716-446655440020',
        'authenticated',
        'authenticated',
        'charlie@example.com',
        crypt('asdasdasd', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    );

-- Insert corresponding identities into auth.identities table
INSERT INTO
    auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    )
VALUES
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440000',
        '{"sub":"550e8400-e29b-41d4-a716-446655440000","email":"alice@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000000',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440010',
        '{"sub":"550e8400-e29b-41d4-a716-446655440010","email":"bob@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000001',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440020',
        '{"sub":"550e8400-e29b-41d4-a716-446655440020","email":"charlie@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000002',
        current_timestamp,
        current_timestamp,
        current_timestamp
    );

-- Insert seed data into the profiles table
INSERT INTO
    public.profiles (id, first_name, last_name, role, created_at)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'Alice',
        'Wonderland',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440010',
        'Bob',
        'Builder',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440020',
        'Charlie',
        'Brown',
        'student',
        NOW()
    );

-- Insert seed data into the listings table
INSERT INTO
    public.listings (
        id,
        title,
        description,
        subjects,
        hourly_price,
        currency,
        profile,
        visible
    )
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440003',
        'Javascript Tutoring',
        'Javascript for high school students',
        '{1}',
        50,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440000',
        TRUE
    );

INSERT INTO
    public.listings (
        id,
        title,
        description,
        subjects,
        hourly_price,
        currency,
        profile,
        visible
    )
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440004',
        'React Tutoring',
        'React for high school students',
        '{1}',
        100,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440000',
        FALSE
    );

-- Insert seed data into the conversations table
INSERT INTO
    public.conversations (id, teacher, student, has_replied)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440004',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440010',
        FALSE
    ),
    (
        '550e8400-e29b-41d4-a716-446655440006',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440020',
        FALSE
    );

-- Insert seed data into the messages table
INSERT INTO
    public.messages (id, sender, conversation, content)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440005',
        '550e8400-e29b-41d4-a716-446655440010',
        '550e8400-e29b-41d4-a716-446655440004',
        'Hello, I need help with my math homework'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440010',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440006',
        'Absolutely, lets get started.'
    ),
    (
        '550e8400-e29b-41d4-a716-446655440009',
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440006',
        'Can you assist me with my science project?'
    );

-- Insert seed data into the reviews table
INSERT INTO
    public.reviews (id, sender, receiver, rating, description)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440007',
        '550e8400-e29b-41d4-a716-446655440010',
        '550e8400-e29b-41d4-a716-446655440000',
        5,
        'Great tutor! Highly recommend.'
    );

-- Insert seed data into the stripe_customers table
INSERT INTO
    public.stripe_customers (user_id, stripe_customer_id)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'cus_test_12345'
    );