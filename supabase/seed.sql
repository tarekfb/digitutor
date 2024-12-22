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
        'tarek@example.com',
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
        'carol@example.com',
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
        '550e8400-e29b-41d4-a716-446655440030',
        'authenticated',
        'authenticated',
        'dave@example.com',
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
        '550e8400-e29b-41d4-a716-446655440040',
        'authenticated',
        'authenticated',
        'eve@example.com',
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
        '550e8400-e29b-41d4-a716-446655440050',
        'authenticated',
        'authenticated',
        'frank@example.com',
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
        '550e8400-e29b-41d4-a716-446655440060',
        'authenticated',
        'authenticated',
        'grace@example.com',
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
        '550e8400-e29b-41d4-a716-446655440070',
        'authenticated',
        'authenticated',
        'heidi@example.com',
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
        '{"sub":"550e8400-e29b-41d4-a716-446655440000","email":"tarek@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000001',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440010',
        '{"sub":"550e8400-e29b-41d4-a716-446655440010","email":"bob@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000002',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440020',
        '{"sub":"550e8400-e29b-41d4-a716-446655440020","email":"carol@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000003',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440030',
        '{"sub":"550e8400-e29b-41d4-a716-446655440030","email":"dave@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000004',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440040',
        '{"sub":"550e8400-e29b-41d4-a716-446655440040","email":"eve@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000005',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440050',
        '{"sub":"550e8400-e29b-41d4-a716-446655440050","email":"frank@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000006',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440060',
        '{"sub":"550e8400-e29b-41d4-a716-446655440060","email":"grace@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000007',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440070',
        '{"sub":"550e8400-e29b-41d4-a716-446655440070","email":"heidi@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000008',
        current_timestamp,
        current_timestamp,
        current_timestamp
    );

-- Insert additional profiles into public.profiles table
INSERT INTO
    public.profiles (id, first_name, last_name, role, created_at)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'Tarek',
        'Anderson',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440010',
        'Bob',
        'Brown',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440020',
        'Carol',
        'Clark',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440030',
        'Dave',
        'Developer',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440040',
        'Eve',
        'Evans',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440050',
        'Frank',
        'Foster',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440060',
        'Grace',
        'Green',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440070',
        'Heidi',
        'Hoover',
        'student',
        NOW()
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
        '550e8400-e29b-41d4-a716-446655440080',
        'Programmering nybörjare',
        'Hej, jag lär ut python. När jag inte kodar så gillar jag att springa, cykla, eller bara sitta i soffan och läsa en bra bok. Det är roligt att träffa nya människor och höra deras historier. Jag är bra på att förklara saker på ett enkelt sätt och jag har tålamod med de som behöver en extra förklaring. Secret ',
        '{1,2}',
        60,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440000',
        TRUE
    ),
    (

        '550e8400-e29b-41d4-a716-446655440081',
        'Webbutveckling när det är som roligast',
        'Jag lär ut något. Text på svenska. Text på svenska. Text på svenska. Text på svenska. Text på svenska. Secret',
        '{2,3}',
        70,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440000',
        TRUE
    ),
    (
        '550e8400-e29b-41d4-a716-446655440090',
        'Testa Java! 😍',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non nulla a magna aliquam mollis. Mauris vitae tortor nec erat lacinia dignissim. Morbi non nulla a magna aliquam mollis. Mauris vitae tortor nec erat lacinia dignissim. ',
        '{1,2,3}',
        70,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440010',
        TRUE
    );

INSERT INTO
    public.reviews (id, sender, receiver, rating, description)
VALUES
    -- Reviews for Tarek
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440000',
        5,
        'Tarek is a great instructor. He is very knowledgeable and explains things clearly.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440040',
        '550e8400-e29b-41d4-a716-446655440000',
        4,
        'Tarek is a good teacher. He is patient and helpful.'
    ),
    -- (
    --     uuid_generate_v4(),
    --     '550e8400-e29b-41d4-a716-446655440050',
    --     '550e8400-e29b-41d4-a716-446655440000',
    --     5,
    --     'Tarek is an excellent teacher. He is very knowledgeable and explains things clearly.'
    -- ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440060',
        '550e8400-e29b-41d4-a716-446655440000',
        5,
        'Tarek is a great teacher. I have learned a lot from him. He is very patient and takes the time to explain things clearly. He is also very knowledgeable and knows how to break down complex topics into simpler terms. He is a great communicator and is always available to answer questions.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440070',
        '550e8400-e29b-41d4-a716-446655440000',
        4,
        'Tarek is a good teacher, but sometimes his explanations are unclear.'
    ),
    -- Reviews for Bob
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440010',
        5,
        'Bob is a great tutor!'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440040',
        '550e8400-e29b-41d4-a716-446655440010',
        5,
        'Very helpful and patient.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440050',
        '550e8400-e29b-41d4-a716-446655440010',
        4,
        'Bob is good, but could explain more.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440060',
        '550e8400-e29b-41d4-a716-446655440010',
        5,
        'Highly recommend Bob.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440070',
        '550e8400-e29b-41d4-a716-446655440010',
        5,
        'Bob made learning fun.'
    );

INSERT INTO
    public.conversations (id, teacher, student, has_replied, created_at)
VALUES
    ('550e8400-e29b-41d4-a716-100000000000', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440020', true, current_timestamp),
    ('550e8400-e29b-41d4-a716-200000000000', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440050', false, current_timestamp);

INSERT INTO
    public.messages (id, sender, conversation, content, created_at)
VALUES
    ('550e8400-e29b-41d4-0000-100000000000', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-100000000000', 'Hej där kan jag få hjälp?', current_timestamp - INTERVAL '1 hour'),
    ('550e8400-e29b-41d4-0000-200000000000', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-100000000000', 'ja det kan du', current_timestamp),

    ('550e8400-e29b-41d4-1000-100000000000', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-200000000000', 'Tjena tarek, kan du javascript? mvh frank', current_timestamp);

insert into
    storage.buckets (id, name, public, file_size_limit)
values
    ('avatars', 'avatars', true, 2097152);

CREATE POLICY "Give users authenticated update access to bucket 1oj01fe_0" ON storage.objects FOR
UPDATE
    TO public USING (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Give users authenticated select access to bucket 1oj01fe_0" ON storage.objects FOR
SELECT
    TO public USING (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Give users authenticated insert access to bucket 1oj01fe_1" ON storage.objects FOR
INSERT
    TO public WITH CHECK (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );


CREATE OR REPLACE FUNCTION compound_search(listing RECORD) RETURNS TEXT AS $$
DECLARE
  profile_first_name TEXT;
  profile_last_name TEXT;
  profile_role TEXT;
  listing_title TEXT;
  listing_description TEXT;
  listing_hourly_price INT;
BEGIN
  -- Initialize listing fields to default values
  listing_title := '';
  listing_description := '';
  listing_hourly_price := 0;

  -- Retrieve the profile information
  SELECT p.first_name, p.last_name, p.role
  INTO profile_first_name, profile_last_name, profile_role
  FROM profiles p
  WHERE p.id = listing.profile;

  -- Retrieve the title, description, and hourly_price from the listings table for visible listings
  SELECT l.title, l.description, l.hourly_price 
  INTO listing_title, listing_description, listing_hourly_price
  FROM listings l
  WHERE l.id = listing.id AND l.visible = TRUE;

  -- Check if the role is 'teacher' and if the listing is visible
  IF profile_role = 'teacher' AND listing_title IS NOT NULL THEN
    RETURN profile_first_name || ' ' || profile_last_name || ' ' ||
           COALESCE(listing_title, '') || ' ' || 
           COALESCE(listing_description, '') || ' ' ||
           COALESCE(listing_hourly_price::TEXT, '');
  ELSE
    RETURN NULL; -- or you can return '' for an empty string
  END IF;
END;

$$ LANGUAGE plpgsql IMMUTABLE;