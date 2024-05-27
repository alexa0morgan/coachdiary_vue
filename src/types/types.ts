export type GenderNullable = Gender | null
export type Gender = 'f' | 'm'

export type NormativeResponse = {
  id: number,
  name: string,
  has_numeric_value: boolean
  levels: {
    id: number,
    level_number: number,
    low_level_value: number,
    middle_level_value: number,
    high_level_value: number,
    gender: Gender,
  }[]
}

export type NormativeRequest = {
  name: string,
  has_numeric_value: boolean
  levels: {
    level_number: number,
    low_level_value: number | null,
    middle_level_value: number | null,
    high_level_value: number | null,
    gender: Gender,
  }[]
}

export type StudentResponse = {
  id: number,
  full_name: string,
  student_class: {
    number: number,
    class_name: string
  },
  birthday: string,
  gender: Gender,
}

export type StudentRequest = {
  full_name: string,
  student_class: {
    number: number,
    class_name: string
  },
  birthday: string,
  gender: Gender,
}

export type ClassRequest = {
  id: number
  class_name: string,
  number: number,
  recruitment_year: number
}

export type StudentsValueResponse = {
  id: number,
  full_name: string,
  student_class: {
    number: number,
    class_name: string
  },
  birthday: string,
  gender: Gender,
  value: number | null,
  grade: number | null
}

export type StudentValueRequest = {
  student_id: number,
  standard_id: number,
  value: number | null
}

export type FilterData = {
  gender: GenderNullable,
  grades: (number| null)[],
  birthYearFrom: number | null,
  birthYearUntil: number | null
}