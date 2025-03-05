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
        'thomas@example.com',
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
        'johnny@example.com',
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
        'thor@example.com',
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
        '{"sub":"550e8400-e29b-41d4-a716-446655440010","email":"thomas@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000002',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440020',
        '{"sub":"550e8400-e29b-41d4-a716-446655440020","email":"johnny@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000003',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440030',
        '{"sub":"550e8400-e29b-41d4-a716-446655440030","email":"thor@example.com"}' :: jsonb,
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

INSERT INTO
    public.profiles (id, first_name, role, created_at)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'Tarek',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440010',
        'Thomas',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440020',
        'Johnny',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440030',
        'Thor',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440040',
        'Eve',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440050',
        'Frank',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440060',
        'Grace',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440070',
        'Heidi',
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
        '{1,2, 5}',
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
    -- Reviews for Thomas
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440010',
        5,
        'Thomas is a great tutor!'
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
        'Thomas is good, but could explain more.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440060',
        '550e8400-e29b-41d4-a716-446655440010',
        5,
        'Highly recommend Thomas.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440070',
        '550e8400-e29b-41d4-a716-446655440010',
        5,
        'Thomas made learning fun.'
    );

INSERT INTO
    public.conversations (id, teacher, student, has_replied, created_at)
VALUES
    (
        '550e8400-e29b-41d4-a716-100000000000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440020',
        true,
        current_timestamp
    ),
    (
        '550e8400-e29b-41d4-a716-200000000000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440050',
        false,
        current_timestamp
    );

INSERT INTO
    public.messages (id, sender, conversation, content, created_at)
VALUES
    (
        '550e8400-e29b-41d4-0000-100000000000',
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-100000000000',
        'Hej där kan jag få hjälp?',
        current_timestamp - INTERVAL '1 hour'
    ),
    (
        '550e8400-e29b-41d4-0000-200000000000',
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-100000000000',
        'ja det kan du',
        current_timestamp
    ),
    (
        '550e8400-e29b-41d4-1000-100000000000',
        '550e8400-e29b-41d4-a716-446655440050',
        '550e8400-e29b-41d4-a716-200000000000',
        'Tjena tarek, kan du javascript? mvh frank',
        current_timestamp
    );

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

-- Add more users
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
    -- Teachers
    (
        '00000000-0000-0000-0000-000000000000',
        '550e8400-e29b-41d4-a716-446655440100',
        'authenticated',
        'authenticated',
        'tova@example.com',
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
        '550e8400-e29b-41d4-a716-446655440110',
        'authenticated',
        'authenticated',
        'tamara@example.com',
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
        '550e8400-e29b-41d4-a716-446655440120',
        'authenticated',
        'authenticated',
        'trevor@example.com',
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
    -- Students
    (
        '00000000-0000-0000-0000-000000000000',
        '550e8400-e29b-41d4-a716-446655440130',
        'authenticated',
        'authenticated',
        'lisa@example.com',
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
        '550e8400-e29b-41d4-a716-446655440140',
        'authenticated',
        'authenticated',
        'mike@example.com',
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
        '550e8400-e29b-41d4-a716-446655440150',
        'authenticated',
        'authenticated',
        'nina@example.com',
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

-- Add corresponding identities
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
        '550e8400-e29b-41d4-a716-446655440100',
        '{"sub":"550e8400-e29b-41d4-a716-446655440100","email":"ian@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000009',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440110',
        '{"sub":"550e8400-e29b-41d4-a716-446655440110","email":"julia@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000010',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440120',
        '{"sub":"550e8400-e29b-41d4-a716-446655440120","email":"kevin@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000011',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440130',
        '{"sub":"550e8400-e29b-41d4-a716-446655440130","email":"lisa@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000012',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440140',
        '{"sub":"550e8400-e29b-41d4-a716-446655440140","email":"mike@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000013',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440150',
        '{"sub":"550e8400-e29b-41d4-a716-446655440150","email":"nina@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000014',
        current_timestamp,
        current_timestamp,
        current_timestamp
    );

-- Add profiles for new users
INSERT INTO
    public.profiles (id, first_name, role, created_at)
VALUES
    -- Teachers
    (
        '550e8400-e29b-41d4-a716-446655440100',
        'Tova',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440110',
        'Tamara',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440120',
        'Trevor',
        'teacher',
        NOW()
    ),
    -- Students
    (
        '550e8400-e29b-41d4-a716-446655440130',
        'Lisa',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440140',
        'Mike',
        'student',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440150',
        'Nina',
        'student',
        NOW()
    );

-- Add new listings for the new teachers
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
    -- Tova's listings
    (
        '550e8400-e29b-41d4-a716-446655440091',
        'Lär dig C++ från grunden',
        'Jag har jobbat med C++ i 10 år och kan hjälpa dig att förstå grunderna såväl som avancerade koncept.',
        '{1,3}',
        75,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440100',
        TRUE
    ),
    (
        '550e8400-e29b-41d4-a716-446655440092',
        'Datastrukturer & Algoritmer',
        'Förbered dig för tekniska intervjuer med praktiska övningar i algoritmer.',
        '{2,3}',
        85,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440100',
        TRUE
    ),
    -- Tamara's listings
    (
        '550e8400-e29b-41d4-a716-446655440093',
        'Frontend utveckling med React',
        'Lär dig bygga moderna webbapplikationer med React och TypeScript.',
        '{2}',
        65,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440110',
        TRUE
    ),
    (
        '550e8400-e29b-41d4-a716-446655440094',
        'UX/UI Design för utvecklare',
        'Förstå grunderna i användargränssnitt och användarupplevelse.',
        '{2,3}',
        70,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440110',
        TRUE
    ),
    -- Trevor's listings
    (
        '550e8400-e29b-41d4-a716-446655440095',
        'Backend utveckling med Node.js',
        'Från REST API till databaser - lär dig backend utveckling.',
        '{1,2}',
        80,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440120',
        TRUE
    ),
    (
        '550e8400-e29b-41d4-a716-446655440096',
        'DevOps grundkurs',
        'Introduktion till Docker, CI/CD och molntjänster.',
        '{3}',
        90,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440120',
        TRUE
    );
-- Add reviews for the new teachers
INSERT INTO
    public.reviews (id, sender, receiver, rating, description)
VALUES
    -- Reviews for Tova
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440130',
        '550e8400-e29b-41d4-a716-446655440100',
        5,
        'Tova är otroligt pedagogisk och har hjälpt mig mycket med C++.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440140',
        '550e8400-e29b-41d4-a716-446655440100',
        3,
        'Bra lärare som verkligen kan sina algoritmer.'
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440150',
        '550e8400-e29b-41d4-a716-446655440100',
        5,
        'Rekommenderar starkt för alla som vill lära sig C++!'
    ),
    -- Reviews for Tamara
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440020',
        '550e8400-e29b-41d4-a716-446655440110',
        4,
        'Tamara förklarar React på ett sätt som gör det lätt att förstå.'
    );

-- Add some conversations and messages for the new users
INSERT INTO
    public.conversations (id, teacher, student, has_replied, created_at)
VALUES
    (
        '550e8400-e29b-41d4-a716-300000000000',
        '550e8400-e29b-41d4-a716-446655440100',
        '550e8400-e29b-41d4-a716-446655440130',
        true,
        current_timestamp
    ),
    (
        '550e8400-e29b-41d4-a716-400000000000',
        '550e8400-e29b-41d4-a716-446655440110',
        '550e8400-e29b-41d4-a716-446655440140',
        true,
        current_timestamp
    );

INSERT INTO
    public.messages (id, sender, conversation, content, created_at)
VALUES
    (
        '550e8400-e29b-41d4-0000-300000000000',
        '550e8400-e29b-41d4-a716-446655440130',
        '550e8400-e29b-41d4-a716-300000000000',
        'Hej Tova! Jag skulle behöva hjälp med C++ pekare.',
        current_timestamp - INTERVAL '2 hours'
    ),
    (
        '550e8400-e29b-41d4-0000-400000000000',
        '550e8400-e29b-41d4-a716-446655440100',
        '550e8400-e29b-41d4-a716-300000000000',
        'Hej! Absolut, jag kan hjälpa dig med det. När vill du börja?',
        current_timestamp - INTERVAL '1 hour'
    ),
    (
        '550e8400-e29b-41d4-0000-500000000000',
        '550e8400-e29b-41d4-a716-446655440140',
        '550e8400-e29b-41d4-a716-400000000000',
        'Hej Tamara! Kan du hjälpa mig med React Hooks?',
        current_timestamp - INTERVAL '3 hours'
    ),
    (
        '550e8400-e29b-41d4-0000-600000000000',
        '550e8400-e29b-41d4-a716-446655440110',
        '550e8400-e29b-41d4-a716-400000000000',
        'Hej! Ja, det kan jag. Har du några specifika frågor?',
        current_timestamp - INTERVAL '2 hours'
    );

    -- Add more teachers
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
    -- Teachers
    (
        '00000000-0000-0000-0000-000000000000',
        '550e8400-e29b-41d4-a716-446655440200',
        'authenticated',
        'authenticated',
        'tiana@example.com',
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
        '550e8400-e29b-41d4-a716-446655440210',
        'authenticated',
        'authenticated',
        'tobias@example.com',
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
        '550e8400-e29b-41d4-a716-446655440220',
        'authenticated',
        'authenticated',
        'tara@example.com',
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

-- Add corresponding identities
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
        '550e8400-e29b-41d4-a716-446655440200',
        '{"sub":"550e8400-e29b-41d4-a716-446655440200","email":"tiana@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000015',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440210',
        '{"sub":"550e8400-e29b-41d4-a716-446655440210","email":"tobias@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000016',
        current_timestamp,
        current_timestamp,
        current_timestamp
    ),
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440220',
        '{"sub":"550e8400-e29b-41d4-a716-446655440220","email":"tara@example.com"}' :: jsonb,
        'email',
        '00000000-0000-0000-0000-000000000017',
        current_timestamp,
        current_timestamp,
        current_timestamp
    );

-- Add profiles for new teachers
INSERT INTO
    public.profiles (id, first_name, role, created_at)
VALUES
    -- Teachers
    (
        '550e8400-e29b-41d4-a716-446655440200',
        'Tiana',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440210',
        'Tobias',
        'teacher',
        NOW()
    ),
    (
        '550e8400-e29b-41d4-a716-446655440220',
        'Tara',
        'teacher',
        NOW()
    );

-- Add new listings for the new teachers
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
    -- Tiana's listings
    (
        '550e8400-e29b-41d4-a716-446655440201',
        'Python Programming Basics',
        'Learn Python from scratch with hands-on exercises.',
        '{1,3}',
        70,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440200',
        TRUE
    ),
    -- Tobias's listings
    (
        '550e8400-e29b-41d4-a716-446655440211',
        'Advanced JavaScript Concepts',
        'Master closures, promises, and async/await in JavaScript.',
        '{2}',
        80,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440210',
        TRUE
    ),
    -- Tara's listings
    (
        '550e8400-e29b-41d4-a716-446655440221',
        'Introduction to Machine Learning',
        'Learn the basics of ML with Python and Scikit-learn.',
        '{1,3}',
        90,
        'SEK',
        '550e8400-e29b-41d4-a716-446655440220',
        TRUE
    );

-- Add reviews for the new teachers
INSERT INTO
    public.reviews (id, sender, receiver, rating, description)
VALUES
    -- Reviews for Tiana
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440130',
        '550e8400-e29b-41d4-a716-446655440200',
        5,
        'Tiana is an excellent teacher! Her Python course is very beginner-friendly.'
    ),
    -- Reviews for Tobias
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440140',
        '550e8400-e29b-41d4-a716-446655440210',
        4,
        'Tobias explains complex JavaScript concepts in a simple way.'
    ),
    -- Reviews for Tara
    (
        uuid_generate_v4(),
        '550e8400-e29b-41d4-a716-446655440150',
        '550e8400-e29b-41d4-a716-446655440220',
        5,
        'Tara’s ML course is fantastic! Highly recommended for beginners.'
    );

-- Add some conversations and messages for the new users
INSERT INTO
    public.conversations (id, teacher, student, has_replied, created_at)
VALUES
    (
        '550e8400-e29b-41d4-a716-500000000000',
        '550e8400-e29b-41d4-a716-446655440200',
        '550e8400-e29b-41d4-a716-446655440130',
        true,
        current_timestamp
    ),
    (
        '550e8400-e29b-41d4-a716-600000000000',
        '550e8400-e29b-41d4-a716-446655440210',
        '550e8400-e29b-41d4-a716-446655440140',
        true,
        current_timestamp
    );

INSERT INTO
    public.messages (id, sender, conversation, content, created_at)
VALUES
    (
        '550e8400-e29b-41d4-0000-700000000000',
        '550e8400-e29b-41d4-a716-446655440130',
        '550e8400-e29b-41d4-a716-500000000000',
        'Hi Tiana! I need help with Python loops.',
        current_timestamp - INTERVAL '2 hours'
    ),

    (
        '550e8400-e29b-41d4-0000-900000000000',
        '550e8400-e29b-41d4-a716-446655440140',
        '550e8400-e29b-41d4-a716-600000000000',
        'Hi Tobias! Can you explain closures in JavaScript?',
        current_timestamp - INTERVAL '3 hours'
    ),
    (
        '550e8400-e29b-41d4-0000-100000300000',
        '550e8400-e29b-41d4-a716-446655440210',
        '550e8400-e29b-41d4-a716-600000000000',
        'Of course! Closures can be tricky, but I’ll break it down for you.',
        current_timestamp - INTERVAL '2 hours'
    );