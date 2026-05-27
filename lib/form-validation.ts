export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidAmount(value: string): boolean {
  const parsed = Number(value);
  return !isNaN(parsed) && parsed > 0;
}

export function isValidPhoneNumber(value: string): boolean {
  return /^[6-9]\d{9}$/.test(value.trim());
}

export function validatePavtiForm(fields: {
  status: string;
  date: string;
  recipientName: string;
  address: string;
  phoneNumber: string;
  amount: string;
}): string | null {
  if (!fields.status || !["completed", "pending"].includes(fields.status)) {
    return "Status is required";
  }
  if (!fields.date.trim()) {
    return "Date is required";
  }
  if (!isNonEmpty(fields.recipientName)) {
    return "Recipient name is required";
  }
  if (!isNonEmpty(fields.address)) {
    return "Address is required";
  }
  if (!isValidPhoneNumber(fields.phoneNumber)) {
    return "Valid 10-digit phone number is required";
  }
  if (!isValidAmount(fields.amount)) {
    return "Amount is required and must be greater than 0";
  }
  return null;
}

export function validateExpenseForm(fields: {
  date: string;
  description: string;
  amount: string;
  paidBy: string;
}): string | null {
  if (!fields.date.trim()) {
    return "Date is required";
  }
  if (!isNonEmpty(fields.description)) {
    return "Description is required";
  }
  if (!isValidAmount(fields.amount)) {
    return "Amount is required and must be greater than 0";
  }
  if (!isNonEmpty(fields.paidBy)) {
    return "Paid by is required";
  }
  return null;
}

export function validateLoginForm(fields: {
  username: string;
  password: string;
}): string | null {
  if (!isNonEmpty(fields.username)) {
    return "Username is required";
  }
  if (!isNonEmpty(fields.password)) {
    return "Password is required";
  }
  return null;
}
