export const getCityFromAddress = (address) => {
  if (!address) return null;
  const parts = address.split(",").map(p => p.trim());
  if (parts.length >= 3) {
    return parts[parts.length - 3];
  }
  return parts[0];
};