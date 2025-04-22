export function convertToCurrency(value: number): string {
  if (!value) {
    return '$0'
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  })
}
