/**
 * Permission utility functions
 */

/**
 * Check if user has a specific permission
 * @param {Object} userData - User data object containing roles and permissions
 * @param {string} permissionSlug - The permission slug to check (e.g., 'system-internal', 'view-dashboard')
 * @returns {boolean} - True if user has the permission, false otherwise
 */
export const hasPermission = (userData, permissionSlug) => {
  if (!userData || !userData.roles || !Array.isArray(userData.roles)) {
    return false;
  }

  return userData.roles.some(role => 
    role.permissions && Array.isArray(role.permissions) && 
    role.permissions.some(permission => permission.slug === permissionSlug)
  );
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} userData - User data object containing roles and permissions
 * @param {string[]} permissionSlugs - Array of permission slugs to check
 * @returns {boolean} - True if user has any of the permissions, false otherwise
 */
export const hasAnyPermission = (userData, permissionSlugs) => {
  if (!Array.isArray(permissionSlugs) || permissionSlugs.length === 0) {
    return false;
  }

  return permissionSlugs.some(permissionSlug => hasPermission(userData, permissionSlug));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} userData - User data object containing roles and permissions
 * @param {string[]} permissionSlugs - Array of permission slugs to check
 * @returns {boolean} - True if user has all permissions, false otherwise
 */
export const hasAllPermissions = (userData, permissionSlugs) => {
  if (!Array.isArray(permissionSlugs) || permissionSlugs.length === 0) {
    return false;
  }

  return permissionSlugs.every(permissionSlug => hasPermission(userData, permissionSlug));
};

/**
 * Get all permissions for a user
 * @param {Object} userData - User data object containing roles and permissions
 * @returns {string[]} - Array of permission slugs
 */
export const getUserPermissions = (userData) => {
  if (!userData || !userData.roles || !Array.isArray(userData.roles)) {
    return [];
  }

  const permissions = new Set();
  
  userData.roles.forEach(role => {
    if (role.permissions && Array.isArray(role.permissions)) {
      role.permissions.forEach(permission => {
        if (permission.slug) {
          permissions.add(permission.slug);
        }
      });
    }
  });

  return Array.from(permissions);
};

/**
 * Check if user has a specific role
 * @param {Object} userData - User data object containing roles
 * @param {string} roleSlug - The role slug to check
 * @returns {boolean} - True if user has the role, false otherwise
 */
export const hasRole = (userData, roleSlug) => {
  if (!userData || !userData.roles || !Array.isArray(userData.roles)) {
    return false;
  }

  return userData.roles.some(role => role.slug === roleSlug);
};
