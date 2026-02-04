export enum UserRole {
  admin = 'admin',
  moderator = 'moderator',
  customer = 'customer',
  developer = 'developer',
  tester = 'tester',
}

export type UserRoleKey = keyof UserRole;
