import React from 'react';
import { Card, Input } from 'antd';
import { ParticipantDetail } from '../../types/gyms';


interface ParticipantDetailsFormProps {
  noOfGuests: number;
  participants: ParticipantDetail[];
  setParticipants: (participants: ParticipantDetail[]) => void;
  participantErrors: { [key: string]: string };
}

const ParticipantDetailsForm: React.FC<ParticipantDetailsFormProps> = ({ 
  noOfGuests, 
  participants = [], // Provide default empty array
  setParticipants,
  participantErrors
}) => {
  const jerseySize = ["XS", "S", "M", "L", "XL", "XXL"];

  // Ensure we have enough participant objects
  React.useEffect(() => {
    if (participants.length < noOfGuests) {
      const newParticipants = [...participants];
      for (let i = participants.length; i < noOfGuests; i++) {
        newParticipants.push({
          participantName: '',
          participantAge: 0,
          participantGender: "",
        //   jerseyName: '',
        //   jerseySize: ''
        });
      }
      setParticipants(newParticipants);
    }
  }, [noOfGuests, participants.length]);

  const handleInputChange = (index: number, field: keyof ParticipantDetail, value: string) => {
    const updatedParticipants = [...participants];
    if (!updatedParticipants[index]) {
      updatedParticipants[index] = {
        participantName: '',
        participantAge: 0,
        participantGender: "",
        // jerseyName: '',
        // jerseySize: ''
      };
    }
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };
    setParticipants(updatedParticipants);
  };

//   const handleSizeSelect = (index: number, size: string) => {
//     const updatedParticipants = [...participants];
//     if (!updatedParticipants[index]) {
//       updatedParticipants[index] = {
//         participantName: '',
//         jerseyName: '',
//         jerseySize: ''
//       };
//     }
//     updatedParticipants[index] = {
//       ...updatedParticipants[index],
//       jerseySize: size
//     };
//     setParticipants(updatedParticipants);
//   };

  const getParticipantValue = (index: number, field: keyof ParticipantDetail) => {
    return participants[index]?.[field] || '';
  };

//   const isJerseySizeSelected = (index: number, size: string) => {
//     return participants[index]?.jerseySize === size;
//   };

  return (
    <div className="flex flex-col gap-4">
      {[...Array(noOfGuests)].map((_, index) => (
        <Card 
          key={index} 
          className="w-full bg-white shadow-none" 
          style={{ marginBottom: 0 }}
          bodyStyle={{ padding: '16px 24px' }}
        >
          <div className="space-y-4">
            <div className="font-medium text-base" style={{ marginBottom: 16 }}>
              Participant {index + 1}
            </div>
            
            {/* Participant Name */}
            <div style={{ marginBottom: 16 }}>
              <label className="text-sm text-gray-600 block" style={{ marginBottom: 8 }}>
                Participant Name*
              </label>
              <Input 
                placeholder="Enter participant name"
                className="w-full"
                value={getParticipantValue(index, 'participantName')}
                onChange={(e) => handleInputChange(index, 'participantName', e.target.value)}
                status={participantErrors[`participant_${index}_name`] ? 'error' : ''}
              />
              {participantErrors[`participant_${index}_name`] && (
                <div className="text-red-500 text-sm mt-1">
                  {participantErrors[`participant_${index}_name`]}
                </div>
              )}
            </div>
            
            {/* Jersey Name */}
            {/* <div style={{ marginBottom: 16 }}>
              <label className="text-sm text-gray-600 block" style={{ marginBottom: 8 }}>
                Jersey Name (Optional)
              </label>
              <Input 
                placeholder="Name to print on jersey"
                className="w-full"
                value={getParticipantValue(index, 'jerseyName')}
                onChange={(e) => handleInputChange(index, 'jerseyName', e.target.value)}
              />
            </div> */}
            
            {/* Jersey Size */}
            {/* <div>
              <label className="text-sm text-gray-600 block" style={{ marginBottom: 8 }}>
                Jersey Size*
              </label>
              <div className="flex flex-wrap gap-2">
                {jerseySize.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`px-4 py-2 border rounded-md ${
                      isJerseySizeSelected(index, size)
                        ? 'bg-blue-50 border-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                    style={{ 
                      borderColor: isJerseySizeSelected(index, size) ? '#2563eb' : '#E8E8E8',
                      minWidth: '48px',
                      textAlign: 'center'
                    }}
                    onClick={() => handleSizeSelect(index, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {participantErrors[`participant_${index}_size`] && (
                <div className="text-red-500 text-sm mt-1">
                  {participantErrors[`participant_${index}_size`]}
                </div>
              )}
            </div> */}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ParticipantDetailsForm;