import CategoryHubPage, { generateMetadata as catMetadata } from "@/app/category/[slug]/page";

export async function generateMetadata(props) {
  return catMetadata(props);
}

export default function DiagnosticEquipmentPage(props) {
  return <CategoryHubPage {...props} />;
}
