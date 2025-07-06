import {
  BooleanInput,
  Edit,
  SimpleForm,
  TextInput,
  useGetList,
  useDataProvider,
  useNotify,
  useRedirect,
  useRecordContext,
} from "react-admin";
import { useParams } from "react-router-dom";
import { IngredientAutocompleteInput } from "./IngredientAutocompleteInput";
import { useCallback } from "react";

import type { EditProps } from "react-admin";
import { CategoryAutocompleteInput } from "./categoryAutocompleteInput";

// handle save
interface ProductValues {
  id: string | number;
  title: string;
  brand: string;
  image_url: string;
  description: string;
  approved: boolean;
  ingredient_ids: number[];
}

export const ProductEdit = (props: EditProps) => {
  const { id } = useParams<{ id: string }>();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();

  // fetch this product ingredients ids (All)
  const {
    data: productsIngredientsIds = [],
    isPending: productsIngredientsIdsIsPending,
  } = useGetList("products_ingredients", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "ASC" },
    filter: { product_id: id },
  });

  // fetch this product categories id
  const {
    data: productCategories = [],
    isPending: productCategoriesIsPending,
  } = useGetList("products_categories", {
    pagination: { page: 1, perPage: 1 },
    filter: { product_id: id },
  });

  const productCategoryId = productCategories[0]?.category_id || 0;
  const productIngredientsIds = productsIngredientsIds.map(
    (item: { ingredient_id: number }) => item.ingredient_id,
  );

  const handleSave = useCallback(
    async (values: ProductValues) => {
      try {
        await dataProvider.update("products", {
          id: values.id,
          data: {
            title: values.title,
            brand: values.brand,
            image_url: values.image_url,
            description: values.description,
            approved: values.approved,
          },
          previousData: {
            id: values.id,
          },
        });

        await dataProvider.deleteMany("products_ingredients", {
          ids: productsIngredientsIds.map((item: { id: number }) => item.id),
        });
        await dataProvider.createMany("products_ingredients", {
          data: values.ingredient_ids.map((id) => ({
            product_id: values.id,
            ingredient_id: id,
          })),
        });

        await dataProvider.update("products_categories", {
          id: productCategories[0].id,
          data: { category_id: values.category_id },
          previousData: productCategories[0],
        });
        notify("Product updated successfully", { type: "info" });
        redirect("show", "products", values.id);
      } catch (error) {
        notify("Error occured ", { type: "warning" });
        console.error("Error updating product:", error);
      }
    },
    [dataProvider, notify, redirect, productsIngredientsIds, productCategories],
  );

  const ProductImage = () => {
    const record = useRecordContext();
    if (!record?.image_url) return null; // Handle case where record is not available
    return (
      <img
        src={
          "https://rkibefhseduyplktsyak.supabase.co/storage/v1/object/public/" +
          record.image_url
        }
        alt={record.title || "Product Image"}
        style={{ maxWidth: 400 }}
      />
    );
  };

  if (productsIngredientsIdsIsPending || productCategoriesIsPending)
    return null;
  return (
    <Edit {...props}>
      <SimpleForm
        onSubmit={handleSave}
        defaultValue={{
          category_id: productCategoryId,
          ingredient_ids: productIngredientsIds,
        }}
      >
        <ProductImage />
        <TextInput source="title" />
        <TextInput source="brand" />
        <CategoryAutocompleteInput defaultCategoryId={productCategoryId} />
        <IngredientAutocompleteInput
          defaultIngredientIds={productIngredientsIds}
        />
        <TextInput source="description" />
        <BooleanInput source="approved" />
      </SimpleForm>
    </Edit>
  );
};
