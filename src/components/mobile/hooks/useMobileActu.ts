import { useState, useEffect } from "react";
import { postReportDescription } from "@src/services/feedbackService";
import { voteForSuggestion } from "@src/services/suggestionService";
import { apiService } from "@src/services/apiService";
import toast from "react-hot-toast";

export const useMobileActu = (item: any, type: string, userProfile: any) => {
  const isSuggestion = type === "suggestion";

  // --- ÉTATS ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localVotes, setLocalVotes] = useState(item.votes || 0);
  const [localCount, setLocalCount] = useState(item.count || 0);
  const [localDescriptions, setLocalDescriptions] = useState(
    item.descriptions || [],
  );
  const [solutionsCount, setSolutionsCount] = useState(
    item.solutionsCount ?? 0,
  );
  const [commentCount, setCommentCount] = useState(item.commentsCount || 0);
  const [selectedZoomImage, setSelectedZoomImage] = useState<string | null>(
    null,
  );
  const incrementSolutionsCount = () => {
    setSolutionsCount((prev: number) => prev + 1);
  };
  // États spécifiques demandés par les composants de signalement
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Modales
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showSolutionsList, setShowSolutionsList] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Sync des votes au montage
  useEffect(() => {
    if (!isSuggestion || !item.id) return;
    apiService
      .get(`/suggestions/${item.id}/votes`)
      .then((res) => res.data && setLocalVotes(res.data.votes))
      .catch((err) => console.error("Sync votes error", err));
  }, [item.id, isSuggestion]);

  const handleVoteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile?.id)
      return toast.error("Vous devez être connecté pour voter.");
    try {
      await voteForSuggestion(item.id);
      setLocalVotes((prev: number) => prev + 1);
      toast.success("Merci pour votre soutien !");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Vous avez déjà soutenu cette suggestion.");
      } else {
        toast.error("Erreur lors du vote.");
      }
    }
  };

  const handleReportConfirm = async (payload: any) => {
    try {
      const response = await postReportDescription(payload);
      setLocalCount((prev: number) => prev + 1);

      const newEntry = {
        id: response.data?.id || Date.now().toString(),
        description: payload.description,
        author: { pseudo: userProfile?.pseudo, avatar: userProfile?.avatar },
        createdAt: new Date().toISOString(),
      };
      setLocalDescriptions((prev: any[]) => [newEntry, ...prev]);
      setShowConfirmPopup(false);
      toast.success("Signalement ajouté !");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Erreur lors de l'ajout du signalement.",
      );
    }
  };

  return {
    state: {
      isExpanded,
      isResponseExpanded,
      showComments,
      localVotes,
      localCount,
      localDescriptions,
      solutionsCount,
      commentCount,
      selectedZoomImage,
      showSolutionModal,
      showSolutionsList,
      showConfirmPopup,
      localCommentsCounts,
      refreshKey,
    },
    actions: {
      setIsExpanded,
      setIsResponseExpanded,
      setShowComments,
      handleVoteClick,
      handleReportConfirm,
      setSelectedZoomImage,
      setShowSolutionModal,
      setShowSolutionsList,
      setShowConfirmPopup,
      setCommentCount,
      incrementSolutionsCount,
      setLocalCommentsCounts, // 🟢 Ajouté pour fixer l'erreur TS
      setRefreshKey, // 🟢 Ajouté pour fixer l'erreur TS
    },
  };
};
