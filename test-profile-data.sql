-- Insert test profile
INSERT INTO profiles (id, user_id, full_name, phone, location, linkedin_url, github_url, portfolio_url, professional_summary, created_at, updated_at)
VALUES (
  'profile-123',
  'user-123',
  'John Doe',
  '+1-555-0123',
  'San Francisco, CA',
  'https://linkedin.com/in/johndoe',
  'https://github.com/johndoe',
  'https://johndoe.dev',
  'Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications using React, Node.js, and PostgreSQL. Passionate about clean code, testing, and modern development practices.',
  NOW(),
  NOW()
);

-- Insert education
INSERT INTO education (id, profile_id, institution, degree, field_of_study, start_date, end_date, gpa, description, created_at)
VALUES (
  gen_random_uuid(),
  'profile-123',
  'Stanford University',
  'Bachelor of Science',
  'Computer Science',
  '2015-09-01',
  '2019-06-01',
  3.8,
  'Focused on software engineering, algorithms, and distributed systems.',
  NOW()
);

-- Insert work experience
INSERT INTO work_experience (id, profile_id, company, position, location, start_date, end_date, description, achievements, created_at)
VALUES (
  gen_random_uuid(),
  'profile-123',
  'Tech Corp',
  'Senior Software Engineer',
  'San Francisco, CA',
  '2021-01-01',
  NULL,
  'Leading development of microservices architecture for e-commerce platform.',
  '["Reduced API response time by 40% through optimization", "Implemented CI/CD pipeline reducing deployment time by 60%", "Mentored 3 junior developers"]'::jsonb,
  NOW()
),
(
  gen_random_uuid(),
  'profile-123',
  'StartupXYZ',
  'Full Stack Developer',
  'Remote',
  '2019-07-01',
  '2020-12-31',
  'Built and maintained full-stack web applications using React and Node.js.',
  '["Developed RESTful APIs serving 100k+ daily requests", "Implemented real-time features using WebSockets", "Improved test coverage from 40% to 85%"]'::jsonb,
  NOW()
);

-- Insert skills
INSERT INTO skills (id, profile_id, name, category, proficiency_level, created_at)
VALUES 
  (gen_random_uuid(), 'profile-123', 'JavaScript', 'Programming Languages', 'Expert', NOW()),
  (gen_random_uuid(), 'profile-123', 'TypeScript', 'Programming Languages', 'Expert', NOW()),
  (gen_random_uuid(), 'profile-123', 'Python', 'Programming Languages', 'Advanced', NOW()),
  (gen_random_uuid(), 'profile-123', 'React', 'Frontend', 'Expert', NOW()),
  (gen_random_uuid(), 'profile-123', 'Node.js', 'Backend', 'Expert', NOW()),
  (gen_random_uuid(), 'profile-123', 'PostgreSQL', 'Databases', 'Advanced', NOW()),
  (gen_random_uuid(), 'profile-123', 'MongoDB', 'Databases', 'Intermediate', NOW()),
  (gen_random_uuid(), 'profile-123', 'Docker', 'DevOps', 'Advanced', NOW()),
  (gen_random_uuid(), 'profile-123', 'Kubernetes', 'DevOps', 'Intermediate', NOW()),
  (gen_random_uuid(), 'profile-123', 'AWS', 'Cloud', 'Advanced', NOW()),
  (gen_random_uuid(), 'profile-123', 'Git', 'Tools', 'Expert', NOW());

-- Insert projects
INSERT INTO projects (id, profile_id, name, description, technologies, url, github_url, start_date, end_date, created_at)
VALUES (
  gen_random_uuid(),
  'profile-123',
  'E-Commerce Platform',
  'Built a full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.',
  '["React", "Node.js", "PostgreSQL", "Stripe", "Docker"]'::jsonb,
  'https://example-ecommerce.com',
  'https://github.com/johndoe/ecommerce',
  '2022-01-01',
  '2022-06-01',
  NOW()
),
(
  gen_random_uuid(),
  'profile-123',
  'Real-time Chat Application',
  'Developed a scalable real-time chat application supporting 10k+ concurrent users.',
  '["React", "Node.js", "Socket.io", "Redis", "MongoDB"]'::jsonb,
  NULL,
  'https://github.com/johndoe/chat-app',
  '2021-03-01',
  '2021-08-01',
  NOW()
);

-- Insert certifications
INSERT INTO certifications (id, profile_id, name, issuer, issue_date, expiry_date, credential_id, credential_url, created_at)
VALUES (
  gen_random_uuid(),
  'profile-123',
  'AWS Certified Solutions Architect',
  'Amazon Web Services',
  '2023-01-15',
  '2026-01-15',
  'AWS-SA-12345',
  'https://aws.amazon.com/verification',
  NOW()
),
(
  gen_random_uuid(),
  'profile-123',
  'Professional Scrum Master I',
  'Scrum.org',
  '2022-06-01',
  NULL,
  'PSM-67890',
  'https://scrum.org/certificates',
  NOW()
);

-- Insert languages
INSERT INTO languages (id, profile_id, name, proficiency, created_at)
VALUES 
  (gen_random_uuid(), 'profile-123', 'English', 'Native', NOW()),
  (gen_random_uuid(), 'profile-123', 'Spanish', 'Intermediate', NOW());
