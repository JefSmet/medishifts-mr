import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text, IconRegistry } from "@ui-kitten/components";
import {AppNavigator} from "./components/AppNavigator";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <AppNavigator />
    </ApplicationProvider>
  </>
);
