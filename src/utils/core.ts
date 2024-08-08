export function formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Check the length of the input
    const length = digitsOnly.length;
    
    if (length < 9 || length > 11) {
      throw new Error('Invalid phone number length. Must be 9, 10, or 11 digits.');
    }
    
    let formattedNumber: string;
    
    switch (length) {
      case 9:
        // For 9 digits, assume it's without the country code and area code
        formattedNumber = `+7(${digitsOnly.slice(0, 3)})${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 8)}-${digitsOnly.slice(8)}`;
        break;
      case 10:
        // For 10 digits, assume it's without the country code
        formattedNumber = `+7(${digitsOnly.slice(0, 3)})${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 8)}-${digitsOnly.slice(8)}`;
        break;
      case 11:
        // For 11 digits, check if it starts with 7 or 8
        if (digitsOnly.startsWith('7') || digitsOnly.startsWith('8')) {
          formattedNumber = `+7(${digitsOnly.slice(1, 4)})${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 9)}-${digitsOnly.slice(9)}`;
        } else {
          throw new Error('For 11-digit numbers, it must start with 7 or 8.');
        }
        break;
      default:
        throw new Error('Unexpected error occurred.');
    }
    
    return formattedNumber;
  }