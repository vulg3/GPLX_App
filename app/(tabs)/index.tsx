import { Alert, FlatList } from 'react-native';
import data from '../../assets/data/Menudata.json'
import Wrapper from '@/src/components/Wrapper';
import MenuItem from '@/src/components/MenuItem';
import { MenuItemType } from '@/src/models/MenuItemType';
import { makeStyles, useTheme } from '@rneui/themed';


export default function TabOneScreen() {
  const styles = useStyles();
  const { theme: { colors } } = useTheme();

  return (
    <Wrapper containerStyle={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }: { item: MenuItemType }) => (
          <MenuItem
            menu={item}
            onPress={() => { Alert.alert("blablabla") }}
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
