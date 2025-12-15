import { navigate } from "@reach/router";
import { useState } from "react";
import { Mixpanel } from "../../mixpanel/init";

const SelectHighlight = ({highlights, setFinalSelectedHighlight, matchId, batchId, setShowStatsModal, setShowSelectHighlightsModal}: {highlights: any[], setFinalSelectedHighlight: (highlight: any) => void, matchId: number, batchId: number, setShowStatsModal: (show: boolean) => void, setShowSelectHighlightsModal: (show: boolean) => void}) => {
    
    const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
    const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
    const filteredHighlights = highlights.filter((highlight: any) => highlight.match_id == matchId && highlight.batch_id == batchId);
    const sortedHighlights = filteredHighlights.sort((a: any, b: any) => a.player_id - b.player_id);
    const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
    const userId = userDetails.id;
    
    const handleSelectHighlight = (id: string) => {
        setSelectedHighlightId(id);
    }
    
    const handleContinue = () => {
        if (selectedHighlightId) {

            Mixpanel.track("selected_highlight", {
                userId: userId,
                highlightId: selectedHighlightId,
            });

            const heatmaps = sortedHighlights.map((highlight: any) => highlight.heatmap_link).join(',');

            const selectedHighlight = sortedHighlights.find((highlight: any) => highlight.id === selectedHighlightId);
            setFinalSelectedHighlight(selectedHighlight);
            // setShowStatsModal(true);
            setShowSelectHighlightsModal(false);
            navigate("/stats", { state: { highlight_link: selectedHighlight?.highlight_link, rally_link: selectedHighlight?.rally_link, heatmap_link: heatmaps } });
        }
    }
    
    return (
        <div>
        <div className="flex flex-col gap-4 px-4 pb-4">  
            <h1 className="text-base font-bold text-black">Please identify yourself</h1>
            <div className="grid grid-cols-2 gap-4">
                    {sortedHighlights.map((highlight: any) => {
                        const isSelected = selectedHighlightId === highlight.id;
                        return (
                        <div 
                            key={highlight.id}
                            onClick={() => handleSelectHighlight(highlight.id)}
                            className="cursor-pointer"
                        >
                            <div 
                                className={`relative flex flex-col gap-2 p-2 rounded-t-3xl shadow-lg transition-all duration-300 overflow-hidden border-4 ${
                                    isSelected 
                                        ? 'border-black shadow-[0_0_25px_rgba(0,0,0,0.3)]' 
                                        : 'border-gray-300'
                                }`}
                            >
                                <div className="h-40 w-full overflow-hidden rounded-xl">
                                    <img 
                                        src={highlight.thumbnail_link} 
                                        alt="Highlight" 
                                        className="w-full h-[320px] object-cover object-top"
                                        style={{ marginTop: '0' }}
                                    />
                                </div>
                                {isSelected && (
                                    <div className="absolute top-4 right-4 bg-black rounded-full p-2 shadow-lg animate-[scale-in_0.3s_ease-in-out]">
                                        <svg 
                                            className="w-5 h-5 text-white" 
                                            fill="none" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="3" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <h1 className={`text-sm rounded-b-3xl font-bold text-center p-3 transition-all duration-300 ${
                                isSelected 
                                    ? 'bg-black text-white shadow-lg' 
                                    : 'bg-gray-300 text-gray-500'
                            }`}>
                                Player {highlight.player_id}
                            </h1>
                        </div>
                    )})} 
            </div>
        </div>
        <button 
            onClick={handleContinue}
            disabled={!selectedHighlightId}
            className={`w-full font-bold text-center rounded-3xl p-4 mx-4 mb-4 transition-all duration-300 ${
                selectedHighlightId 
                    ? 'bg-black text-white cursor-pointer hover:bg-gray-900 active:scale-95 shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={{ width: 'calc(100% - 2rem)' }}
        >
            Continue
        </button>  
        </div>
    );
};

export default SelectHighlight;