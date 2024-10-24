import r from '..'

const NidString = r.string().regex(/^\d+$/)
const BirthCertificateString = r.string().regex(/^\d+$/)

const mainFields = {
  name: r.string(),
  password: r.string().minLength(6),
  accountType: r.string('GUEST', 'TEACHER'),
  phone: r
    .string()
    .regex(/^\+8801[0-9]{9}$/)
    .typeErr('Invalid phone number'),

  nidNumber: NidString.optional(),
  birthCertificateNumber: BirthCertificateString.optional(),
} as const

const studentsFields = {
  accountType: r.string('STUDENT'),
  student_educationalInstitute: r.string().optional(),
  student_department: r.string().optional(),
  student_session: r.string().optional(),
  student_rollNumber: r.string().optional(),
  student_registrationNumber: r.string().optional(),
}

const userType = r.or(
  r.object({
    ...mainFields,
    nidNumber: NidString.clone(),
  }),
  r.object({
    ...mainFields,
    ...studentsFields,
    nidNumber: NidString.clone(),
  }),
  r.object({
    ...mainFields,
    ...studentsFields,
    birthCertificateNumber: BirthCertificateString.clone(),
  })
)

try {
  userType.parse({
    name: 'John Doe',
    password: '123456',
    accountType: 'STUDENT',
    phone: '+8801712345678',
    
  })
} catch (err: any) {
  console.log(err.message)
}
