export function isCardExpired(expiry: string): boolean {
    // Expected format: MM/YY
    const [mm, yy] = expiry.split("/").map(Number);
    if (!mm || !yy) return true;
  
    const expiryDate = new Date(2000 + yy, mm); // month is 0-based, so this is next month
    const now = new Date();
  
    return expiryDate <= now;
  }