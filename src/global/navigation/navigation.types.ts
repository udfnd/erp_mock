export type PrimaryNavHierarchy = {
  gigwan: { nanoId: string; name: string } | null;
  jojiks: Array<{
    nanoId: string;
    name: string;
    sueops: Array<{
      nanoId: string;
      name: string;
    }>;
  }>;
};
