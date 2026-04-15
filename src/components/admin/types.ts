export interface Student {
  id: string; admission_no: string; roll_no: string; name: string;
  class: string; section: string; gender: string; dob: string; status: string;
  mobile_number: string; email: string; aadhar_number: string; nationality: string;
  religion: string; caste: string; joining_date: string;
  father_name: string; father_occupation: string; father_mobile_number: string;
  father_email_id: string; father_aadhar_number: string;
  mother_name: string; mother_occupation: string; mother_mobile_number: string;
  mother_email_id: string; mother_aadhar_number: string;
  correspondence_address: string; permanent_address: string; annual_income: string;
  guardian_enabled: boolean; guardian_name: string; guardian_occupation: string;
  guardian_mobile_number: string; guardian_mail_id: string;
  guardian_address: string; guardian_aadhar_number: string;
}

export interface AdminUserRow {
  id: string; email: string; name: string; role: string;
  designation: string; subject: string; mobile: string;
  is_active: boolean; must_change_password: boolean; created_at: string;
}
