-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "image" TEXT DEFAULT 'https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/profile_pic.png',
    "address" JSONB DEFAULT '{"line1": "", "line2": ""}',
    "gender" VARCHAR(50) DEFAULT 'Not Selected',
    "dob" VARCHAR(50) DEFAULT 'Not Selected',
    "phone" VARCHAR(20) DEFAULT '0000000000',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "image" TEXT NOT NULL,
    "speciality" VARCHAR(100) NOT NULL,
    "degree" VARCHAR(100) NOT NULL,
    "experience" VARCHAR(50) NOT NULL,
    "about" TEXT NOT NULL,
    "available" BOOLEAN DEFAULT true,
    "fees" DECIMAL(10,2) NOT NULL,
    "address" JSONB NOT NULL,
    "date" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_slots" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "slot_date" VARCHAR(50) NOT NULL,
    "slot_time" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctor_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "slot_date" VARCHAR(50) NOT NULL,
    "slot_time" VARCHAR(50) NOT NULL,
    "user_data" JSONB NOT NULL,
    "doc_data" JSONB NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" BIGINT NOT NULL,
    "cancelled" BOOLEAN DEFAULT false,
    "payment" BOOLEAN DEFAULT false,
    "is_completed" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_slots_doctor_id_slot_date_slot_time_key" ON "doctor_slots"("doctor_id", "slot_date", "slot_time");

-- AddForeignKey
ALTER TABLE "doctor_slots" ADD CONSTRAINT "doctor_slots_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
