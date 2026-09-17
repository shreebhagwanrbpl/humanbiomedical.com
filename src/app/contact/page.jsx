import ContactClient from "./ContactClient";
import getContactMetadata from "./contactMeta";

export async function generateMetadata({ params }) {
  return getContactMetadata(params);
}

export default function Page(props) {
  return <ContactClient {...props} />;
}