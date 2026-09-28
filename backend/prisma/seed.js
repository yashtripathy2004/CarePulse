import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const doctors = [
  // ===== General Physician (5) =====
  {
    name: "Dr. Richard James",
    email: "richard.james@prescripto.com",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about: "Dr. Richard James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc1.png",
    address: { line1: "17th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Emily Larson",
    email: "emily.larson@prescripto.com",
    speciality: "General physician",
    degree: "MBBS, MD",
    experience: "6 Years",
    about: "Dr. Emily Larson is dedicated to providing thorough and compassionate care, emphasizing holistic approaches and long-term wellness for her patients.",
    fees: 60,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc2.png",
    address: { line1: "27th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Sarah Patel",
    email: "sarah.patel@prescripto.com",
    speciality: "General physician",
    degree: "MBBS",
    experience: "3 Years",
    about: "Dr. Sarah Patel focuses on patient-centered primary care, with a special interest in chronic disease management and preventive health screenings.",
    fees: 40,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc3.png",
    address: { line1: "37th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Christopher Lee",
    email: "christopher.lee@prescripto.com",
    speciality: "General physician",
    degree: "MBBS, DNB",
    experience: "8 Years",
    about: "Dr. Christopher Lee brings extensive clinical experience in internal medicine and is known for his meticulous diagnostic approach and patient rapport.",
    fees: 70,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc4.png",
    address: { line1: "47th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },
  {
    name: "Dr. Jennifer Garcia",
    email: "jennifer.garcia@prescripto.com",
    speciality: "General physician",
    degree: "MBBS",
    experience: "5 Years",
    about: "Dr. Jennifer Garcia is passionate about family medicine and provides comprehensive care with a focus on building lasting doctor-patient relationships.",
    fees: 55,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc5.png",
    address: { line1: "57th Cross, Richmond", line2: "Circle, Ring Road, London" },
  },

  // ===== Gynecologist (5) =====
  {
    name: "Dr. Amita Williams",
    email: "amita.williams@prescripto.com",
    speciality: "Gynecologist",
    degree: "MBBS, MS (OBG)",
    experience: "7 Years",
    about: "Dr. Amita Williams specializes in women's reproductive health and provides expert care in prenatal, postnatal, and gynecological conditions.",
    fees: 80,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc6.png",
    address: { line1: "12th Avenue, Westminster", line2: "Baker Street, London" },
  },
  {
    name: "Dr. Shalini Mehta",
    email: "shalini.mehta@prescripto.com",
    speciality: "Gynecologist",
    degree: "MBBS, DGO",
    experience: "10 Years",
    about: "Dr. Shalini Mehta is a highly experienced obstetrician and gynecologist known for her expertise in high-risk pregnancies and minimally invasive surgeries.",
    fees: 90,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc7.png",
    address: { line1: "22nd Avenue, Westminster", line2: "Baker Street, London" },
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@prescripto.com",
    speciality: "Gynecologist",
    degree: "MBBS, MS",
    experience: "5 Years",
    about: "Dr. Priya Sharma focuses on adolescent gynecology and reproductive endocrinology, offering compassionate and evidence-based care to all her patients.",
    fees: 65,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc8.png",
    address: { line1: "32nd Avenue, Westminster", line2: "Baker Street, London" },
  },
  {
    name: "Dr. Nisha Verma",
    email: "nisha.verma@prescripto.com",
    speciality: "Gynecologist",
    degree: "MBBS, DNB (OBG)",
    experience: "9 Years",
    about: "Dr. Nisha Verma has vast experience in managing complex gynecological cases and is well-regarded for her surgical precision and patient-first approach.",
    fees: 85,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc9.png",
    address: { line1: "42nd Avenue, Westminster", line2: "Baker Street, London" },
  },
  {
    name: "Dr. Kavita Reddy",
    email: "kavita.reddy@prescripto.com",
    speciality: "Gynecologist",
    degree: "MBBS, MS (OBG)",
    experience: "6 Years",
    about: "Dr. Kavita Reddy is dedicated to empowering women through health education and provides comprehensive obstetric and gynecological services.",
    fees: 75,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc10.png",
    address: { line1: "52nd Avenue, Westminster", line2: "Baker Street, London" },
  },

  // ===== Dermatologist (5) =====
  {
    name: "Dr. Andrew Miller",
    email: "andrew.miller@prescripto.com",
    speciality: "Dermatologist",
    degree: "MBBS, MD (Dermatology)",
    experience: "5 Years",
    about: "Dr. Andrew Miller specializes in medical and cosmetic dermatology, offering advanced treatments for skin conditions including acne, eczema, and psoriasis.",
    fees: 70,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc11.png",
    address: { line1: "5th Block, Harley Street", line2: "Marylebone, London" },
  },
  {
    name: "Dr. Ava Mitchell",
    email: "ava.mitchell@prescripto.com",
    speciality: "Dermatologist",
    degree: "MBBS, DVD",
    experience: "8 Years",
    about: "Dr. Ava Mitchell is an expert in clinical dermatology and dermato-surgery, with a keen interest in laser treatments and skin cancer screening.",
    fees: 85,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc12.png",
    address: { line1: "15th Block, Harley Street", line2: "Marylebone, London" },
  },
  {
    name: "Dr. Ryan Thompson",
    email: "ryan.thompson@prescripto.com",
    speciality: "Dermatologist",
    degree: "MBBS, DNB (Dermatology)",
    experience: "4 Years",
    about: "Dr. Ryan Thompson provides personalized skincare solutions and specializes in treating pigmentation disorders, hair loss, and allergic skin reactions.",
    fees: 60,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc13.png",
    address: { line1: "25th Block, Harley Street", line2: "Marylebone, London" },
  },
  {
    name: "Dr. Sophia Clark",
    email: "sophia.clark@prescripto.com",
    speciality: "Dermatologist",
    degree: "MBBS, MD",
    experience: "11 Years",
    about: "Dr. Sophia Clark is a senior dermatologist renowned for her expertise in aesthetic dermatology, anti-aging therapies, and advanced cosmetic procedures.",
    fees: 95,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc14.png",
    address: { line1: "35th Block, Harley Street", line2: "Marylebone, London" },
  },
  {
    name: "Dr. Ethan Davis",
    email: "ethan.davis@prescripto.com",
    speciality: "Dermatologist",
    degree: "MBBS, DDVL",
    experience: "6 Years",
    about: "Dr. Ethan Davis combines traditional dermatological practices with cutting-edge technology to provide effective treatments for a wide range of skin disorders.",
    fees: 75,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc15.png",
    address: { line1: "45th Block, Harley Street", line2: "Marylebone, London" },
  },

  // ===== Pediatricians (5) =====
  {
    name: "Dr. Timothy White",
    email: "timothy.white@prescripto.com",
    speciality: "Pediatricians",
    degree: "MBBS, MD (Pediatrics)",
    experience: "7 Years",
    about: "Dr. Timothy White is a compassionate pediatrician who provides exceptional care for children from newborns through adolescence, with expertise in developmental milestones.",
    fees: 65,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc1.png",
    address: { line1: "8th Street, Chelsea", line2: "Kings Road, London" },
  },
  {
    name: "Dr. Olivia Brown",
    email: "olivia.brown@prescripto.com",
    speciality: "Pediatricians",
    degree: "MBBS, DCH",
    experience: "9 Years",
    about: "Dr. Olivia Brown is passionate about child health and specializes in pediatric immunology, nutrition counseling, and childhood infectious diseases.",
    fees: 75,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc2.png",
    address: { line1: "18th Street, Chelsea", line2: "Kings Road, London" },
  },
  {
    name: "Dr. Nathan Scott",
    email: "nathan.scott@prescripto.com",
    speciality: "Pediatricians",
    degree: "MBBS, DNB (Pediatrics)",
    experience: "4 Years",
    about: "Dr. Nathan Scott is dedicated to providing holistic pediatric care with a special focus on early intervention, growth monitoring, and childhood behavioral issues.",
    fees: 55,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc3.png",
    address: { line1: "28th Street, Chelsea", line2: "Kings Road, London" },
  },
  {
    name: "Dr. Mia Johnson",
    email: "mia.johnson@prescripto.com",
    speciality: "Pediatricians",
    degree: "MBBS, MD",
    experience: "12 Years",
    about: "Dr. Mia Johnson is a senior pediatrician with over a decade of experience in neonatal care, pediatric emergency medicine, and chronic childhood conditions.",
    fees: 90,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc4.png",
    address: { line1: "38th Street, Chelsea", line2: "Kings Road, London" },
  },
  {
    name: "Dr. Lucas Martin",
    email: "lucas.martin@prescripto.com",
    speciality: "Pediatricians",
    degree: "MBBS, DCH",
    experience: "6 Years",
    about: "Dr. Lucas Martin focuses on preventive pediatric care and vaccination programs, ensuring children receive the best possible start in their health journey.",
    fees: 60,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc5.png",
    address: { line1: "48th Street, Chelsea", line2: "Kings Road, London" },
  },

  // ===== Neurologist (5) =====
  {
    name: "Dr. Patrick Harris",
    email: "patrick.harris@prescripto.com",
    speciality: "Neurologist",
    degree: "MBBS, DM (Neurology)",
    experience: "10 Years",
    about: "Dr. Patrick Harris is a distinguished neurologist specializing in stroke management, epilepsy, and neurodegenerative disorders with a research-driven approach.",
    fees: 100,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc6.png",
    address: { line1: "3rd Floor, Neuroscience Centre", line2: "Oxford Street, London" },
  },
  {
    name: "Dr. Rachel Green",
    email: "rachel.green@prescripto.com",
    speciality: "Neurologist",
    degree: "MBBS, MD, DM",
    experience: "8 Years",
    about: "Dr. Rachel Green provides expert neurological care with a focus on headache disorders, multiple sclerosis, and peripheral neuropathies.",
    fees: 90,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc7.png",
    address: { line1: "5th Floor, Neuroscience Centre", line2: "Oxford Street, London" },
  },
  {
    name: "Dr. Daniel Wilson",
    email: "daniel.wilson@prescripto.com",
    speciality: "Neurologist",
    degree: "MBBS, DM (Neurology)",
    experience: "6 Years",
    about: "Dr. Daniel Wilson specializes in movement disorders and neurorehabilitation, helping patients regain function and quality of life after neurological events.",
    fees: 85,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc8.png",
    address: { line1: "7th Floor, Neuroscience Centre", line2: "Oxford Street, London" },
  },
  {
    name: "Dr. Amanda Taylor",
    email: "amanda.taylor@prescripto.com",
    speciality: "Neurologist",
    degree: "MBBS, DNB (Neurology)",
    experience: "13 Years",
    about: "Dr. Amanda Taylor is a leading neurologist with deep expertise in cognitive neurology, dementia care, and advanced neuroimaging diagnostics.",
    fees: 110,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc9.png",
    address: { line1: "9th Floor, Neuroscience Centre", line2: "Oxford Street, London" },
  },
  {
    name: "Dr. Kevin Anderson",
    email: "kevin.anderson@prescripto.com",
    speciality: "Neurologist",
    degree: "MBBS, MD",
    experience: "5 Years",
    about: "Dr. Kevin Anderson focuses on pediatric neurology and sleep disorders, providing comprehensive evaluations and tailored treatment plans for his patients.",
    fees: 80,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc10.png",
    address: { line1: "11th Floor, Neuroscience Centre", line2: "Oxford Street, London" },
  },

  // ===== Gastroenterologist (5) =====
  {
    name: "Dr. Michael Roberts",
    email: "michael.roberts@prescripto.com",
    speciality: "Gastroenterologist",
    degree: "MBBS, DM (Gastroenterology)",
    experience: "9 Years",
    about: "Dr. Michael Roberts is a skilled gastroenterologist specializing in endoscopic procedures, liver diseases, and inflammatory bowel disease management.",
    fees: 95,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc11.png",
    address: { line1: "Block A, Digestive Health Centre", line2: "Kensington, London" },
  },
  {
    name: "Dr. Lisa Wang",
    email: "lisa.wang@prescripto.com",
    speciality: "Gastroenterologist",
    degree: "MBBS, MD, DM",
    experience: "11 Years",
    about: "Dr. Lisa Wang provides expert care in hepatology and advanced therapeutic endoscopy, with a strong focus on early detection of gastrointestinal cancers.",
    fees: 105,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc12.png",
    address: { line1: "Block B, Digestive Health Centre", line2: "Kensington, London" },
  },
  {
    name: "Dr. James Cooper",
    email: "james.cooper@prescripto.com",
    speciality: "Gastroenterologist",
    degree: "MBBS, DNB (Gastro)",
    experience: "7 Years",
    about: "Dr. James Cooper specializes in functional gastrointestinal disorders, acid reflux, and irritable bowel syndrome with a patient-friendly treatment philosophy.",
    fees: 80,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc13.png",
    address: { line1: "Block C, Digestive Health Centre", line2: "Kensington, London" },
  },
  {
    name: "Dr. Hannah Lewis",
    email: "hannah.lewis@prescripto.com",
    speciality: "Gastroenterologist",
    degree: "MBBS, DM",
    experience: "14 Years",
    about: "Dr. Hannah Lewis is a senior gastroenterologist with vast experience in pancreatic diseases, biliary disorders, and complex endoscopic interventions.",
    fees: 115,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc14.png",
    address: { line1: "Block D, Digestive Health Centre", line2: "Kensington, London" },
  },
  {
    name: "Dr. Robert Kim",
    email: "robert.kim@prescripto.com",
    speciality: "Gastroenterologist",
    degree: "MBBS, MD",
    experience: "5 Years",
    about: "Dr. Robert Kim focuses on nutritional gastroenterology and celiac disease management, helping patients achieve digestive wellness through tailored care plans.",
    fees: 75,
    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/prescripto/doc15.png",
    address: { line1: "Block E, Digestive Health Centre", line2: "Kensington, London" },
  },
];

async function main() {
  console.log("🌱 Seeding 30 doctors (5 per speciality)...\n");

  const password = "doctor1234";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let created = 0;
  let skipped = 0;

  for (const doc of doctors) {
    try {
      await prisma.doctor.create({
        data: {
          name: doc.name,
          email: doc.email,
          password: hashedPassword,
          image: doc.image,
          speciality: doc.speciality,
          degree: doc.degree,
          experience: doc.experience,
          about: doc.about,
          fees: doc.fees,
          address: doc.address,
          date: BigInt(Date.now()),
        },
      });
      created++;
      console.log(`  ✅ Added: ${doc.name} (${doc.speciality})`);
    } catch (error) {
      if (error.code === "P2002") {
        skipped++;
        console.log(`  ⏭️  Skipped (already exists): ${doc.name}`);
      } else {
        console.error(`  ❌ Error adding ${doc.name}:`, error.message);
      }
    }
  }

  console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
