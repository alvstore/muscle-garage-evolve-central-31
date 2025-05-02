-- Migration: Create website_content table

CREATE TABLE IF NOT EXISTS website_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  cta_text TEXT,
  image_url TEXT,
  order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data for website sections

-- Hero section
INSERT INTO website_content (section, title, subtitle, cta_text, order, is_active)
VALUES ('hero', 'SHAPE YOUR BODY PERFECT', 'Transform your physique and improve your health with our professional trainers', 'Get Started Today', 1, true);

-- About section
INSERT INTO website_content (section, title, content, order, is_active)
VALUES ('about', 'About Muscle Garage', 'Muscle Garage is a premier fitness facility dedicated to helping individuals achieve their fitness goals through personalized training programs, state-of-the-art equipment, and a supportive community environment.', 1, true);

-- About features
INSERT INTO website_content (section, title, order, is_active)
VALUES 
('about', 'Professional Trainers', 2, true),
('about', 'Modern Equipment', 3, true),
('about', 'Nutrition Guidance', 4, true),
('about', 'Personalized Programs', 5, true);

-- Services section
INSERT INTO website_content (section, title, order, is_active)
VALUES ('services', 'WHY CHOOSE US', 1, true);

-- Service features
INSERT INTO website_content (section, title, content, order, is_active)
VALUES 
('services', 'Modern Equipment', 'State-of-the-art fitness equipment for effective workouts', 2, true),
('services', 'Professional Trainers', 'Expert trainers to guide you through your fitness journey', 3, true);

-- Classes section
INSERT INTO website_content (section, title, content, order, is_active)
VALUES ('classes', 'Our Classes', 'Join our diverse range of fitness classes designed for all levels', 1, true);

-- Trainers section
INSERT INTO website_content (section, title, content, order, is_active)
VALUES ('trainers', 'Our Trainers', 'Meet our expert team of fitness professionals', 1, true);

-- Gallery section
INSERT INTO website_content (section, title, image_url, order, is_active)
VALUES 
('gallery', 'Our Gallery', '/gallery-1.jpg', 1, true),
('gallery', 'Our Gallery', '/gallery-2.jpg', 2, true),
('gallery', 'Our Gallery', '/gallery-3.jpg', 3, true),
('gallery', 'Our Gallery', '/gallery-4.jpg', 4, true),
('gallery', 'Our Gallery', '/gallery-5.jpg', 5, true),
('gallery', 'Our Gallery', '/gallery-6.jpg', 6, true);

-- Testimonials section
INSERT INTO website_content (section, title, content, order, is_active)
VALUES ('testimonials', 'What Our Clients Say', 'Read testimonials from our satisfied members', 1, true);

-- Individual testimonials
INSERT INTO website_content (section, title, content, image_url, order, is_active)
VALUES 
('testimonials', 'John Doe', 'The trainers at Muscle Garage are amazing! I've seen incredible results in just a few months.', '/testimonial-1.jpg', 2, true),
('testimonials', 'Jane Smith', 'Best gym I've ever been to. The community is supportive and the facilities are top-notch.', '/testimonial-2.jpg', 3, true),
('testimonials', 'Mike Johnson', 'I've transformed my body and my life thanks to the personalized training programs.', '/testimonial-3.jpg', 4, true);

-- Pricing/Membership section
INSERT INTO website_content (section, title, content, order, is_active)
VALUES ('pricing', 'Membership Plans', 'Choose the perfect membership plan for your fitness journey', 1, true);

-- Contact section
INSERT INTO website_content (section, title, content, order, is_active)
VALUES ('contact', 'Contact Us', 'Get in touch with our team for any inquiries', 1, true);