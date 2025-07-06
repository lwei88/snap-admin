import {
  BooleanField,
  ChipField,
  ReferenceField,
  ReferenceManyField,
  ReferenceOneField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  useRecordContext,
} from "react-admin";

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

export const ProductShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" />
      <ProductImage />
      <ReferenceOneField
        label="category"
        target="product_id"
        reference="products_categories"
      >
        <ReferenceField source="category_id" reference="categories">
          <ChipField source="name" />
        </ReferenceField>
      </ReferenceOneField>
      <TextField source="brand" />
      <ReferenceManyField
        label="ingredients"
        target="product_id"
        reference="products_ingredients"
        sort={{ field: "ingredient_id", order: "ASC" }}
      >
        <SingleFieldList>
          <ReferenceField source="ingredient_id" reference="ingredients">
            <ChipField source="title" />
          </ReferenceField>
        </SingleFieldList>
      </ReferenceManyField>
      <TextField source="source_type" />
      <TextField source="source_place" />
      <TextField source="description" />
      <BooleanField source="approved" />
    </SimpleShowLayout>
  </Show>
);
