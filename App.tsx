import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { CustomCardsScreen } from './src/screens/CustomCardsScreen';
import { PlayersScreen } from './src/screens/PlayersScreen';
import { GameScreen } from './src/screens/GameScreen';
import { TurnSummaryScreen } from './src/screens/TurnSummaryScreen';

// Types & Data / Services
import { Card, defaultCards } from './src/data/defaultCards';
import { importedCards } from './src/data/importedCards';
import { Player } from './src/components/ScoreModal';
import { getGameSettings, getCustomCards, GameSettings, defaultSettings } from './src/services/storage';

type ScreenState = 'home' | 'players' | 'game' | 'summary' | 'custom_cards' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [passadorIndex, setPassadorIndex] = useState(0);
  const [currentTurnCorrect, setCurrentTurnCorrect] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedSettings = await getGameSettings();
        setSettings(savedSettings);
      } catch (e) {
        console.error('Failed to initialize settings:', e);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  // Shuffle Helper
  const shuffleDeck = (cards: Card[]): Card[] => {
    const arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Start the game setup (players are passed from PlayersScreen)
  const handleStartGame = async (playerNames: string[]) => {
    setIsLoading(true);
    try {
      // 1. Build & Shuffle Deck (Default + Imported + Custom Cards)
      const customCards = await getCustomCards();
      const combined = [...defaultCards, ...importedCards, ...customCards];
      const shuffled = shuffleDeck(combined);
      setDeck(shuffled);

      // 2. Initialize Players scores
      const gamePlayers: Player[] = playerNames.map((name, index) => ({
        id: `player_${index}_${Date.now()}`,
        name,
        score: 0,
      }));
      setPlayers(gamePlayers);

      // 3. Reset index & states
      setPassadorIndex(0);
      setCurrentTurnCorrect(0);

      // 4. Reload latest settings in case they changed
      const currentSettings = await getGameSettings();
      setSettings(currentSettings);

      // 5. Navigate to game
      setCurrentScreen('game');
    } catch (e) {
      console.error('Failed to start game:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTurnEnd = (correctCount: number, updatedPlayers: Player[]) => {
    setCurrentTurnCorrect(correctCount);
    setPlayers(updatedPlayers);
    setCurrentScreen('summary');
  };

  const handleNextTurn = () => {
    // Advance passador to the next player in the list
    const nextIdx = (passadorIndex + 1) % players.length;
    setPassadorIndex(nextIdx);
    setCurrentTurnCorrect(0);
    setCurrentScreen('game');
  };

  const handleQuitGame = () => {
    setPlayers([]);
    setDeck([]);
    setPassadorIndex(0);
    setCurrentTurnCorrect(0);
    setCurrentScreen('home');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {currentScreen === 'home' && (
        <HomeScreen
          onPlay={() => setCurrentScreen('players')}
          onCustomCards={() => setCurrentScreen('custom_cards')}
          onSettings={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'custom_cards' && (
        <CustomCardsScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'players' && (
        <PlayersScreen
          onBack={() => setCurrentScreen('home')}
          onStartGame={handleStartGame}
        />
      )}

      {currentScreen === 'game' && deck.length > 0 && (
        <GameScreen
          players={players}
          settings={settings}
          deck={deck}
          passadorIndex={passadorIndex}
          onTurnEnd={handleTurnEnd}
          onQuit={handleQuitGame}
        />
      )}

      {currentScreen === 'summary' && (
        <TurnSummaryScreen
          players={players}
          passadorIndex={passadorIndex}
          correctCount={currentTurnCorrect}
          onNextTurn={handleNextTurn}
          onQuit={handleQuitGame}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C14',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0C0C14',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
