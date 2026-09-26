import ContactClient from "./ContactClient";
import getContactMetadata from "./contactMeta";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }) {
  return getContactMetadata(params);
}

export default function Page(props) {
  return <ContactClient {...props} />;
}