const BookNowFooterV2 = ({showDiscount = true, price, discountPrice}: {showDiscount?: boolean, price: number, discountPrice: number}) => {
    return (
        <div className="flex flex-col text-center fixed bottom-0 w-full justify-center bg-white">
            <div className="bg-discountStrip text-white text-sm text-center pt-1 pb-1">
                {'50% off on your first booking through app!'}
            </div>
            <div className="flex flex-row justify-between">  
                <div className="flex flex-col w-1/2 justify-center py-2 px-8">
                    <div className="flex flex-row justify-center">
                        <p className="text-xl font-bold">₹ {discountPrice}</p>
                        {showDiscount && <p className="text-sm line-through ml-1 self-end text-gray">₹ {price}</p>}
                    </div>
                    <div className="flex flex-row justify-center">
                        <p className="text-sm font-Jakarta-Sans text-gray">Price per slot</p>
                    </div>
                </div>
                <div className="justify-center w-1/2 py-4 px-4">
                    <button className="font-bold text-center bg-black rounded-lg text-lg font-Jakarta-Sans py-3 px-4 text-white"> Book Now </button>
                </div>
            </div>
        </div>
    )
}

export default BookNowFooterV2;