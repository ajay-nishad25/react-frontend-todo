// export function getValidEmailCheck(email) {
//   if (!email) return false;

//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//   return emailRegex.test(email.trim());
// }

export function getValidEmailCheck(email) {
  // Check if email exists and is a string
  if (!email || typeof email !== "string") return false;

  const trimmedEmail = email.trim();

  // Check minimum structure (must have @ and .)
  if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) return false;

  // Check max length (RFC 5321)
  if (trimmedEmail.length > 254) return false;

  // Split into local and domain parts
  const parts = trimmedEmail.split("@");

  // Must have exactly one @
  if (parts.length !== 2) return false;

  const [local, domain] = parts;

  // Validate local part (before @)
  if (!local || local.length > 64) return false;
  if (local.startsWith(".") || local.endsWith(".")) return false;
  if (local.includes("..")) return false;

  // Validate domain part (after @)
  if (!domain || domain.length > 255) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  if (domain.startsWith("-") || domain.endsWith("-")) return false;
  if (domain.includes("..")) return false;

  // Check domain has at least one dot and valid TLD
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;

  // Validate TLD (last part of domain)
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;

  // Basic regex pattern (allows common characters)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(trimmedEmail);
}
