import { Alert, FlatList } from 'react-native';
import data from '../../assets/data/Menudata.json'
import Wrapper from '@/src/components/Wrapper';
import MenuItem from '@/src/components/MenuItem';
import { MenuItemType } from '@/src/models/MenuItemType';

export default function TabOneScreen() {
  return (
    <Wrapper>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }: { item: MenuItemType }) => (
          <MenuItem
            menu={item}
            onPress={()=> {Alert.alert("blablabla")}}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </Wrapper>

  );
}


