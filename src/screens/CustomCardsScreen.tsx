import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { getCustomCards, saveCustomCard, deleteCustomCard } from '../services/storage';
import { Card } from '../data/defaultCards';
import { NeonButton } from '../components/NeonButton';

interface CustomCardsScreenProps {
  onBack: () => void;
}

export const CustomCardsScreen: React.FC<CustomCardsScreenProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [word, setWord] = useState('');
  const [forbidden, setForbidden] = useState<string[]>(['', '', '', '', '']);
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const custom = await getCustomCards();
    setCards(custom);
  };

  const handleForbiddenChange = (text: string, index: number) => {
    const updated = [...forbidden];
    updated[index] = text;
    setForbidden(updated);
  };

  const handleAddCard = async () => {
    setErrorMsg('');
    const trimmedWord = word.trim();
    const filteredForbidden = forbidden.map(w => w.trim()).filter(w => w !== '');

    if (!trimmedWord) {
      setErrorMsg('A palavra principal não pode ser vazia!');
      return;
    }

    if (filteredForbidden.length < 5) {
      setErrorMsg('Você precisa definir exatamente 5 palavras proibidas!');
      return;
    }

    const updated = await saveCustomCard(trimmedWord, filteredForbidden);
    setCards(updated);
    
    // Clear form
    setWord('');
    setForbidden(['', '', '', '', '']);
    setActiveTab('list');
  };

  const handleDeleteCard = async (id: string) => {
    const updated = await deleteCustomCard(id);
    setCards(updated);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>CARTAS CUSTOM</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.tabActivePink]}
          onPress={() => setActiveTab('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>Criar Carta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.tabActivePurple]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>
            Minhas Cartas ({cards.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {activeTab === 'create' ? (
          <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>PALAVRA PRINCIPAL</Text>
              <TextInput
                style={styles.inputTarget}
                placeholder="Ex: COMPUTADOR"
                placeholderTextColor="#4E4E6A"
                value={word}
                onChangeText={setWord}
                autoCapitalize="characters"
              />

              <Text style={[styles.inputLabel, { marginTop: 20, color: '#FF3131' }]}>
                5 PALAVRAS PROIBIDAS
              </Text>
              {forbidden.map((val, idx) => (
                <TextInput
                  key={`forbidden-input-${idx}`}
                  style={styles.inputForbidden}
                  placeholder={`Palavra proibida ${idx + 1}`}
                  placeholderTextColor="#4E4E6A"
                  value={val}
                  onChangeText={(text) => handleForbiddenChange(text, idx)}
                  autoCapitalize="characters"
                />
              ))}

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              <NeonButton
                title="Salvar Carta"
                onPress={handleAddCard}
                variant="pink"
                style={styles.saveBtn}
              />
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.cardItem}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTarget}>{item.word}</Text>
                  <Text style={styles.cardForbiddenList} numberOfLines={1}>
                    {item.forbidden.join(', ')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteCard(item.id)}
                >
                  <Text style={styles.deleteBtnText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma carta criada ainda.</Text>
                <Text style={styles.emptySubtext}>Use a aba "Criar Carta" para adicionar a primeira!</Text>
              </View>
            }
          />
        )}
      </View>

      <View style={styles.footer}>
        <NeonButton title="Voltar" onPress={onBack} variant="purple" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C14',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF007F',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#FF007F',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#161625',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabActivePink: {
    borderColor: '#FF007F',
  },
  tabActivePurple: {
    borderColor: '#BB86FC',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8A8A9E',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
  },
  formScroll: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  formContainer: {
    backgroundColor: '#161625',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2C2C4E',
    padding: 20,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF007F',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  inputTarget: {
    backgroundColor: '#0C0C14',
    borderWidth: 1,
    borderColor: '#FF007F',
    borderRadius: 10,
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  inputForbidden: {
    backgroundColor: '#0C0C14',
    borderWidth: 1,
    borderColor: '#FF3131',
    borderRadius: 10,
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    marginVertical: 4,
  },
  errorText: {
    color: '#FF3131',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
  },
  saveBtn: {
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 10,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161625',
    borderWidth: 1,
    borderColor: '#2C2C4E',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  cardTarget: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF007F',
    textTransform: 'uppercase',
  },
  cardForbiddenList: {
    fontSize: 13,
    color: '#8A8A9E',
    marginTop: 4,
  },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FF3131',
    backgroundColor: 'rgba(255, 49, 49, 0.05)',
    borderRadius: 8,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF3131',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#8A8A9E',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0C0C14',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#161625',
  },
});
