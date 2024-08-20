import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Drawer,
  DrawerItem,
  Layout,
  Text,
  IndexPath,
} from "@ui-kitten/components";

const { Navigator, Screen } = createDrawerNavigator();

const UsersScreen = () => (
  <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text category="h1">panoramadbraker</Text>
  </Layout>
);

const OrdersScreen = () => (
  <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text category="h1">Slaven</Text>
    <Text category="p">Katoenplukker 1</Text>
    <Text category="p">Katoenplukker 2</Text>
    <Text category="p">Katoenplukker 3</Text>
    <Text category="p">Katoenplukker 4</Text>
  </Layout>
);

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
  >
    <DrawerItem title="Users" />
    <DrawerItem title="Orders" />
  </Drawer>
);

export const DrawerNavigator = () => (
  <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Screen name="Users" component={UsersScreen} />
    <Screen name="Orders" component={OrdersScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <DrawerNavigator />
  </NavigationContainer>
);
