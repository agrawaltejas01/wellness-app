import { useMutation } from "@tanstack/react-query";
import { getFeedbackReasons, getPendingFeedbacks, submitFeedback } from "../../apis/feedbacks/feedback";
import { useEffect, useState } from "react";
import {ReactComponent as EmptyStar} from "../../images/feedback/empty-star.svg";
import {ReactComponent as GoldenStar} from "../../images/feedback/golden-star.svg";
import { BottomUpModal } from "../profile/half-page-modal";
import { navigate } from "@reach/router";

interface FeedbackProps {
    showFeedback?: boolean;
}

const Feedback: React.FC<FeedbackProps> = ({showFeedback = false}) => {
    const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
    const userId = userDetails.id;
    const [feedback, setFeedback] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [clickedStar, setClickedStar] = useState(false);
    const [allFeedbackReasons, setAllFeedbackReasons] = useState<any>([]);
    const [feedbackReasons, setFeedbackReasons] = useState<any>(null);
    const [selectedReasons, setSelectedReasons] = useState<any>([false, false, false, false, false]);
    const [showOtherReasonModal, setShowOtherReasonModal] = useState(false);
    const [otherReason, setOtherReason] = useState('');
    const [status, setStatus] = useState('OPTED_OUT');
    
    const message = {
        1: "Oh no! We will fix this ASAP!",
        2: "We will look into this",
        3: "We will look into this",
        4: "We value your feedback",
        5: "Woohoo! Thanks for letting us know",
    }




    const {mutate: _getPendingFeedbacks} = useMutation({
        mutationFn: getPendingFeedbacks,
        onSuccess: (data) => {
            if(data.data.feedbacks?.length > 0) {
                setFeedback(data.data.feedbacks[0]);
                if(showFeedback) {
                    setShowRatingModal(true);
                } else {
                    setFeedbackModal(true);
                }
            } else {
                setShowRatingModal(false);
                setFeedbackModal(false);
                navigate('/', {replace: true});
            }
        },
        onError: (error) => {  
            setShowRatingModal(false);
            setFeedbackModal(false);
            navigate('/', {replace: true});
            console.log(error);
        }
    });

    const {mutate: _getFeedbackReasons} = useMutation({
        mutationFn: getFeedbackReasons,
        onSuccess: (data) => {
            setAllFeedbackReasons(data.data.reasons);
        },
        onError: (error) => {   
            console.log(error);
        },
        onSettled: () => {
            setFeedbackReasons(allFeedbackReasons.filter((reason: any) => reason.rating == rating).sort((a: any, b: any) => a.reason_text.length - b.reason_text.length));
        }
    });



    const {mutate: _submitFeedback} = useMutation({
        mutationFn: submitFeedback,
        onSuccess: (data) => {
            navigate('/feedback-thankyou', {state: {success: true}});
        },
        onError: (error) => {   
            console.log(error);
            navigate('/feedback-thankyou', {state: {success: false}});
        }
    });

    useEffect(() => {
        _getPendingFeedbacks(userId);
    }, []);

    useEffect(() => {
        if (feedback) {
            _getFeedbackReasons(feedback?.activity);
        }
    }, [feedback]);

    useEffect(() => {
        setFeedbackReasons(allFeedbackReasons.filter((reason: any) => reason.rating == rating).sort((a: any, b: any) => a.reason_text.length - b.reason_text.length));
    }, [rating]);

    // Initialize selectedReasons when feedbackReasons is loaded
    useEffect(() => {
        if (feedbackReasons && feedbackReasons.length > 0) {
            setSelectedReasons(new Array(feedbackReasons.length).fill(false));
        }
    }, [feedbackReasons]);

    const handleReasonClick = (index: number) => {
        const newSelectedReasons = [...selectedReasons];
        newSelectedReasons[index] = !newSelectedReasons[index];
        setSelectedReasons(newSelectedReasons);
    };

    const handleSubmit = (submitStatus: string = status) => {
        setShowRatingModal(false);

        if(submitStatus == 'OPTED_OUT' ){
            return;
        }
        
        // Get the reason IDs for selected reasons
        const selectedReasonIds = selectedReasons
            .map((isSelected: boolean, index: number) => isSelected ? feedbackReasons[index]?.id : 0)
            .filter((reasonId: number | null) => reasonId !== 0);

        _submitFeedback({
            userId, 
            feedbackId: feedback?.id,
            batchId: feedback?.batch_id,
            rating, 
            reasons: selectedReasonIds, 
            otherReason: otherReason ? otherReason : '', 
            status: submitStatus
        });
    }

    return (
        <>
        {feedbackModal && (
        <div className="bg-white shadow-upper-shadow rounded-t-2xl pt-1 pb-4">
            <p className="absolute right-2 top-0 text-gray-400 cursor-pointer text-2xl font-bold" onClick={() => {
                setFeedbackModal(false);
                handleSubmit('OPTED_OUT');
            }}>×</p>
            <div className="flex flex-col items-center justify-center pt-2 mb-4">
                <p className="text-xs text-gray pb-1">Rate your game</p>        
                <p className="text-sm text-gray-500 font-bold pb-2">{feedback?.gym_name} - {feedback?.activity.toLowerCase()}</p>
                <div className="flex flex-row items-center justify-center gap-2">
                    {Array.from({length: 5}).map((_, index) => (
                        rating >= index + 1 ? <GoldenStar className="w-5 h-5" /> : <EmptyStar className="w-5 h-5" onClick={() => {setRating(index + 1); setShowRatingModal(true); setFeedbackModal(false)}} />
                    ))}
                    {/* {rating >= 1 ? <GoldenStar className="w-5 h-5" /> : <EmptyStar className="w-5 h-5" onClick={() => {setRating(1); setShowRatingModal(true); setFeedbackModal(false)}} />}
                    {rating >= 2 ? <GoldenStar className="w-5 h-5" /> : <EmptyStar className="w-5 h-5" onClick={() => {setRating(2); setShowRatingModal(true); setFeedbackModal(false)}} />}
                    {rating >= 3 ? <GoldenStar className="w-5 h-5" /> : <EmptyStar className="w-5 h-5" onClick={() => {setRating(3); setShowRatingModal(true); setFeedbackModal(false)}} />}
                    {rating >= 4 ? <GoldenStar className="w-5 h-5" /> : <EmptyStar className="w-5 h-5" onClick={() => {setRating(4); setShowRatingModal(true); setFeedbackModal(false)}} />}
                    {rating >= 5 ? <GoldenStar className="w-5 h-5" /> : <EmptyStar className="w-5 h-5" onClick={() => {setRating(5); setShowRatingModal(true); setFeedbackModal(false)}} />} */}
                </div>
            </div>
        </div>
        )}
        {showRatingModal && (
            <BottomUpModal
                title="Rate your Sesh"
                isOpen={showRatingModal}
                onClose={() => {
                    setShowRatingModal(false);
                    handleSubmit('OPTED_OUT');
                }}
                children={
                    <div className="flex flex-col items-center justify-center px-4 pt-2 pb-4">
                        <p className="text-xs text-black pb-5">How was your {feedback?.activity.toLowerCase()} Sesh at {feedback?.gym_name}?</p>
                        <div className="flex flex-row gap-4 justify-between pb-5">
                            {Array.from({length: rating}).map((_, index) => (
                                <GoldenStar className={'w-10 h-10'} onClick={() => 
                                    { 
                                        if(rating != index + 1) {
                                            setRating(index + 1);
                                            setClickedStar(true);
                                            setSelectedReasons(new Array(feedbackReasons?.length || 0).fill(false));
                                        }
                                        // if(rating == 5) {
                                        //     setOtherReason('');
                                        // }
                                    }
                                } />
                            ))}
                            {Array.from({length: 5 - rating}).map((_, index) => (
                                <EmptyStar className={'w-10 h-10'} onClick={() => 
                                    {setRating(rating + index + 1); setClickedStar(true); setSelectedReasons(new Array(feedbackReasons?.length || 0).fill(false))}} />
                            ))}
                        </div>
                        {feedbackReasons && (
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-sm text-black pb-5 text-center font-bold">{message[rating as keyof typeof message]}</p>
                                <div className="flex flex-col gap-2 grid grid-cols-2 w-full mb-4">
                                    {feedbackReasons.map((reason: any, index: number) => {
                                        const isLastAndOdd = index === feedbackReasons.length - 1 && feedbackReasons.length % 2 === 1;
                                        
                                        return (
                                            <p className={`text-xs font-semibold text-center rounded-full p-4 cursor-pointer ${selectedReasons[index] ? 'bg-black text-white' : 'text-black bg-gray-100'} ${isLastAndOdd ? 'col-span-2' : ''}`} key={index} onClick={() => handleReasonClick(index)}>{reason.reason_text}</p>
                                        )
                                    })}     
                                </div>  
                            </div>
                        )}
                        
                        {rating > 0 && <div className={`text-sm font-semibold text-center rounded-full px-6 py-3 mb-4 cursor-pointer ${showOtherReasonModal ? 'bg-black text-white' : 'bg-gray-100 text-black'}`} 
                        onClick={() => {
                            setShowOtherReasonModal(!showOtherReasonModal);
                            setOtherReason('');
                        }}>
                            <p className={`${showOtherReasonModal ? 'text-white' : 'text-black'}`}>Other</p>
                        </div>}
                        {showOtherReasonModal && (
                            <div className="flex flex-col items-center justify-center mb-4 w-full mx-4">
                                <textarea className="w-full text-sm p-2 py-1 wrap border border-gray-300 rounded-md resize-y min-h-[100px]" placeholder="Feel free to share your thoughts" value={otherReason} onChange={(e) => setOtherReason(e.target.value)} rows={4} />
                            </div>
                        )}
                        <div className={`w-full text-center rounded-md mb-4 ${rating > 0 ? 'bg-black text-white cursor-pointer' : 'bg-gray-200 text-black pointer-events-none'}`} onClick={() => {
                            handleSubmit('SUBMITTED');
                        }}> 
                            <p className="text-md font-bold py-3">Submit</p>
                        </div>
                    </div>  

                }
            />
        )}
        </>
    );
};

export default Feedback;