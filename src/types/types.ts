export type GenderNullable = Gender | null
export type Gender = 'f' | 'm'

export type StandardResponse = {
  id: number,
  name: string,
  has_numeric_value: boolean
  levels: {
    id: number,
    is_lower_better: boolean,
    level_number: number,
    low_value: number,
    middle_value: number,
    high_value: number,
    gender: Gender,
  }[]
}

export type StandardRequest = {
  name: string,
  has_numeric_value: boolean
  levels: {
    is_lower_better: boolean,
    level_number: number,
    low_value: number | null,
    middle_value: number | null,
    high_value: number | null,
    gender: Gender,
  }[]
}

export type StudentResponse = {
  id: number,
  first_name: string,
  last_name: string,
  patronymic: string,
  full_name: string,
  student_class: {
    id: number,
    recruitment_year: number,
    number: number,
    class_name: string
  },
  birthday: string,
  gender: Gender,
}

export type StudentRequest = {
  first_name: string,
  last_name: string,
  patronymic: string,
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
  grades: (number | null)[],
  birthYearFrom: number | null,
  birthYearUntil: number | null
}

export type StudentStandardResponse = {
  Standard: {
    Id: number,
    Name: string,
    Has_numeric_value: boolean
  },
  Grade: number | null,
  Value: number | null,
  Level_number: number
}

export type StudentStandardRequest = {
  student_id: number,
  standard_id: number,
  value: number | null,
  level_number: number,
}