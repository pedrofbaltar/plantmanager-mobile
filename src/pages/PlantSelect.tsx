import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { useNavigation } from '@react-navigation/core';
import { Load } from '../components/Load';
import { PlantProps } from '../libs/storage';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filterdPlants, setFilterdPlants] = useState<PlantProps[]>([]);
  const [environmentSelected, setEnvironmentSelected] = useState('all');
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(true);

  const navigation = useNavigation();

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment);

    if (environment == 'all') {
      return setFilterdPlants(plants);
    }

    const filtered = plants.filter(plant => plant.environments.includes(environment));

    setFilterdPlants(filtered);
  }

  async function fetchPlants() {
    const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit-8`);

    if (!data) {
      return setLoading(true)
    }

    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data]);
      setFilterdPlants(oldValue => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilterdPlants(data);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return;
    }

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant });
    
  }

  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api.get('plants_environments?_sort=title&_order=asc');

      setEnvironments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data
      ])
    }

    fetchEnvironment();
  },[])

  useEffect(() => {
    fetchPlants();
  },[])

  if (loading) {
    return <Load />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
  
        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subTitle}>você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={environments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === environmentSelected}
              onPress={() => handleEnvironmentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filterdPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 32,
    paddingHorizontal: 32
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 32
  },
  subTitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    paddingRight: 64,
    marginLeft: 32,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center'
  }
});