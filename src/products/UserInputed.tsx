import { Chip } from "@mui/material";
import {
  BooleanField,
  ChipField,
  DataTable,
  EditButton,
  List,
  ReferenceField,
  ReferenceManyField,
  ReferenceOneField,
  SingleFieldList,
  TextInput,
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
      style={{ maxWidth: 200 }}
    />
  );
};

const QuickFilter = ({
  label,
}: {
  label: string;
  source?: string;
  defaultValue?: any;
}) => {
  return <Chip sx={{ marginBottom: 1 }} label={label} />;
};

const filters = [
  <TextInput source="title@ilike" alwaysOn />,
  <QuickFilter source="approved" label="Not approved" defaultValue={false} />,
];

export const UserInputed = () => (
  <List
    resource="products"
    filters={filters}
    filter={{ source_type: "user_inputed" }}
  >
    <DataTable rowClick={false}>
      <DataTable.Col width={200}>
        <ProductImage />
      </DataTable.Col>
      <DataTable.Col source="title" />
      <DataTable.Col source="brand" />
      <DataTable.Col label="category">
        <ReferenceOneField
          target="product_id"
          reference="products_categories"
          link={false}
        >
          <ReferenceField source="category_id" reference="categories">
            <ChipField source="name" />
          </ReferenceField>
        </ReferenceOneField>
      </DataTable.Col>
      <DataTable.Col label="ingredients">
        <ReferenceManyField
          target="product_id"
          reference="products_ingredients"
          perPage={5}
          sort={{ field: "ingredient_id", order: "ASC" }}
        >
          <SingleFieldList linkType={false}>
            <ReferenceField source="ingredient_id" reference="ingredients">
              <ChipField source="title" />
            </ReferenceField>
          </SingleFieldList>
        </ReferenceManyField>
      </DataTable.Col>
      <DataTable.Col source="source_place" />
      <DataTable.Col source="approved">
        <BooleanField source="approved" />
      </DataTable.Col>
      <DataTable.Col label="Actions">
        <EditButton
          sx={{
            minWidth: "80px",
            bgcolor: "primary.main",
            color: "white",
            fontWeight: "bold",
            borderRadius: 2,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        />
      </DataTable.Col>
    </DataTable>
  </List>
);
