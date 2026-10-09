import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../data/defaultCards';

const CUSTOM_CARDS_KEY = '@nao_pode:custom_cards';
const GAME_SETTINGS_KEY = '@nao_pode:settings';
const SAVED_PLAYERS_KEY = '@nao_pode:players';

export interface GameSettings {
  mode: 'time' | 'rounds';
  defaultTime: number; // in seconds, default 60
  cardsPerRound: number; // default 10
}

export const defaultSettings: GameSettings = {
  mode: 'time',
  defaultTime: 60,
  cardsPerRound: 10,
};

// --- Custom Cards ---
export const getCustomCards = async (): Promise<Card[]> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOM_CARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading custom cards:', error);
    return [];
  }
};

export const saveCustomCard = async (word: string, forbidden: string[]): Promise<Card[]> => {
  try {
    const cards = await getCustomCards();
    const newCard: Card = {
      id: `custom_${Date.now()}`,
      word,
      forbidden: forbidden.filter(w => w.trim() !== ''),
      custom: true,
    };
    const updatedCards = [...cards, newCard];
    await AsyncStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(updatedCards));
    return updatedCards;
  } catch (error) {
    console.error('Error saving custom card:', error);
    return [];
  }
};

export const deleteCustomCard = async (id: string): Promise<Card[]> => {
  try {
    const cards = await getCustomCards();
    const updatedCards = cards.filter(card => card.id !== id);
    await AsyncStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(updatedCards));
    return updatedCards;
  } catch (error) {
    console.error('Error deleting custom card:', error);
    return [];
  }
};

// --- Game Settings ---
export const getGameSettings = async (): Promise<GameSettings> => {
  try {
    const data = await AsyncStorage.getItem(GAME_SETTINGS_KEY);
    return data ? JSON.parse(data) : defaultSettings;
  } catch (error) {
    console.error('Error reading settings:', error);
    return defaultSettings;
  }
};

export const saveGameSettings = async (settings: GameSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(GAME_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// --- Saved Players ---
export const getSavedPlayers = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(SAVED_PLAYERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading saved players:', error);
    return [];
  }
};

export const saveSavedPlayers = async (players: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SAVED_PLAYERS_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players:', error);
  }
};
