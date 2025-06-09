export type GenderNullable = Gender | null;
export type Gender = 'f' | 'm';

export type StandardResponse = {
  id: number;
  name: string;
  has_numeric_value: boolean;
  levels: {
    id: number;
    is_lower_better: boolean;
    level_number: number;
    low_value: number;
    middle_value: number;
    high_value: number;
    gender: Gender;
  }[];
};

export type StandardRequest = {
  name: string;
  has_numeric_value: boolean;
  levels: {
    is_lower_better: boolean;
    level_number: number;
    low_value: number | null;
    middle_value: number | null;
    high_value: number | null;
    gender: Gender;
  }[];
};

export type StudentResponse = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  full_name: string;
  student_class: {
    id: number;
    recruitment_year: number;
    number: number;
    class_name: string;
  };
  birthday: string;
  gender: Gender;
  invitation_link: string;
  is_used_invitation: boolean;
};

export type StudentRequest = {
  first_name: string;
  last_name: string;
  patronymic: string;
  student_class: {
    number: number;
    class_name: string;
  };
  birthday: string;
  gender: Gender;
};

export type ClassRequest = {
  id: number;
  class_name: string;
  number: number;
  recruitment_year: number;
};

export type StudentsValueResponse = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  full_name: string;
  student_class: {
    number: number;
    class_name: string;
  };
  birthday: string;
  gender: Gender;
  standards_details: {
    grade: number | null;
    value: number | null;
    standard_id: number;
  }[];
  average_value: number | null;
  average_grade: number | null;
};

export type StudentValueRequest = {
  student_id: number;
  standard_id: number;
  value: number | null;
};

export type FilterData = {
  gender: GenderNullable;
  grades: (number | null)[];
  birthYearFrom: number | null;
  birthYearUntil: number | null;
};

export type StudentStandardResponse = {
  standards: StudentStandard[];
  summary_grade: number;
};

export type StudentStandardRequest = {
  student_id: number;
  standard_id: number;
  value: number | null;
  level_number: number;
};

export type StudentStandard = {
  standard: {
    id: number;
    name: string;
    has_numeric_value: boolean;
  };
  grade: number | null;
  value: number | null;
  level_number: number;
};
