export type GenderNullable = Gender | null
export type Gender = 'f' | 'm'

export type NormativeResponse = {
  id: number,
  standard: {
    name: string,
    has_numeric_value: boolean
  },
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
  standard: {
    name: string,
    has_numeric_value: boolean
  },
  levels: {
    level_number: number,
    low_level_value: number,
    middle_level_value: number,
    high_level_value: number,
    gender: Gender,
  }[]
}

export type Student = {
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

export type Class = {
  class_name: string,
  number: number,
  recruitment_year: number
}