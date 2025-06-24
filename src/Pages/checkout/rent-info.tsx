const RentInfo: React.FC<{}> = ({}) => {
    return (
        <div className="flex flex-col gap-2 pt-2 text-sm">
            <div className="flex flex-col">
                <p>🏸 A fresh Mavis 350 shuttle will be given </p>
                <p className="font-bold text-xs">(rental charges applicable).</p>
            </div>  
            <div className="flex flex-col"> 
                <p>Joining an Open Play? </p>
                <p className="text-gray font-light text-xs">Renting the shuttle is mandatory.</p>
            </div>
            <div className="flex flex-col">
                <p>Booking a full court? </p>
                <p className="text-gray font-light text-xs">You can choose to rent a shuttle or bring your own!</p>
            </div>
        </div>
    )
}

export default RentInfo;