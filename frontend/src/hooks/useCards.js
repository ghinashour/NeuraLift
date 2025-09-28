import { useCardsContext } from '../context/CardsContext';

export function useCards() {
  const { state, dispatch } = useCardsContext();

  const addCard = (card) => {
    dispatch({ type: 'ADD_CARD', payload: card });
  };

  const updateCard = (card) => {
    dispatch({ type: 'UPDATE_CARD', payload: card });
  };

  const deleteCard = (cardId) => {
    dispatch({ type: 'DELETE_CARD', payload: cardId });
  };

  const setSelectedCard = (card) => {
    dispatch({ type: 'SET_SELECTED_CARD', payload: card });
  };

  const toggleModal = (isOpen) => {
    dispatch({ type: 'TOGGLE_MODAL', payload: isOpen });
  };

  return {
    cards: state.cards,
    selectedCard: state.selectedCard,
    isModalOpen: state.isModalOpen,
    addCard,
    updateCard,
    deleteCard,
    setSelectedCard,
    toggleModal
  };
}