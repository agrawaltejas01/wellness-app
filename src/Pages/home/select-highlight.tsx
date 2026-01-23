import { navigate } from "@reach/router";
import { useState } from "react";
import { Mixpanel } from "../../mixpanel/init";
import { useMutation } from "@tanstack/react-query";
import { addUserHighlight } from "../../apis/highlights/highlights";

const SelectHighlight = ({highlights, setFinalSelectedHighlight, matchId, batchId, setShowStatsModal, setShowSelectHighlightsModal, setSelectedBatchId}: {highlights: any[], setFinalSelectedHighlight: (highlight: any) => void, matchId: number, batchId: number | null, setShowStatsModal: (show: boolean) => void, setShowSelectHighlightsModal: (show: boolean) => void, setSelectedBatchId: (batchId: number | null) => void}) => {
    
    const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
    const [selectedHighlight, setSelectedHighlight] = useState<any>(null);
    const filteredHighlights = highlights.filter((highlight: any) => highlight.match_id == matchId && highlight.batch_id == batchId);
    const sortedHighlights = filteredHighlights.sort((a: any, b: any) => a.player_id - b.player_id);
    const userDetails = JSON.parse(window.localStorage["zenfitx-user-details"] || '{}');
    const userId = userDetails.id;
    
    const handleSelectHighlight = (id: string) => {
        setSelectedHighlightId(id);
    }
    
    const { mutate: _addUserHighlight } = useMutation({
        mutationFn: (highlightId: string) => addUserHighlight(userId, highlightId),
        onSuccess: (data) => {  
            console.log("data", data);
        },
        onError: (error) => {
            console.log("error", error);
        }
    });

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
            _addUserHighlight(selectedHighlightId);
            setShowSelectHighlightsModal(false);
            navigate("/stats", { state: { highlight_link: selectedHighlight?.highlight_link, rally_link: selectedHighlight?.rally_link, heatmap_link: heatmaps, playerId: selectedHighlight?.player_id } });
        }
    }
    
    return (
        <div className="flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden pt-4">

            {/* Content */}
            <div className="px-6 pb-4">
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                    {sortedHighlights.map((highlight: any, index: number) => {
                        const isSelected = selectedHighlightId === highlight.id;
                        return (
                            <div
                                key={highlight.id}
                                onClick={() => handleSelectHighlight(highlight.id)}
                                className={`relative cursor-pointer group transform transition-all duration-300 ${
                                    isSelected ? 'scale-100' : 'hover:scale-102'
                                }`}
                            >
                                {/* Selection Ring */}
                                <div className={`absolute -inset-2 rounded-3xl transition-all duration-300 ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-2xl'
                                        : 'bg-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-100 group-hover:to-purple-100'
                                }`} style={{ zIndex: -1 }}></div>

                                {/* Card */}
                                <div className={`relative overflow-hidden rounded-3xl shadow-lg transition-all duration-300 ${
                                    isSelected
                                        ? 'shadow-2xl shadow-indigo-500/30'
                                        : 'shadow-gray-200 hover:shadow-xl'
                                }`}>
                                    {/* Image */}
                                    <div className="relative h-36 overflow-hidden">
                                        <img
                                            src={highlight.thumbnail_link}
                                            alt={`Player ${highlight.player_id}`}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                                        {/* Selection Indicator */}
                                        <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isSelected
                                                ? 'bg-white shadow-lg scale-110'
                                                : 'bg-transparent scale-110'
                                        }`}>
                                            {isSelected ? (
                                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Footer */}
                                    <div className={`px-3 py-2 text-center transition-all duration-300 ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                            : 'bg-gray-50 text-gray-700 group-hover:bg-gray-100'
                                    }`}>
                                        <h3 className="font-bold text-sm">
                                            Player {highlight.player_id}
                                        </h3>
                                        <p className={`text-xs mt-1 transition-colors duration-300 ${
                                            isSelected ? 'text-indigo-100' : 'text-gray-500'
                                        }`}>
                                            {isSelected ? 'Selected' : 'Tap to select'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 flex gap-3">
                <button
                    onClick={() => {
                        setShowSelectHighlightsModal(false);
                        setSelectedBatchId(null);
                    }}
                    className="flex-1 py-3 px-6 rounded-2xl font-bold text-center transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                >
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={!selectedHighlightId}
                    className={`flex-1 py-3 px-6 rounded-2xl font-bold text-center transition-all duration-300 transform ${
                        selectedHighlightId
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SelectHighlight;