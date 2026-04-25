require('dotenv').config();

const bcrypt = require('bcryptjs');
const { sequelize, User, Doctor } = require('../models');

const SPECIALIZATIONS = [
  'Cardiologist',
  'Dermatologist',
  'General Practitioner',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'Psychiatrist',
  'Pulmonologist',
  'Urologist'
];

const FIRST_NAMES = ['Aarav', 'Diya', 'Ishaan'];
const LAST_NAMES = ['Sharma', 'Mehta', 'Reddy', 'Gupta', 'Nair', 'Kapoor'];

const buildDoctors = () => {
  const doctors = [];
  for (const specialization of SPECIALIZATIONS) {
    for (let i = 1; i <= 3; i += 1) {
      const firstName = FIRST_NAMES[i - 1];
      const lastName = LAST_NAMES[(SPECIALIZATIONS.indexOf(specialization) + i) % LAST_NAMES.length];
      const displayName = `Dr. ${firstName} ${lastName}`;
      const slug = specialization.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const email = `${slug}-${i}@medconnect.demo`;

      doctors.push({
        name: displayName,
        email,
        role: 'doctor',
        phone: `98${String(10000000 + SPECIALIZATIONS.indexOf(specialization) * 100 + i).slice(-8)}`,
        specialization,
        experience: 4 + SPECIALIZATIONS.indexOf(specialization) + i,
        qualification: i === 1 ? 'MBBS, MD' : i === 2 ? 'MBBS, DNB' : 'MBBS, MS',
        consultationFee: String(500 + SPECIALIZATIONS.indexOf(specialization) * 60 + i * 40),
        availableFrom: '10:00',
        availableTo: '18:00',
        bio: `${displayName} is an experienced ${specialization.toLowerCase()} focused on patient-centric treatment and preventive care.`
      });
    }
  }
  return doctors;
};

async function upsertDoctorProfile(entry, passwordHash) {
  const [user] = await User.findOrCreate({
    where: { email: entry.email },
    defaults: {
      name: entry.name,
      email: entry.email,
      password: passwordHash,
      role: entry.role,
      phone: entry.phone
    }
  });

  if (user.role !== 'doctor') {
    await user.update({ role: 'doctor' });
  }

  await user.update({
    name: entry.name,
    phone: entry.phone
  });

  const [doctor] = await Doctor.findOrCreate({
    where: { userId: user.id },
    defaults: {
      userId: user.id,
      specialization: entry.specialization,
      experience: entry.experience,
      qualification: entry.qualification,
      bio: entry.bio,
      consultationFee: entry.consultationFee,
      availableFrom: entry.availableFrom,
      availableTo: entry.availableTo,
      isApproved: true
    }
  });

  await doctor.update({
    specialization: entry.specialization,
    experience: entry.experience,
    qualification: entry.qualification,
    bio: entry.bio,
    consultationFee: entry.consultationFee,
    availableFrom: entry.availableFrom,
    availableTo: entry.availableTo,
    isApproved: true
  });
}

async function run() {
  const doctors = buildDoctors();
  const demoPassword = process.env.DOCTOR_SEED_PASSWORD || 'DemoDoctor@123';
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  try {
    await sequelize.authenticate();

    for (const doctor of doctors) {
      await upsertDoctorProfile(doctor, passwordHash);
    }

    console.log(`Seed completed: ${doctors.length} doctors upserted.`);
    console.log(`Demo doctor password: ${demoPassword}`);
  } catch (error) {
    console.error('Doctor seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
