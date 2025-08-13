import { FlatList } from 'react-native';
import { makeStyles, useTheme } from '@rneui/themed';
import { Wrapper } from '@/src/components';
import LicenseItem from '@/src/components/LicenseItem';
import data from '../assets/data/License.json'
import { LicenseItemType } from '@/src/models/LicenseItemType';
import React, { useState } from 'react';

export default function ModalScreen() {
  const styles = useStyles();
  const { theme: { colors } } = useTheme();

  const [selectedId, setSelectedId] = useState<string>(data[0]?._id || "");

  return (
    <Wrapper containerStyle={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }: { item: LicenseItemType }) => (
          <LicenseItem
            description={item}
            isSelected={selectedId === item._id}
            onPress={() => setSelectedId(item._id)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </Wrapper>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  container: {
    backgroundColor: colors.background
  },
}));