import Circle from "./circle";
import {ReactComponent as Edit} from '../images/edit/edit.svg';

// Define a type for the skill levels
export type SkillLevel = 'Beginner' | 'Amateur' | 'Intermediate' | 'Professional' | 'Unknown';


interface SkillCapsuleProps {
    level: SkillLevel;
    editable?: boolean;
}

const skillLevelBackgroundColorMap: Record<SkillLevel, string> = {
    'Beginner': 'rgba(107, 227, 156, 0.15)',
    'Amateur': 'rgba(255, 199, 91, 0.15)',
    'Intermediate': 'rgba(108, 160, 220, 0.15)',
    'Professional': 'rgba(156, 106, 222, 0.15)',
    'Unknown': 'rgba(0, 0, 0, 0.15)'
}

const skillLevelColor: Record<SkillLevel, string> = {
    'Beginner': '#6BE39C',
    'Amateur': '#FFC75B',
    'Intermediate': '#6CA0DC',
    'Professional': '#9C6ADE',
    'Unknown': 'black'
}

function capitalizeFirstLetters(str: string) {
    // Handle empty input
    if (!str) return str;
    
    // Split the string into words
    return str
      .split(' ')
      .map(word => {
        // Handle empty words
        if (word.length === 0) return word;
        
        // Capitalize first letter, make rest lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

const SkillCapsule = ({ level, editable }: SkillCapsuleProps) => {
    return (
        <div style={{
            display: 'flex',
            width: 'fit-content',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: skillLevelBackgroundColorMap[capitalizeFirstLetters(level) as SkillLevel],
            borderRadius: '20px',
            padding: '4px 4px',
            paddingRight: '12px'
        }}>
            <Circle
                radius={12}
                borderColor= {skillLevelColor[capitalizeFirstLetters(level) as SkillLevel]}
                borderStyle="solid"
                backgroundColor= {skillLevelColor[capitalizeFirstLetters(level) as SkillLevel]}
                character={capitalizeFirstLetters(level).charAt(0)}
            />
            <p style={{ fontSize: '14px', color: 'black', fontFamily: 'Plus Jakarta Sans' }}>
                {capitalizeFirstLetters(level)}
            </p>
            {editable && (
                <Edit />
            )}
        </div>
    );
};

export default SkillCapsule;