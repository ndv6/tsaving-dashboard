export default function FormatLogDescription(description) {
  switch (description) {
    case 'MAIN_TO_VA':
      return 'Transfer From Main Acc to VA';
    case 'VA_TO_MAIN':
      return 'Transfer From VA To Main Acc';
    case 'DEPOSIT_TO_MAIN_ACCOUNT':
      return 'Deposit Balance';
    default:
      return '';
  }
}
