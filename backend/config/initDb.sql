CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    image TEXT DEFAULT 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/profile_pic.png',
    address JSONB DEFAULT '{"line1": "", "line2": ""}'::jsonb,
    gender VARCHAR(50) DEFAULT 'Not Selected',
    dob VARCHAR(50) DEFAULT 'Not Selected',
    phone VARCHAR(20) DEFAULT '0000000000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    about TEXT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    fees NUMERIC(10, 2) NOT NULL,
    address JSONB NOT NULL,
    date BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    slot_date VARCHAR(50) NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_doctor_slot UNIQUE (doctor_id, slot_date, slot_time)
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    doctor_id UUID REFERENCES doctors(id) ON DELETE RESTRICT,
    slot_date VARCHAR(50) NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    user_data JSONB NOT NULL,
    doc_data JSONB NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date BIGINT NOT NULL,
    cancelled BOOLEAN DEFAULT FALSE,
    payment BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
