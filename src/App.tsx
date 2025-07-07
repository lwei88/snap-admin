import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import {
  CreateGuesser,
  EditGuesser,
  ForgotPasswordPage,
  ListGuesser,
  LoginPage,
  SetPasswordPage,
  ShowGuesser,
  defaultI18nProvider,
  supabaseAuthProvider,
} from "ra-supabase";
import products from "./products";
import { snapDataProvider, supabaseClient } from "./common/snapDataProvider";
import { UserInputed } from "./products/UserInputed";
import { Layout } from "./Layout";
const authProvider = supabaseAuthProvider(supabaseClient, {});

export const App = () => (
  <BrowserRouter>
    <Admin
      dataProvider={snapDataProvider}
      authProvider={authProvider}
      i18nProvider={defaultI18nProvider}
      loginPage={LoginPage}
      layout={Layout}
    >
      <Resource {...products} />
      <CustomRoutes>
        <Route path="/products/user-inputed" element={<UserInputed />} />
      </CustomRoutes>
      <Resource
        name="ingredients"
        list={ListGuesser}
        edit={EditGuesser}
        create={CreateGuesser}
        show={ShowGuesser}
      />
      <Resource
        name="categories"
        list={ListGuesser}
        edit={EditGuesser}
        create={CreateGuesser}
        show={ShowGuesser}
      />
      <CustomRoutes noLayout>
        <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
        <Route
          path={ForgotPasswordPage.path}
          element={<ForgotPasswordPage />}
        />
      </CustomRoutes>
    </Admin>
  </BrowserRouter>
);
