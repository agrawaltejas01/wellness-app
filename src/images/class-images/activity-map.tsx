import { ReactComponent as Yoga } from "./yoga.svg";
import { ReactComponent as Pilate } from "./pilate.svg";
import { ReactComponent as Swimming } from "./swimming.svg";
import { ReactComponent as Badminton } from "./badminton.svg";
import { ReactComponent as BadmintonIcon } from "./badminton-icon.svg";
import { ReactComponent as Hiit } from "./hiit.svg";
import { ReactComponent as Pt } from "./pt.svg";
import { ReactComponent as Strength } from "./strength.svg";
import { ReactComponent as Boxing } from "./boxing.svg";
import { ReactComponent as Zumba } from "./zumba.svg";
import { ReactComponent as Gym } from "./gym.svg";
import { ReactComponent as FitnessIcon } from "./fitness-icon.svg";
import { ReactComponent as Cricket } from "./cricket.svg";
import { ReactComponent as Dance } from "./dance.svg";
import { ReactComponent as Football } from "./football.svg";
import { ReactComponent as Pickleball } from "./pickleball.svg";
import { ReactComponent as PickleballIcon } from "./pickleball-icon.svg";
import { ReactComponent as GymDayPass } from "./gymdaypass.svg";
import { ReactComponent as Ride } from "./ride.svg"
import BadmintonKidsImg from "./badminton-coaching.png"
import shuttlecockIcon from "../activities/shuttlecock.png"
import fitnessIcon from "../activities/fitness.png"

const activityToSvgMap = (activity: string): JSX.Element => {
  activity = activity.toLowerCase();

  const yoga = (
    <span>
      <Yoga />
    </span>
  );
  const pilate = (
    <span>
      <Pilate />
    </span>
  );
  const swimming = (
    <span>
      <Swimming />
    </span>
  );
  const badminton = (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <img src={shuttlecockIcon} alt="Badminton" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
    </span>
  );
  const badmintonOld = (
    <span>
      <Badminton />
    </span>
  );
  const strength = (
    <span>
      <Strength />
    </span>
  );
  const hiit = (
    <span>
      <Hiit />
    </span>
  );
  const personaltraining = (
    <span>
      <Pt />
    </span>
  );
  const pt = (
    <span>
      <Pt />
    </span>
  );
  const boxing = (
    <span>
      <Boxing />
    </span>
  );
  const zumba = (
    <span>
      <Zumba />
    </span>
  );
  const gym = (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <img src={fitnessIcon} alt="Fitness" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
    </span>
  );
  const gymOld = (
    <span>
      <Gym />
    </span>
  );
  const dance = (
    <span>
      <Dance />
    </span>
  );
  const football = (
    <span>
      <Football />
    </span>
  );
  const pickleball = (
    <span>
      <PickleballIcon />
    </span>
  );
  const pickleballOld = (
    <span>
      <Pickleball />
    </span>
  );
  const cricket = (
    <span>
      <Cricket />
    </span>
  );
  const gymdaypass = (
    <span>
      <GymDayPass />
    </span>
  );
  const badmintonkids = (
    <span>
      <div style={{ width: '90px', height: '90px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={BadmintonKidsImg} alt="Badminton Kids" style={{ width: '90px', height: '90px' }} />
      </div>  
    </span>
  );

  const ride = (
    <span>
      <Ride />
    </span>
  );

  const empty = <span></span>;

  let map: object = {
    yoga: yoga,
    pilate: pilate,
    badminton: badminton,
    strength: strength,
    hiit: hiit,
    swimming: swimming,
    personaltraining: personaltraining,
    boxing: boxing,
    zumba: zumba,
    "kick boxing": boxing,
    gymming: gym,
    gym: gym,
    fitness: gym,
    cricket: cricket,
    dance: dance,
    pickleball: pickleball,
    football: football,
    gymdaypass: gymdaypass,
    "personal training": pt,
    ride: ride,
    "badmintonkids": badmintonkids,
  };

  if (map[activity as keyof object]) return map[activity as keyof object];
  else return empty;
};

export default activityToSvgMap;
