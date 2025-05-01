import { SkillLevel } from '../components/skill-capsule';

// Define the structure for individual player details
export interface PlayerDetails {
  id: string;
  name: string;
  age: number;
  skills: {
    name: string;
    level: SkillLevel;
  }[];
  // Add other player properties as needed
  position?: string;
  team?: string;
  experience?: number;
}

// Define playerData as an array of PlayerDetails
export type PlayerData = PlayerDetails[];

// Example usage:
// const playerData: PlayerData = [
//   {
//     id: '1',
//     name: 'John Doe',
//     age: 25,
//     skills: [
//       { name: 'Running', level: 'Professional' },
//       { name: 'Strength', level: 'Intermediate' }
//     ],
//     position: 'Forward',
//     team: 'Eagles'
//   },
//   // more players...
// ]; 