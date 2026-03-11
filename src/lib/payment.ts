export interface PaymentCalculation {
  totalAmount: number;
  companySubsidy: number;
  employeePayment: number;
  platformFee: number;
  beauticianPayout: number;
}

export function calculatePayment(
  servicePrice: number,
  contract: { subsidyPercentage: number; maxSubsidyPerUse: number },
  platformFeePercent: number = 20
): PaymentCalculation {
  const totalAmount = servicePrice;
  const rawSubsidy = totalAmount * (contract.subsidyPercentage / 100);
  const companySubsidy = Math.min(rawSubsidy, contract.maxSubsidyPerUse);
  const employeePayment = totalAmount - companySubsidy;
  const platformFee = totalAmount * (platformFeePercent / 100);
  const beauticianPayout = totalAmount - platformFee;

  return {
    totalAmount,
    companySubsidy,
    employeePayment,
    platformFee,
    beauticianPayout,
  };
}
